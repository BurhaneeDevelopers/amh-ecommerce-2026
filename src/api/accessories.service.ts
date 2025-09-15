import { Accessories } from '@/supabase/schema/schema.type';
import { accessories_service } from '@/supabase/services/accessories-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllAccessories = () => {
    return useQuery<Accessories[], Error>({
        queryKey: ['accessories_list_all'],
        queryFn: async () => (await accessories_service.getAllAccessories()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleAccessories = (id: string | null) => {
    return useQuery<Accessories | null, Error>({
        queryKey: ['accessories_by_id'],
        queryFn: async () => (await accessories_service.getSingleAccessoriesById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewAccessories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Accessories) => accessories_service.createNewAccessories(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessories_list_all'] });
        },
    });
};

export const useUpdateAccessories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Accessories) => accessories_service.updateAccessories(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessories_list_all'] });
        },
    });
};

export const useDeleteAccessories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => accessories_service.deleteAccessoriesById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accessories_list_all'] });
        },
    });
};