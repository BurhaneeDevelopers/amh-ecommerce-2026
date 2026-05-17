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
        // Get all main categories
        const { data: mainCategories, error: mainError } = await supabase
            .from(this.table)
            .select('*')
            .eq('is_main', true)
            .order('name', { ascending: true });

        if (mainError) throw mainError;
        if (!mainCategories) return [];

        // For each main category, count products in the category AND its subcategories (recursively)
        const categoriesWithCount = await Promise.all(
            mainCategories.map(async (category) => {
                // Get all descendant category IDs recursively
                const allCategoryIds = await this.getAllDescendantCategoryIds(category.id);

                // Count products in main category and all descendant subcategories
                const { count, error: countError } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .in('category_id', allCategoryIds)
                    .eq('status', 'active');

                if (countError) {
                    console.error('Error counting products:', countError);
                    return { ...category, product_count: 0 };
                }

                return {
                    ...category,
                    product_count: count || 0
                };
            })
        );

        return categoriesWithCount;
    }

    // Helper function to get all descendant category IDs recursively
    private async getAllDescendantCategoryIds(categoryId: string): Promise<string[]> {
        const categoryIds = [categoryId]; // Include the parent category itself
        
        // Get direct children
        const { data: children, error } = await supabase
            .from(this.table)
            .select('id')
            .eq('parent_id', categoryId);

        if (error) {
            console.error('Error fetching subcategories:', error);
            return categoryIds;
        }

        if (!children || children.length === 0) {
            return categoryIds;
        }

        // Recursively get descendants of each child
        for (const child of children) {
            const descendantIds = await this.getAllDescendantCategoryIds(child.id);
            categoryIds.push(...descendantIds);
        }

        return categoryIds;
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
