import { supabase } from "../client";
import { Ad, AdPlacement } from "../schema/schema.type";

class Ads_Service {
  private table = "ads";

  async getActiveAdsByPlacement(placement: AdPlacement): Promise<Ad[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("placement", placement)
      .eq("is_active", true)
      .order("order_index", { ascending: true, nullsFirst: true });

    if (error) throw error;
    return data || [];
  }

  async getTopActiveAd(placement: AdPlacement): Promise<Ad | null> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("placement", placement)
      .eq("is_active", true)
      .lte("start_date", now)
      .or("end_date.is.null,end_date.gte." + now)
      .order("order_index", { ascending: true, nullsFirst: true })
      .limit(1)
      .maybeSingle();

    if (error && (error).code !== "PGRST116") throw error; // ignore no rows
    return data || null;
  }
}

export const ads_service = new Ads_Service();