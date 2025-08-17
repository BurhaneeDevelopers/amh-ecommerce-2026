import { User_Profile } from "@/supabase/schema/schema.type";
import { users_service } from "@/supabase/services/user-service";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Use_auth = () => {
    return useQuery<User | null>({
        queryKey: ["auth", "user"],
        queryFn: async () => await users_service.get_current_user(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export const Use_create_cew_user = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: User_Profile) => {
            return await users_service.signup_user(payload.email, payload.password)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}

export const Use_login = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: User_Profile) => {
            return await users_service.login_user(payload.email, payload.password)
        },
        onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}