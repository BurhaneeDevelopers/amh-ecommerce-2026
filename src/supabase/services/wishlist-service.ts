import { supabase } from "../client";
import { Wishlist } from "../schema/schema.type";

class Wishlist_Service {
    private table = "wishlist";

    async getAllWishlists(): Promise<Wishlist[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getWishlistsBasedOnUser(user_id: string): Promise<Wishlist[] | null> {

        const { data, error } = await supabase.from(this.table)
            .select(`*`)
            .eq("user_id", user_id)

        if (error) throw error;

        return data;
    }

    // async createNewWishlist({
        
    // }: Wishlist): Promise<Wishlist[] | null> {


    //     const { data, error } = await supabase.from(this.table)
    //         .insert()
    //         .select('*')

    //     if (error) throw error;
    //     return data;
    // }
}

export const wishlist_service = new Wishlist_Service();