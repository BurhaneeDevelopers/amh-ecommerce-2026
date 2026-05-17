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
                ),
                product_master_values (
                    id,
                    master_values (
                        id,
                        value,
                        master_fields (
                            id,
                            label,
                            unit,
                            masters (
                                id,
                                name,
                                icon,
                                color
                            )
                        )
                    )
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
                ),
                product_master_values (
                    id,
                    master_values (
                        id,
                        value,
                        master_fields (
                            id,
                            label,
                            unit,
                            sort_order,
                            masters (
                                id,
                                name,
                                icon,
                                color
                            )
                        )
                    )
                ),
                product_variants (
                    id,
                    variant_name,
                    sku_suffix,
                    sort_order,
                    product_variant_values (
                        id,
                        value,
                        master_field:master_fields (
                            id,
                            label,
                            unit,
                            sort_order
                        )
                    )
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
                ),
                product_master_values (
                    id,
                    master_values (
                        id,
                        value,
                        master_fields (
                            id,
                            label,
                            unit,
                            masters (
                                id,
                                name,
                                icon,
                                color
                            )
                        )
                    )
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
        // First, get all descendant category IDs (subcategories at all levels)
        const categoryIds = await this.getAllDescendantCategoryIds(categoryId);
        
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
                ),
                product_master_values (
                    id,
                    master_values (
                        id,
                        value,
                        master_fields (
                            id,
                            label,
                            unit,
                            masters (
                                id,
                                name,
                                icon,
                                color
                            )
                        )
                    )
                )
            `)
            .in('category_id', categoryIds)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }

    // Helper function to get all descendant category IDs recursively
    private async getAllDescendantCategoryIds(categoryId: string): Promise<string[]> {
        const categoryIds = [categoryId]; // Include the parent category itself
        
        // Get direct children
        const { data: children, error } = await supabase
            .from('categories')
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
                ),
                product_master_values (
                    id,
                    master_values (
                        id,
                        value,
                        master_fields (
                            id,
                            label,
                            unit,
                            masters (
                                id,
                                name,
                                icon,
                                color
                            )
                        )
                    )
                )
            `, { count: 'exact' })
            .eq('status', 'active');

        // Apply category filter (including all descendant categories)
        if (params.categoryIds && params.categoryIds.length > 0) {
            // Get all descendant category IDs for each provided category
            const allCategoryIds: string[] = [];
            for (const categoryId of params.categoryIds) {
                const descendantIds = await this.getAllDescendantCategoryIds(categoryId);
                allCategoryIds.push(...descendantIds);
            }
            // Remove duplicates
            const uniqueCategoryIds = [...new Set(allCategoryIds)];
            query = query.in('category_id', uniqueCategoryIds);
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
