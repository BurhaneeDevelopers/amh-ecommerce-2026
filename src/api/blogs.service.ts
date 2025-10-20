import { Blog } from '@/supabase/schema/schema.type';
import { blogsService } from '@/supabase/services/blogs-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllBlogs = () => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_list_all'],
        queryFn: async () => (await blogsService.getAllBlogs()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetPublishedBlogs = () => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_list_published'],
        queryFn: async () => (await blogsService.getPublishedBlogs()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetFeaturedBlogs = () => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_list_featured'],
        queryFn: async () => (await blogsService.getFeaturedBlogs()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetBlogsByCategory = (categoryId: string) => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_by_category', categoryId],
        queryFn: async () => (await blogsService.getBlogsByCategory(categoryId)) ?? [],
        enabled: !!categoryId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetBlogsByTag = (tag: string) => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_by_tag', tag],
        queryFn: async () => (await blogsService.getBlogsByTag(tag)) ?? [],
        enabled: !!tag,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleBlog = (id: string) => {
    return useQuery<Blog | null, Error>({
        queryKey: ['blog_by_id', id],
        queryFn: async () => (await blogsService.getSingleBlogById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useGetBlogBySlug = (slug: string) => {
    return useQuery<Blog | null, Error>({
        queryKey: ['blog_by_slug', slug],
        queryFn: async () => (await blogsService.getSingleBlogBySlug(slug)),
        enabled: !!slug,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useGetRecentBlogs = (limit: number = 5) => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_recent', limit],
        queryFn: async () => (await blogsService.getRecentBlogs(limit)) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetRelatedBlogs = (blogId: string, categoryId: string, limit: number = 3) => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_related', blogId, categoryId, limit],
        queryFn: async () => (await blogsService.getRelatedBlogs(blogId, categoryId, limit)) ?? [],
        enabled: !!blogId && !!categoryId,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAllTags = () => {
    return useQuery<string[], Error>({
        queryKey: ['blogs_tags_all'],
        queryFn: async () => (await blogsService.getAllTags()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 10,
    });
};

export const useSearchBlogs = (searchTerm: string) => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs_search', searchTerm],
        queryFn: async () => (await blogsService.searchBlogs(searchTerm)) ?? [],
        enabled: !!searchTerm && searchTerm.length > 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateNewBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Blog) => blogsService.createNewBlog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_published'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_featured'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_recent'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_tags_all'] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Blog) => blogsService.updateBlog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_published'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_featured'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_recent'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_tags_all'] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogsService.deleteBlogById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_published'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_featured'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_recent'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_tags_all'] });
        },
    });
};

export const useToggleBlogPublishStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) => 
            blogsService.togglePublishStatus(id, is_published),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_published'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_featured'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_recent'] });
        },
    });
};

export const useToggleBlogFeaturedStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) => 
            blogsService.toggleFeaturedStatus(id, is_featured),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_published'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_list_featured'] });
            queryClient.invalidateQueries({ queryKey: ['blogs_recent'] });
        },
    });
};

export const useIncrementBlogViews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogsService.incrementViewCount(id),
        onSuccess: () => {
            // Don't invalidate all queries for view count updates
            // Just update specific blog queries if needed
        },
    });
};

export const useCheckBlogSlug = () => {
    return useMutation({
        mutationFn: ({ slug, excludeId }: { slug: string; excludeId?: string }) => 
            blogsService.checkSlugExists(slug, excludeId),
    });
};
