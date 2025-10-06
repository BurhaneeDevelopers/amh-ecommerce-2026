import { Announcement } from "@/supabase/schema/schema.type";
import { announcement_service } from "@/supabase/services/announcement-service";
import { useQuery } from "@tanstack/react-query";

export const useGetActiveAnnouncement = () => {
  return useQuery<Announcement | null, Error>({
    queryKey: ["active_announcement"],
    queryFn: async () => await announcement_service.getActiveAnnouncement(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2, // Shorter stale time for active announcement
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes to check for new announcements
  });
};
