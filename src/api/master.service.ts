import { Master } from "@/supabase/schema/schema.type";
import { master_service } from "@/supabase/services/master-service";
import { useQuery } from "@tanstack/react-query";

export const useGetMastersByCategory = (categoryId: string | null) => {
  return useQuery<Master[], Error>({
    queryKey: ["masters_by_category", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      return (await master_service.getMastersByCategory(categoryId)) ?? [];
    },
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMasterWithFields = (masterId: string | null) => {
  return useQuery<Master | null, Error>({
    queryKey: ["master_with_fields", masterId],
    queryFn: async () => {
      if (!masterId) return null;
      return await master_service.getMasterWithFields(masterId);
    },
    enabled: !!masterId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllMasters = () => {
  return useQuery<Master[], Error>({
    queryKey: ["masters_all"],
    queryFn: async () => (await master_service.getAllMasters()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
