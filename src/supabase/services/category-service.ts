import { supabase } from "../client";
import { Category } from "../schema/schema.type";

class Categories_Service {
    private table = "categories";

    async getAllCategories(): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getMainCategories(): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('is_main', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getMainCategoriesWithSubcategories(): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                subcategories:categories!parent_id(*)
            `)
            .eq('is_main', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getSubcategoriesByParentId(parentId: string): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('parent_id', parentId)
            .eq('is_main', false)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getAllCategoriesWithProductCount(): Promise<(Category & { product_count: number })[] | null> {
        const { data, error } = await supabase
            .from(this.table)
            .select(`
                *,
                products:products(count)
            `)
            .order('name', { ascending: true });

        if (error) throw error;

        // Transform the data to include product_count
        return data?.map(cat => ({
            ...cat,
            product_count: cat.products?.[0]?.count || 0
        })) || [];
    }

    async getSingleCategoryById(id: string | null): Promise<Category | null> {
        if (!id) return null;

        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                parent:categories!parent_id(*),
                subcategories:categories!parent_id(*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async getCategoryWithSubcategories(id: string): Promise<Category | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                subcategories:categories!parent_id(*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async createNewCategory(payload: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*');

        if (error) throw error;
        return data;
    }

    async updateCategory(id: string, payload: Partial<Category>): Promise<Category | null> {
        const { data, error } = await supabase.from(this.table)
            .update(payload)
            .eq("id", id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async deleteCategoryById(id: string): Promise<Category[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*');

        if (error) throw error;
        return data;
    }
}

export const categories_service = new Categories_Service();
