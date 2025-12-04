import { Product } from '@/supabase/schema/schema.type';
import { supabase } from '@/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Search products by query string
 * Searches in product_name, model_number, and specifications
 */
const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('products')
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
    .or(`product_name.ilike.%${searchTerm}%,model_number.ilike.%${searchTerm}%`)
    .limit(20);

  if (error) throw error;
  return data || [];
};

/**
 * React Query hook for searching products with debouncing
 */
export const useSearchProducts = (query: string, enabled: boolean = true) => {
  return useQuery<Product[], Error>({
    queryKey: ['search_products', query],
    queryFn: () => searchProducts(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
