import { supabase } from "../client";
import { Wishlist } from "../schema/schema.type";

class Wishlist_Service {
  private table = "wishlist";

  async getWishlistsBasedOnUser(user_id: string): Promise<Wishlist[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`*`)
      .eq("user_id", user_id);

    if (error) throw error;

    return data;
  }

  async createNewWishlist(payload: Wishlist): Promise<Wishlist | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async deleteWishlistByUserAndProduct(payload: {
    user_id: string;
    product_id: string;
  }): Promise<Wishlist[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("product_id", payload.product_id)
      .eq("user_id", payload.user_id)
      .select("*");

    if (error) throw error;
    return data;
  }
}

export const wishlist_service = new Wishlist_Service();
