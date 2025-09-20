import { Product, Accessories, Spares } from '@/supabase/schema/schema.type';
import { products_service } from '@/supabase/services/products-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllProducts = () => {
    return useQuery<Product[], Error>({
        queryKey: ['product_list_all'],
        queryFn: async () => (await products_service.getAllProducts()) ?? [],
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