import { User_Profile } from "@/supabase/schema/schema.type";
import { users_service } from "@/supabase/services/user-service";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Use_auth = () => {
    return useQuery<User & User_Profile | null>({
        queryKey: ["auth", "user"],
        queryFn: async () => await users_service.get_current_user(),
        staleTime: 0, // Always consider data stale so refetch works immediately
        refetchOnMount: true, // Refetch when component mounts
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export const Use_create_cew_user = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: Omit<User_Profile, 'id' | 'profile_image'>) => {
            return await users_service.signup_user(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] })
        },
    })
}

export const Use_login = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: User_Profile) => {
            return await users_service.login_user(payload.email, payload.password)
        },
        onSuccess: async () => {
            // Refetch immediately for instant UI update
            await queryClient.refetchQueries({ queryKey: ["auth", "user"] })
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}

export const Use_logout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return await users_service.sign_out()
    },
    onSuccess: async () => {
      // Clear the cache and refetch for instant UI update
      queryClient.setQueryData(["auth", "user"], null)
      await queryClient.refetchQueries({ queryKey: ["auth", "user"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}