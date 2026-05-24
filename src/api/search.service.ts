import { Product } from '@/supabase/schema/schema.type';
import { supabase } from '@/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Search products by query string
 * Searches in name, sku, and description
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
      category:categories (
        id,
        name,
        description,
        color,
        icon
      )
    `)
    .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
    .eq('status', 'active')
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
    retry: false, // Prevents multiple API retries on search inputs
  });
};
