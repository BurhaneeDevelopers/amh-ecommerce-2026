import { supabase } from "../client";
import { Product } from "../schema/schema.type";

class Products_Service {
    private table = "products";

    async getAllProducts(): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                category:categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async getSingleProductById(id: string): Promise<Product | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                category:categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async getProductsBySku(sku: string): Promise<Product | null> {
        const { data, error } = await supabase.from(this.table)
            .select(`
                *,
                category:categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `)
            .eq("sku", sku)
            .single();

        if (error) throw error;
        return data;
    }

    async deleteProductById(id: string): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .delete()
            .eq("id", id)
            .select('*');

        if (error) throw error;
        return data;
    }

    async createNewProduct(payload: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product[] | null> {
        const { data, error } = await supabase.from(this.table)
            .insert(payload)
            .select('*');

        if (error) throw error;
        return data;
    }

    async updateProduct(id: string, payload: Partial<Product>): Promise<Product | null> {
        const { data, error } = await supabase.from(this.table)
            .update(payload)
            .eq("id", id)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async getProductsByCategory(categoryId: string, limit?: number): Promise<Product[] | null> {
        let query = supabase
            .from(this.table)
            .select(`
                *,
                category:categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `)
            .eq('category_id', categoryId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }

    async searchProducts(searchTerm: string, categoryId?: string): Promise<Product[] | null> {
        const { data, error } = await supabase
            .rpc('search_products', {
                search_term: searchTerm,
                category_filter: categoryId || null,
                status_filter: 'active'
            });

        if (error) throw error;
        return data;
    }

    async getProductsWithFilters(params: {
        categoryIds?: string[];
        search?: string;
        sortBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ products: Product[]; totalCount: number }> {
        let query = supabase
            .from(this.table)
            .select(`
                *,
                category:categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `, { count: 'exact' })
            .eq('status', 'active');

        // Apply category filter
        if (params.categoryIds && params.categoryIds.length > 0) {
            query = query.in('category_id', params.categoryIds);
        }

        // Apply search filter
        if (params.search) {
            query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%,description.ilike.%${params.search}%`);
        }

        // Apply sorting
        switch (params.sortBy) {
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
            case 'name_asc':
                query = query.order('name', { ascending: true });
                break;
            case 'name_desc':
                query = query.order('name', { ascending: false });
                break;
            default:
                query = query.order('name', { ascending: true });
                break;
        }

        // Apply pagination
        if (params.limit) {
            query = query.range(params.offset || 0, (params.offset || 0) + params.limit - 1);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            products: data || [],
            totalCount: count || 0
        };
    }
}

export const products_service = new Products_Service();
