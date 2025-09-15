import { supabase } from "../client";
import { Accessories } from "../schema/schema.type";

class Accessories_Service {
  private table = "accessories";

  async getAllAccessories(): Promise<Accessories[] | null> {
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

  async getSingleAccessoriesById(
    id: string | null
  ): Promise<Accessories | null> {
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

  async deleteAccessoriesById(id: string): Promise<Accessories[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async createNewAccessories(
    payload: Accessories
  ): Promise<Accessories[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateAccessories(payload: Accessories): Promise<Accessories | null> {
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

export const accessories_service = new Accessories_Service();
