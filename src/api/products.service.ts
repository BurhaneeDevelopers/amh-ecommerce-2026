import { Product, Accessories, Spares } from '@/supabase/schema/schema.type';
import { products_service } from '@/supabase/services/products-service';
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

export const useGetAllProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['product_list_all'],
        queryFn: async () => (await products_service.getAllProducts()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetFeaturedProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['product_list_featured'],
        queryFn: async () => (await products_service.getFeaturedProducts()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: true,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetProductsById = (id: string) => {
    return useQuery<Product[], Error>({
        queryKey: ['product_by_user'],
        queryFn: async () => (await products_service.getProductsById(id)) ?? [],
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleProduct = (id: string) => {
    return useQuery<Product | null, Error>({
        queryKey: ['single_product', id],
        queryFn: async () => (await products_service.getSingleProductById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Product) => products_service.createNewProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product_list_all'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => products_service.deleteProductById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product_list_all'] });
        },
    });
};

export const useGetProductAccessories = (accessoryIds: string[]) => {
    return useQuery<Accessories[], Error>({
        queryKey: ['product_accessories', accessoryIds],
        queryFn: async () => (await products_service.getProductAccessories(accessoryIds)) ?? [],
        enabled: accessoryIds && accessoryIds.length > 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetProductSpares = (spareIds: string[]) => {
    return useQuery<Spares[], Error>({
        queryKey: ['product_spares', spareIds],
        queryFn: async () => (await products_service.getProductSpares(spareIds)) ?? [],
        enabled: spareIds && spareIds.length > 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetProductsByMainCategory = (mainCategoryId: string, limit: number = 10) => {
    return useQuery<Product[], Error>({
        queryKey: ['products_by_main_category', mainCategoryId, limit],
        queryFn: async () => (await products_service.getProductsByMainCategory(mainCategoryId, limit)) ?? [],
        enabled: !!mainCategoryId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export interface ProductFilters {
    search?: string;
    categories?: string[];
    brands?: string[];
    priceRange?: [number, number];
    sortBy?: string;
    expandedCategories?: string[]; // All category IDs including subcategories
}

export const useGetProductsInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam = 0 }) => {
            // For now, we'll use the existing service and implement client-side pagination
            // In a real app, you'd want server-side pagination
            const allProducts = await products_service.getAllProducts() ?? [];
            
            // Apply filters
            let filteredProducts = allProducts;
            
            if (filters.search) {
                filteredProducts = filteredProducts.filter(product =>
                    product.product_name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    product.model_number?.toLowerCase().includes(filters.search!.toLowerCase())
                );
            }
            
            // Use expandedCategories if available (includes subcategories), otherwise use categories
            const categoriesToFilter = filters.expandedCategories || filters.categories;
            if (categoriesToFilter && categoriesToFilter.length > 0) {
                filteredProducts = filteredProducts.filter(product =>
                    categoriesToFilter!.includes(product.category_id || '')
                );
            }
            
            if (filters.brands && filters.brands.length > 0) {
                filteredProducts = filteredProducts.filter(product =>
                    filters.brands!.includes(product.brand_id || '')
                );
            }
            
            // Apply sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'newest':
                        filteredProducts.sort((a, b) => 
                            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
                        );
                        break;
                    case 'name_asc':
                        filteredProducts.sort((a, b) => 
                            (a.product_name || '').localeCompare(b.product_name || '')
                        );
                        break;
                    case 'name_desc':
                        filteredProducts.sort((a, b) => 
                            (b.product_name || '').localeCompare(a.product_name || '')
                        );
                        break;
                    default:
                        // Featured - no sorting needed
                        break;
                }
            }
            
            // Implement pagination
            const pageSize = 12;
            const start = pageParam * pageSize;
            const end = start + pageSize;
            const paginatedProducts = filteredProducts.slice(start, end);
            
            return {
                products: paginatedProducts,
                nextPage: end < filteredProducts.length ? pageParam + 1 : undefined,
                totalCount: filteredProducts.length,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData, // Keep previous data while loading
        refetchOnMount: false, // Don't refetch when component mounts again
    });
};