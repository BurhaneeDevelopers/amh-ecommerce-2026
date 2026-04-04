import { Category } from "@/supabase/schema/schema.type";
import { categories_service } from "@/supabase/services/category-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_all"],
    queryFn: async () => (await categories_service.getAllCategories()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllCategoriesWithProductCount = () => {
  return useQuery<(Category & { product_count: number })[], Error>({
    queryKey: ["category_list_all_with_count"],
    queryFn: async () => (await categories_service.getAllCategoriesWithProductCount()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSingleCategory = (id: string | null) => {
  return useQuery<Category | null, Error>({
    queryKey: ["category_by_id", id],
    queryFn: async () => await categories_service.getSingleCategoryById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateNewCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Category, 'id' | 'created_at' | 'updated_at'>) =>
      categories_service.createNewCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all"] });
      queryClient.invalidateQueries({ queryKey: ["category_list_all_with_count"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) =>
      categories_service.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all"] });
      queryClient.invalidateQueries({ queryKey: ["category_list_all_with_count"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categories_service.deleteCategoryById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all"] });
      queryClient.invalidateQueries({ queryKey: ["category_list_all_with_count"] });
    },
  });
};
