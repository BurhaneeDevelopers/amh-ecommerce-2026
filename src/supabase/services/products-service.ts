import { supabase } from "../client";
import { Product } from "../schema/schema.type";

class Products_Service {
    private table = "products";

    async getAllProducts(): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getProductsById(id: string): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("id", id)

        if (error) throw error;
        return data;
    }

    async getSingleProductById(id: string): Promise<Product | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("id", id)
            .single()

        if (error) throw error;
        return data;
    }

    async deleteProductById(id: string): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*')

        if (error) throw error;
        return data;
    }

    async createNewProduct(payload: Product): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*')

        if (error) throw error;
        return data;
    }
}

export const products_service = new Products_Service();