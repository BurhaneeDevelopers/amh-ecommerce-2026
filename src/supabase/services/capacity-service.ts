import { supabase } from "../client";
import { Capacity } from "../schema/schema.type";

class Capacity_Service {
    private table = "capacity";

    async getAllCapacity(): Promise<Capacity[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getSingleCapacityById(id: string | null): Promise<Capacity | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("id", id)
            .single()

        if (error) throw error;
        return data;
    }

    async deleteCapacityById(id: string): Promise<Capacity[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*')

        if (error) throw error;
        return data;
    }

    async createNewCapacity(payload: Capacity): Promise<Capacity[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*')

        if (error) throw error;
        return data;
    }

    async updateCapacity(payload: Capacity): Promise<Capacity | null> {
        const { data, error } = await supabase.from(this.table)
            .update(payload)
            .eq("id", payload.id)
            .select('*')
            .single()

        if (error) throw error;
        return data;
    }
}

export const capacity_service = new Capacity_Service();
