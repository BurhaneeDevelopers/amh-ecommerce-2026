import { supabase } from "../client";
import { Announcement } from "../schema/schema.type";
import { getCurrentISTString } from "@/lib/date-utils";

class Announcement_Service {
  private table = "announcements";

  async getActiveAnnouncement(): Promise<Announcement | null> {
    const currentDateTime = getCurrentISTString();

    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .lte("start_date", currentDateTime)  // start_date should be <= current time
      .gte("end_date", currentDateTime)    // end_date should be >= current time
      .single();

    if (error) throw error;
    return data;
  }
}

export const announcement_service = new Announcement_Service();
