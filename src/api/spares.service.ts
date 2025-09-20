import { Spares } from '@/supabase/schema/schema.type';
import { spares_service } from '@/supabase/services/spares-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllSpares = () => {
    return useQuery<Spares[], Error>({
        queryKey: ['spares_list_all'],
        queryFn: async () => (await spares_service.getAllSpares()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleSpare = (id: string | null) => {
    return useQuery<Spares | null, Error>({
        queryKey: ['spare_by_id', id],
        queryFn: async () => (await spares_service.getSingleSpareById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewSpare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Spares) => spares_service.createNewSpare(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spares_list_all'] });
        },
    });
};

export const useUpdateSpare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Spares) => spares_service.updateSpare(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spares_list_all'] });
        },
    });
};

export const useDeleteSpare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => spares_service.deleteSpareById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['spares_list_all'] });
        },
    });
};
