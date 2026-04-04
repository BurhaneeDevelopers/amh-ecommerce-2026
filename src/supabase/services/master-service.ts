import { supabase } from "../client";
import { Master, MasterField } from "../schema/schema.type";

class Master_Service {
    private table = "masters";
    private fieldsTable = "master_fields";

    async getAllMasters(): Promise<Master[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                fields:master_fields(*)
            `)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getMastersByCategory(categoryId: string): Promise<Master[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                fields:master_fields(*)
            `)
            .eq('category_id', categoryId)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getSingleMasterById(id: string): Promise<Master | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                fields:master_fields(*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async createNewMaster(payload: Omit<Master, 'id' | 'created_at' | 'updated_at'>): Promise<Master[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*');

        if (error) throw error;
        return data;
    }

    async updateMaster(id: string, payload: Partial<Master>): Promise<Master | null> {
        const { data, error } = await supabase.from(this.table)
            .update(payload)
            .eq("id", id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async deleteMasterById(id: string): Promise<Master[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*');

        if (error) throw error;
        return data;
    }

    // Master Fields operations
    async createMasterField(payload: Omit<MasterField, 'id' | 'created_at'>): Promise<MasterField[] | null> {
        const { data, error } = await supabase.from(this.fieldsTable)
            .insert(payload)
            .select('*');

        if (error) throw error;
        return data;
    }

    async updateMasterField(id: string, payload: Partial<MasterField>): Promise<MasterField | null> {
        const { data, error } = await supabase.from(this.fieldsTable)
            .update(payload)
            .eq("id", id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async deleteMasterField(id: string): Promise<MasterField[] | null> {
        const { data, error } = await supabase.from(this.fieldsTable)
            .delete()
            .eq("id", id)
            .select('*');

        if (error) throw error;
        return data;
    }

    async getMasterFieldsByMaster(masterId: string): Promise<MasterField[] | null> {
        const { data, error } = await supabase.from(this.fieldsTable)
            .select('*')
            .eq('master_id', masterId)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        return data;
    }
}

export const master_service = new Master_Service();
