import { supabase } from "../client";
import { Spares } from "../schema/schema.type";

class Spares_Service {
  private table = "spares";

  async getAllSpares(): Promise<Spares[] | null> {
    const { data, error } = await supabase.from(this.table).select(`
          *,
          category:category_id (
            id,
            category_name
          )
        `);

    if (error) throw error;
    return data;
  }

  async getSingleSpareById(
    id: string | null
  ): Promise<Spares | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(
        `
          *,
          category:category_id (
            id,
            category_name
          )
        `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSpareById(id: string): Promise<Spares[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async createNewSpare(payload: Spares): Promise<Spares[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateSpare(payload: Spares): Promise<Spares | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", payload.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}

export const spares_service = new Spares_Service();
