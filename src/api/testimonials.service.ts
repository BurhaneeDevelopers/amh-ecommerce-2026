import { Testimonial } from '@/supabase/schema/schema.type';
import { testimonialsService } from '@/supabase/services/testimonials-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllTestimonials = () => {
    return useQuery<Testimonial[], Error>({
        queryKey: ['testimonials_list_all'],
        queryFn: async () => (await testimonialsService.getAllTestimonials()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetActiveTestimonials = () => {
    return useQuery<Testimonial[], Error>({
        queryKey: ['testimonials_list_active'],
        queryFn: async () => (await testimonialsService.getActiveTestimonials()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetFeaturedTestimonials = () => {
    return useQuery<Testimonial[], Error>({
        queryKey: ['testimonials_list_featured'],
        queryFn: async () => (await testimonialsService.getFeaturedTestimonials()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleTestimonial = (id: string) => {
    return useQuery<Testimonial | null, Error>({
        queryKey: ['testimonial_by_id', id],
        queryFn: async () => (await testimonialsService.getSingleTestimonialById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useCreateNewTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Testimonial) => testimonialsService.createNewTestimonial(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Testimonial) => testimonialsService.updateTestimonial(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => testimonialsService.deleteTestimonialById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};

export const useToggleTestimonialStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => 
            testimonialsService.toggleTestimonialStatus(id, is_active),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};

export const useToggleTestimonialFeatured = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) => 
            testimonialsService.toggleFeaturedStatus(id, is_featured),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};

export const useUpdateTestimonialOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, order_index }: { id: string; order_index: number }) => 
            testimonialsService.updateOrderIndex(id, order_index),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_active'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials_list_featured'] });
        },
    });
};
