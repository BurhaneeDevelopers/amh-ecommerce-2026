import { ProductComment, CommentStatus } from '@/supabase/schema/schema.type';
import { commentsService } from '@/supabase/services/comment-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ========== Query Hooks ==========

export const useGetAllComments = () => {
    return useQuery<ProductComment[], Error>({
        queryKey: ['comments_list_all'],
        queryFn: async () => {
            const result = await commentsService.getAllComments();
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetCommentsByStatus = (status: CommentStatus) => {
    return useQuery<ProductComment[], Error>({
        queryKey: ['comments_by_status', status],
        queryFn: async () => {
            const result = await commentsService.getCommentsByStatus(status);
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleComment = (id: string) => {
    return useQuery<ProductComment | null, Error>({
        queryKey: ['comment_by_id', id],
        queryFn: async () => {
            const result = await commentsService.getSingleCommentById(id);
            if (result.error) throw new Error(result.error);
            return result.data;
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useGetProductComments = (productId: string) => {
    return useQuery<ProductComment[], Error>({
        queryKey: ['product_comments', productId],
        queryFn: async () => {
            const result = await commentsService.getApprovedCommentsByProduct(productId);
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
        enabled: !!productId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetFeaturedComments = (productId: string, limit: number = 3) => {
    return useQuery<ProductComment[], Error>({
        queryKey: ['featured_comments', productId, limit],
        queryFn: async () => {
            const result = await commentsService.getFeaturedCommentsByProduct(productId, limit);
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
        enabled: !!productId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetProductCommentStats = (productId: string) => {
    return useQuery({
        queryKey: ['product_comment_stats', productId],
        queryFn: async () => {
            const result = await commentsService.getProductCommentStats(productId);
            if (result.error) throw new Error(result.error);
            return result.data;
        },
        enabled: !!productId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetUserComments = (userId: string) => {
    return useQuery<ProductComment[], Error>({
        queryKey: ['user_comments', userId],
        queryFn: async () => {
            const result = await commentsService.getUserComments(userId);
            if (result.error) throw new Error(result.error);
            return result.data ?? [];
        },
        enabled: !!userId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetCommentStatistics = () => {
    return useQuery({
        queryKey: ['comment_statistics'],
        queryFn: async () => {
            const result = await commentsService.getCommentStatistics();
            if (result.error) throw new Error(result.error);
            return result.data;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

// ========== Mutation Hooks ==========

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<ProductComment, "id" | "created_at" | "updated_at" | "status" | "helpful_count">) => {
            return commentsService.createNewComment(payload);
        },
        onSuccess: (result, variables) => {
            if (result.error) throw new Error(result.error);

            // Invalidate relevant queries regardless of whether we got data back
            // This ensures admin dashboards and statistics are updated
            queryClient.invalidateQueries({ queryKey: ['comments_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['comments_by_status', 'pending'] });
            queryClient.invalidateQueries({ queryKey: ['product_comments', variables.product_id] });
            queryClient.invalidateQueries({ queryKey: ['comment_statistics'] });
        },
    });
};

export const useUpdateCommentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, adminId, adminNotes }: {
            id: string;
            status: CommentStatus;
            adminId: string;
            adminNotes?: string
        }) => {
            return commentsService.updateCommentStatus(id, status, adminId, adminNotes);
        },
        onSuccess: (result, variables) => {
            if (result.error) throw new Error(result.error);
            queryClient.invalidateQueries({ queryKey: ['comments_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['comments_by_status'] });
            queryClient.invalidateQueries({ queryKey: ['comment_by_id', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['comment_statistics'] });
        },
    });
};

export const useToggleFeaturedStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
            return commentsService.toggleFeaturedStatus(id, isFeatured);
        },
        onSuccess: (result, variables) => {
            if (result.error) throw new Error(result.error);
            queryClient.invalidateQueries({ queryKey: ['comments_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['comments_by_status', 'approved'] });
            queryClient.invalidateQueries({ queryKey: ['comment_by_id', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['featured_comments'] });
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            return commentsService.deleteCommentById(id);
        },
        onSuccess: (result) => {
            if (result.error) throw new Error(result.error);
            queryClient.invalidateQueries({ queryKey: ['comments_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['comments_by_status'] });
            queryClient.invalidateQueries({ queryKey: ['comment_statistics'] });
        },
    });
};

export const useMarkCommentHelpful = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, userId, isHelpful }: {
            commentId: string;
            userId: string;
            isHelpful: boolean
        }) => {
            return commentsService.markCommentHelpful(commentId, userId, isHelpful);
        },
        onSuccess: (result, variables) => {
            if (result.error) throw new Error(result.error);
            queryClient.invalidateQueries({ queryKey: ['comment_by_id', variables.commentId] });
            queryClient.invalidateQueries({ queryKey: ['product_comments'] });
        },
    });
};

export const useAddCommentReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, adminId, replyText, isPublic = true }: {
            commentId: string;
            adminId: string;
            replyText: string;
            isPublic?: boolean
        }) => {
            return commentsService.addCommentReply(commentId, adminId, replyText, isPublic);
        },
        onSuccess: (result, variables) => {
            if (result.error) throw new Error(result.error);
            queryClient.invalidateQueries({ queryKey: ['comment_by_id', variables.commentId] });
            queryClient.invalidateQueries({ queryKey: ['comments_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['comments_by_status', 'approved'] });
        },
    });
};