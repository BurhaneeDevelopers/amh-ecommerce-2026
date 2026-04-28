import { supabase } from "../client";
import { Master } from "../schema/schema.type";

class Master_Service {
    private table = "masters";
    private fieldsTable = "master_fields";
    private valuesTable = "master_values";

    async getMastersByCategory(categoryId: string): Promise<Master[] | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select(`
                *,
                fields:master_fields(
                    *,
                    values:master_values(*)
                )
            `)
            .eq('category_id', categoryId)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getMasterWithFields(masterId: string): Promise<Master | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select(`
                *,
                fields:master_fields(
                    *,
                    values:master_values(*)
                )
            `)
            .eq('id', masterId)
            .single();

        if (error) throw error;
        return data;
    }

    async getAllMasters(): Promise<Master[] | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }
}

export const master_service = new Master_Service();
