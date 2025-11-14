import { Product } from "@/supabase/schema/schema.type";
import { bestseller_service } from "@/supabase/services/bestseller-service";
import { useQuery } from "@tanstack/react-query";

export const useGetBestsellerProducts = (limit: number = 4) => {
  return useQuery<Product[], Error>({
    queryKey: ["bestseller_products", limit],
    queryFn: async () => await bestseller_service.getBestsellerProducts(limit),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });
};
