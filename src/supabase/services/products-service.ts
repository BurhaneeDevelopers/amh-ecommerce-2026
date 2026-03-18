import { supabase } from "../client";
import { Product, Accessories, Spares } from "../schema/schema.type";

class Products_Service {
    private table = "products";

    async getAllProducts(): Promise<Product[] | null> {
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
                    )
                `)

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

    async getProductsByCategoryIds(categoryIds: string[]): Promise<Product[] | null> {
        if (!categoryIds || categoryIds.length === 0) return [];

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
            .in('category_id', categoryIds);

        if (error) throw error;
        return data;
    }

    async getProductsForFeaturedCategories(): Promise<Product[] | null> {
        // Get all featured categories
        const { data: featuredCategories, error: catError } = await supabase
            .from('category')
            .select('id, type, parent_id')
            .eq('is_featured', true)
            .order('order', { ascending: true });

        if (catError) throw catError;
        if (!featuredCategories || featuredCategories.length === 0) return [];

        // Collect all category IDs (main + their subcategories)
        const allCategoryIds = new Set<string>();
        
        for (const cat of featuredCategories) {
            if (cat.id) allCategoryIds.add(cat.id);
            
            // If it's a main category, get its subcategories
            if (cat.type === 'main') {
                const { data: subs } = await supabase
                    .from('category')
                    .select('id')
                    .eq('parent_id', cat.id);
                
                subs?.forEach(sub => {
                    if (sub.id) allCategoryIds.add(sub.id);
                });
            }
        }

        // Fetch all products for these categories
        return this.getProductsByCategoryIds(Array.from(allCategoryIds));
    }

    async getProductsWithFilters(params: {
        categoryIds?: string[];
        brandIds?: string[];
        search?: string;
        sortBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ products: Product[]; totalCount: number }> {
        let query = supabase
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
                    type,
                    parent_id,
                    is_featured,
                    order
                )
            `, { count: 'exact' });

        // Apply category filter
        if (params.categoryIds && params.categoryIds.length > 0) {
            query = query.in('category_id', params.categoryIds);
        }

        // Apply brand filter
        if (params.brandIds && params.brandIds.length > 0) {
            query = query.in('brand_id', params.brandIds);
        }

        // Apply search filter
        if (params.search) {
            query = query.or(`product_name.ilike.%${params.search}%,model_number.ilike.%${params.search}%`);
        }

        // Apply sorting
        switch (params.sortBy) {
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
            case 'name_asc':
                query = query.order('product_name', { ascending: true });
                break;
            case 'name_desc':
                query = query.order('product_name', { ascending: false });
                break;
            default:
                // Default sorting by category order and product name
                query = query.order('product_name', { ascending: true });
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