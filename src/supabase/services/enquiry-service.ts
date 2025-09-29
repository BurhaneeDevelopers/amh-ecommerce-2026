import { supabase } from "../client";
import { Enquiry } from "../schema/schema.type";

class Enquiry_Service {
  private table = "enquiry";

  async createNewEnquiry(payload: Enquiry): Promise<Enquiry | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}

export const enquiry_service = new Enquiry_Service();
