import { Ad, AdPlacement } from "@/supabase/schema/schema.type";
import { ads_service } from "@/supabase/services/ads-service";
import { useQuery } from "@tanstack/react-query";

export const useGetTopAdByPlacement = (placement: AdPlacement) => {
  return useQuery<Ad | null, Error>({
    queryKey: ["ad_top", placement],
    queryFn: async () => await ads_service.getTopActiveAd(placement),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  });
};

export const useGetAdsByPlacement = (placement: AdPlacement) => {
  return useQuery<Ad[], Error>({
    queryKey: ["ads", placement],
    queryFn: async () => await ads_service.getActiveAdsByPlacement(placement),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  });
};


