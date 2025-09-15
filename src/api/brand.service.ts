import { Brand } from '@/supabase/schema/schema.type';
import { brands_service } from '@/supabase/services/brand-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllBrands = () => {
    return useQuery<Brand[], Error>({
        queryKey: ['brand_list_all'],
        queryFn: async () => (await brands_service.getAllBrands()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleBrand = (id: string | null) => {
    return useQuery<Brand | null, Error>({
        queryKey: ['brand_by_id'],
        queryFn: async () => (await brands_service.getSingleBrandById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Brand) => brands_service.createNewBrand(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand_list_all'] });
        },
    });
};

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Brand) => brands_service.updateBrand(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand_list_all'] });
        },
    });
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => brands_service.deleteBrandById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brand_list_all'] });
        },
    });
};