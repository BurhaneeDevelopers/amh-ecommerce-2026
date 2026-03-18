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

interface CategoryGroup {
    categoryId: string;
    categoryName: string;
    categoryType: 'main' | 'sub';
    parentId: string | null;
    parentName: string | null;
    isFeatured: boolean;
    order: number;
    products: Product[];
}

export const useGetProductsInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = 24;
            
            // Server-side filtering and pagination
            const { products, totalCount } = await products_service.getProductsWithFilters({
                categoryIds: filters.expandedCategories || filters.categories,
                brandIds: filters.brands,
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

// New hook for category-based infinite loading with server-side filtering
export const useGetProductsByCategoryInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_by_category_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = 24; // Load 24 products per page
            
            // Server-side filtering and pagination
            const { products, totalCount } = await products_service.getProductsWithFilters({
                categoryIds: filters.expandedCategories || filters.categories,
                brandIds: filters.brands,
                search: filters.search,
                sortBy: filters.sortBy,
                limit: pageSize,
                offset: pageParam * pageSize
            });

            // Group products by category for display
            const categoryGroups: CategoryGroup[] = [];
            const categoryMap = new Map<string, CategoryGroup>();

            products.forEach(product => {
                const catId = product.category_id;
                if (!catId) return;

                if (!categoryMap.has(catId)) {
                    const category = product.category as { 
                        id?: string; 
                        category_name?: string; 
                        type?: 'main' | 'sub'; 
                        parent_id?: string | null;
                        is_featured?: boolean;
                        order?: number;
                    } | null;
                    
                    categoryGroups.push({
                        categoryId: catId,
                        categoryName: category?.category_name || 'Unknown',
                        categoryType: category?.type || 'main',
                        parentId: category?.parent_id || null,
                        parentName: null,
                        isFeatured: category?.is_featured || false,
                        order: category?.order || 0,
                        products: []
                    });
                    categoryMap.set(catId, categoryGroups[categoryGroups.length - 1]);
                }

                categoryMap.get(catId)!.products.push(product);
            });

            // Sort category groups by featured status and order
            categoryGroups.sort((a, b) => {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
                if (a.isFeatured && b.isFeatured) return a.order - b.order;
                return a.categoryName.localeCompare(b.categoryName);
            });

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