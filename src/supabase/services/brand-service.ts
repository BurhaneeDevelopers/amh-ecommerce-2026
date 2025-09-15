import { supabase } from "../client";
import { Brand } from "../schema/schema.type";

class Brands_Service {
    private table = "brand";

    async getAllBrands(): Promise<Brand[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getSingleBrandById(id: string | null): Promise<Brand | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("id", id)
            .single()

        if (error) throw error;
        return data;
    }

    async deleteBrandById(id: string): Promise<Brand[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*')

        if (error) throw error;
        return data;
    }

    async createNewBrand(payload: Brand): Promise<Brand[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*')

        if (error) throw error;
        return data;
    }

    async updateBrand(payload: Brand): Promise<Brand | null> {
        const { data, error } = await supabase.from(this.table)
            .update(payload)
            .eq("id", payload.id)
            .select('*')
            .single()

        if (error) throw error;
        return data;
    }
}

export const brands_service = new Brands_Service();