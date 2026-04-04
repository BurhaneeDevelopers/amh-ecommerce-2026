import { Master, MasterField } from '@/supabase/schema/schema.type';
import { master_service } from '@/supabase/services/master-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllMasters = () => {
    return useQuery<Master[], Error>({
        queryKey: ['master_list_all'],
        queryFn: async () => (await master_service.getAllMasters()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetMastersByCategory = (categoryId: string) => {
    return useQuery<Master[], Error>({
        queryKey: ['masters_by_category', categoryId],
        queryFn: async () => (await master_service.getMastersByCategory(categoryId)) ?? [],
        enabled: !!categoryId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleMaster = (id: string) => {
    return useQuery<Master | null, Error>({
        queryKey: ['master_by_id', id],
        queryFn: async () => await master_service.getSingleMasterById(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewMaster = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<Master, 'id' | 'created_at' | 'updated_at'>) =>
            master_service.createNewMaster(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['masters_by_category'] });
        },
    });
};

export const useUpdateMaster = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Master> }) =>
            master_service.updateMaster(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['masters_by_category'] });
            queryClient.invalidateQueries({ queryKey: ['master_by_id'] });
        },
    });
};

export const useDeleteMaster = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => master_service.deleteMasterById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['masters_by_category'] });
        },
    });
};

// Master Field hooks
export const useGetMasterFieldsByMaster = (masterId: string) => {
    return useQuery<MasterField[], Error>({
        queryKey: ['master_fields_by_master', masterId],
        queryFn: async () => (await master_service.getMasterFieldsByMaster(masterId)) ?? [],
        enabled: !!masterId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateMasterField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<MasterField, 'id' | 'created_at'>) =>
            master_service.createMasterField(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_fields_by_master'] });
            queryClient.invalidateQueries({ queryKey: ['master_by_id'] });
        },
    });
};

export const useUpdateMasterField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<MasterField> }) =>
            master_service.updateMasterField(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_fields_by_master'] });
            queryClient.invalidateQueries({ queryKey: ['master_by_id'] });
        },
    });
};

export const useDeleteMasterField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => master_service.deleteMasterField(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['master_fields_by_master'] });
            queryClient.invalidateQueries({ queryKey: ['master_by_id'] });
        },
    });
};
