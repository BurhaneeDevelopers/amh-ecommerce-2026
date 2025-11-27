import { supabase } from "../client";
import { Product, Accessories, Spares } from "../schema/schema.type";

class Products_Service {
    private table = "products";

    async getAllProducts(): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getFeaturedProducts(): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('is_featured', true)

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
            .select(`
                *,
                brand:brand_id (
                    id,
                    brand_name,
                    brand_logo
                ),
                category:category_id (
                    id,
                    category_name,
                    type
                ),
                capacity_data:capacity (
                    id,
                    capacity_name,
                    slug
                )
            `)
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

    async getProductAccessories(accessoryIds: string[]): Promise<Accessories[] | null> {
        if (!accessoryIds || accessoryIds.length === 0) return [];
        
        const { data, error } = await supabase
            .from('accessories')
            .select(`
                *,
                category:category_id (
                    id,
                    category_name
                )
            `)
            .in('id', accessoryIds);

        if (error) throw error;
        return data;
    }

    async getProductSpares(spareIds: string[]): Promise<Spares[] | null> {
        if (!spareIds || spareIds.length === 0) return [];
        
        const { data, error } = await supabase
            .from('spares')
            .select(`
                *,
                category:category_id (
                    id,
                    category_name
                )
            `)
            .in('id', spareIds);

        if (error) throw error;
        return data;
    }

    async getProductsByMainCategory(mainCategoryId: string, limit: number = 10): Promise<Product[] | null> {
        // First, get all subcategory IDs for this main category
        const { data: subcategories, error: subError } = await supabase
            .from('category')
            .select('id')
            .eq('parent_id', mainCategoryId);

        if (subError) throw subError;

        const subcategoryIds = subcategories?.map(sub => sub.id) || [];
        const allCategoryIds = [mainCategoryId, ...subcategoryIds];

        // Fetch products that belong to main category or any of its subcategories
        const { data, error } = await supabase
            .from(this.table)
            .select(`
                *,
                brand:brand_id (
                    id,
                    brand_name,
                    brand_logo
                ),
                category:category_id (
                    id,
                    category_name,
                    type
                )
            `)
            .in('category_id', allCategoryIds)
            .limit(limit);

        if (error) throw error;
        return data;
    }
}

export const products_service = new Products_Service();