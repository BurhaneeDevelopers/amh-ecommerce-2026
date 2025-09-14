import { Wishlist, WishlistWithProduct } from "@/supabase/schema/schema.type";
import { wishlist_service } from "@/supabase/services/wishlist-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetWishlistByUser = (id: string) => {
  return useQuery<WishlistWithProduct[], Error>({
    queryKey: ["wishlist_by_user"],
    queryFn: async () =>
      (await wishlist_service.getWishlistsBasedOnUser(id)) ?? [],
    enabled: !!id,
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateNewWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Wishlist) =>
      wishlist_service.createNewWishlist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist_list_all"] });
    },
  });
};

export const useDeleteWishlist = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { user_id: string; product_id: string }) =>
      wishlist_service.deleteWishlistByUserAndProduct(payload),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["wishlist_by_user"] });
    // },
  });
};
