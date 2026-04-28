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

export const useGetMainCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_main"],
    queryFn: async () => (await categories_service.getMainCategories()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMainCategoriesWithSubcategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_main_with_subs"],
    queryFn: async () => (await categories_service.getMainCategoriesWithSubcategories()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSubcategoriesByParentId = (parentId: string | null) => {
  return useQuery<Category[], Error>({
    queryKey: ["subcategories_by_parent", parentId],
    queryFn: async () => {
      if (!parentId) return [];
      return (await categories_service.getSubcategoriesByParentId(parentId)) ?? [];
    },
    enabled: !!parentId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCategoryWithSubcategories = (id: string | null) => {
  return useQuery<Category | null, Error>({
    queryKey: ["category_with_subcategories", id],
    queryFn: async () => {
      if (!id) return null;
      return await categories_service.getCategoryWithSubcategories(id);
    },
    enabled: !!id,
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
