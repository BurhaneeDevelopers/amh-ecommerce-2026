import { Product, Accessories, Spares } from '@/supabase/schema/schema.type';
import { products_service } from '@/supabase/services/products-service';
import { supabase } from '@/supabase/client';
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
            
            // Group products by category - this will be done in the component
            // For now, just return paginated products
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
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });
};

// New hook for category-based infinite loading
export const useGetProductsByCategoryInfinite = (filters: ProductFilters = {}) => {
    return useInfiniteQuery({
        queryKey: ['products_by_category_infinite', JSON.stringify(filters)],
        queryFn: async ({ pageParam }) => {
            // pageParam structure: { featuredDone: boolean, categoryIndex: number }
            const initialPageParam = { featuredDone: false, categoryIndex: 0 };
            const currentParam = pageParam || initialPageParam;
            
            const allProducts = await products_service.getAllProducts() ?? [];
            
            // Apply filters
            let filteredProducts = allProducts;
            
            if (filters.search) {
                filteredProducts = filteredProducts.filter(product =>
                    product.product_name?.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    product.model_number?.toLowerCase().includes(filters.search!.toLowerCase())
                );
            }
            
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
                }
            }

            // Get all categories
            const { data: allCategories } = await supabase.from('category').select('*');
            const categories = allCategories || [];

            // Group products by category
            const categoryProductMap = new Map<string, Product[]>();
            filteredProducts.forEach(product => {
                const catId = product.category_id;
                if (!catId) return;
                
                if (!categoryProductMap.has(catId)) {
                    categoryProductMap.set(catId, []);
                }
                categoryProductMap.get(catId)!.push(product);
            });

            // Separate featured and non-featured categories that have products
            const featuredCategories = categories
                .filter(cat => cat.is_featured === true && categoryProductMap.has(cat.id!))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            
            const nonFeaturedCategories = categories
                .filter(cat => cat.is_featured !== true && categoryProductMap.has(cat.id!))
                .sort((a, b) => a.category_name.localeCompare(b.category_name));

            const categoryGroups: CategoryGroup[] = [];
            let nextPageParam = null;

            // First load: return all featured categories with ALL their products
            // If no featured categories, start with first 3 non-featured categories
            if (!currentParam.featuredDone) {
                if (featuredCategories.length > 0) {
                    // Load all featured categories
                    featuredCategories.forEach(cat => {
                        const products = categoryProductMap.get(cat.id!) || [];
                        if (products.length > 0) {
                            const parentCategory = cat.parent_id 
                                ? categories.find(c => c.id === cat.parent_id)
                                : null;
                            
                            categoryGroups.push({
                                categoryId: cat.id!,
                                categoryName: cat.category_name,
                                categoryType: cat.type,
                                parentId: cat.parent_id,
                                parentName: parentCategory?.category_name || null,
                                isFeatured: true,
                                order: cat.order || 0,
                                products: products
                            });
                        }
                    });

                    // Set next page to start loading non-featured categories
                    if (nonFeaturedCategories.length > 0) {
                        nextPageParam = { featuredDone: true, categoryIndex: 0 };
                    }
                } else {
                    // No featured categories, load first 3 non-featured categories
                    const initialLoadCount = Math.min(3, nonFeaturedCategories.length);
                    for (let i = 0; i < initialLoadCount; i++) {
                        const cat = nonFeaturedCategories[i];
                        const products = categoryProductMap.get(cat.id!) || [];
                        
                        if (products.length > 0) {
                            const parentCategory = cat.parent_id 
                                ? categories.find(c => c.id === cat.parent_id)
                                : null;
                            
                            categoryGroups.push({
                                categoryId: cat.id!,
                                categoryName: cat.category_name,
                                categoryType: cat.type,
                                parentId: cat.parent_id,
                                parentName: parentCategory?.category_name || null,
                                isFeatured: false,
                                order: 0,
                                products: products
                            });
                        }
                    }

                    // Set next page if there are more categories
                    if (nonFeaturedCategories.length > initialLoadCount) {
                        nextPageParam = { featuredDone: true, categoryIndex: initialLoadCount };
                    }
                }
            } 
            // Subsequent loads: return one non-featured category at a time with ALL its products
            else {
                const categoryIndex = currentParam.categoryIndex;
                if (categoryIndex < nonFeaturedCategories.length) {
                    const cat = nonFeaturedCategories[categoryIndex];
                    const products = categoryProductMap.get(cat.id!) || [];
                    
                    if (products.length > 0) {
                        const parentCategory = cat.parent_id 
                            ? categories.find(c => c.id === cat.parent_id)
                            : null;
                        
                        categoryGroups.push({
                            categoryId: cat.id!,
                            categoryName: cat.category_name,
                            categoryType: cat.type,
                            parentId: cat.parent_id,
                            parentName: parentCategory?.category_name || null,
                            isFeatured: false,
                            order: 0,
                            products: products
                        });
                    }

                    // Set next page if there are more categories
                    if (categoryIndex + 1 < nonFeaturedCategories.length) {
                        nextPageParam = { featuredDone: true, categoryIndex: categoryIndex + 1 };
                    }
                }
            }

            return {
                categoryGroups,
                nextPage: nextPageParam,
                totalCount: filteredProducts.length,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: { featuredDone: false, categoryIndex: 0 },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });
};