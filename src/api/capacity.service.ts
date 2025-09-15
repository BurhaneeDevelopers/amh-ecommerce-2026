import { Capacity } from '@/supabase/schema/schema.type';
import { capacity_service } from '@/supabase/services/capacity-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllCapacity = () => {
    return useQuery<Capacity[], Error>({
        queryKey: ['capacity_list_all'],
        queryFn: async () => (await capacity_service.getAllCapacity()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleCapacity = (id: string | null) => {
    return useQuery<Capacity | null, Error>({
        queryKey: ['capacity_by_id'],
        queryFn: async () => (await capacity_service.getSingleCapacityById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewCapacity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Capacity) => capacity_service.createNewCapacity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['capacity_list_all'] });
        },
    });
};

export const useUpdateCapacity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Capacity) => capacity_service.updateCapacity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['capacity_list_all'] });
        },
    });
};

export const useDeleteCapacity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => capacity_service.deleteCapacityById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['capacity_list_all'] });
        },
    });
};