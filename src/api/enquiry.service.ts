import { Enquiry } from "@/supabase/schema/schema.type";
import { enquiry_service } from "@/supabase/services/enquiry-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateNewEnquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Enquiry) =>
      enquiry_service.createNewEnquiry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiry_list_all"] });
    },
  });
};
