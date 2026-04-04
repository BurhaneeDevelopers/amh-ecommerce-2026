import { Product } from '@/supabase/schema/schema.type';
import { products_service } from '@/supabase/services/products-service';
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

export const useGetAllProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['product_list_all'],
        queryFn: async () => (await products_service.getAllProducts()) ?? [],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleProduct = (id: string) => {
    return useQuery<Product | null, Error>({
        queryKey: ['single_product', id],
        queryFn: async () => (await products_service.getSingleProductById(id)),
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetProductBySku = (sku: string) => {
    return useQuery<Product | null, Error>({
        queryKey: ['product_by_sku', sku],
        queryFn: async () => (await products_service.getProductsBySku(sku)),
        enabled: !!sku,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateNewProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => 
            products_service.createNewProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product_list_all'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => 
            products_service.updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product_list_all'] });
            queryClient.invalidateQueries({ queryKey: ['single_product'] });
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

export const useGetProductsByCategory = (categoryId: string, limit?: number) => {
    return useQuery<Product[], Error>({
        queryKey: ['products_by_category', categoryId, limit],
        queryFn: async () => (await products_service.getProductsByCategory(categoryId, limit)) ?? [],
        enabled: !!categoryId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useSearchProducts = (searchTerm: string, categoryId?: string) => {
    return useQuery<Product[], Error>({
        queryKey: ['search_products', searchTerm, categoryId],
        queryFn: async () => (await products_service.searchProducts(searchTerm, categoryId)) ?? [],
        enabled: !!searchTerm,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 5,
    });
};

export interface ProductFilters {
    search?: string;
    categories?: string[];
    sortBy?: string;
}

export const useGetProductsInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = 24;
            
            const { products, totalCount } = await products_service.getProductsWithFilters({
                categoryIds: filters.categories,
                search: filters.search,
                sortBy: filters.sortBy,
                limit: pageSize,
                offset: pageParam * pageSize
            });
            
            return {
                products,
                nextPage: (pageParam + 1) * pageSize < totalCount ? pageParam + 1 : undefined,
                totalCount,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });
};

interface CategoryGroup {
    categoryId: string;
    categoryName: string;
    products: Product[];
}

export const useGetProductsByCategoryInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_by_category_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = 24;
            
            const { products, totalCount } = await products_service.getProductsWithFilters({
                categoryIds: filters.categories,
                search: filters.search,
                sortBy: filters.sortBy,
                limit: pageSize,
                offset: pageParam * pageSize
            });

            // Group products by category
            const categoryGroups: CategoryGroup[] = [];
            const categoryMap = new Map<string, CategoryGroup>();

            products.forEach(product => {
                const catId = product.category_id;
                if (!catId) return;

                if (!categoryMap.has(catId)) {
                    const category = product.category;
                    
                    categoryGroups.push({
                        categoryId: catId,
                        categoryName: category?.name || 'Unknown',
                        products: []
                    });
                    categoryMap.set(catId, categoryGroups[categoryGroups.length - 1]);
                }

                categoryMap.get(catId)!.products.push(product);
            });

            // Sort by category name
            categoryGroups.sort((a, b) => a.categoryName.localeCompare(b.categoryName));

            return {
                categoryGroups,
                nextPage: (pageParam + 1) * pageSize < totalCount ? pageParam + 1 : undefined,
                totalCount,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });
};
