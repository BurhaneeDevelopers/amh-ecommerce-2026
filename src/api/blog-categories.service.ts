import { BlogCategory } from '@/supabase/schema/schema.type';
import { blogCategoriesService } from '@/supabase/services/blog-categories-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllBlogCategories = () => {
    return useQuery<BlogCategory[], Error>({
        queryKey: ['blog_categories_list_all'],
        queryFn: async () => (await blogCategoriesService.getAllBlogCategories()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetActiveBlogCategories = () => {
    return useQuery<BlogCategory[], Error>({
        queryKey: ['blog_categories_list_active'],
        queryFn: async () => (await blogCategoriesService.getActiveBlogCategories()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleBlogCategory = (id: string) => {
    return useQuery<BlogCategory | null, Error>({
        queryKey: ['blog_category_by_id', id],
        queryFn: async () => (await blogCategoriesService.getSingleBlogCategoryById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useGetBlogCategoryBySlug = (slug: string) => {
    return useQuery<BlogCategory | null, Error>({
        queryKey: ['blog_category_by_slug', slug],
        queryFn: async () => (await blogCategoriesService.getSingleBlogCategoryBySlug(slug)),
        enabled: !!slug,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useCreateNewBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BlogCategory) => blogCategoriesService.createNewBlogCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_active'] });
        },
    });
};

export const useUpdateBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: BlogCategory) => blogCategoriesService.updateBlogCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_active'] });
        },
    });
};

export const useDeleteBlogCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => blogCategoriesService.deleteBlogCategoryById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_active'] });
        },
    });
};

export const useToggleBlogCategoryStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => 
            blogCategoriesService.toggleCategoryStatus(id, is_active),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['blog_categories_list_active'] });
        },
    });
};

export const useCheckBlogCategorySlug = () => {
    return useMutation({
        mutationFn: ({ slug, excludeId }: { slug: string; excludeId?: string }) => 
            blogCategoriesService.checkSlugExists(slug, excludeId),
    });
};
