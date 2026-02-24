import { Category } from "@/supabase/schema/schema.type";
import { categories_service } from "@/supabase/services/category-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllMainCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_all_main"],
    queryFn: async () =>
      (await categories_service.getAllMainCategories()) ?? [],
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllMainCategoriesWithProductCount = () => {
  return useQuery<(Category & { product_count: number })[], Error>({
    queryKey: ["category_list_all_main_with_count"],
    queryFn: async () =>
      (await categories_service.getAllMainCategoriesWithProductCount()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetFeaturedMainCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_featured_main"],
    queryFn: async () =>
      (await categories_service.getFeaturedMainCategories()) ?? [],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllSubCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_all_sub"],
    queryFn: async () =>
      (await categories_service.getAllSubCategories()) ?? [],
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSubCatBasedOnMainCatId = (
  main_category_id?: string | null
) => {
  return useQuery<Category[], Error>({
    queryKey: ["sub_category_list_all_based_main_id", main_category_id],
    queryFn: async () =>
      (await categories_service.getSubCatBasedOnMainCatId(main_category_id)) ??
      [],
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    enabled: !!main_category_id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["category_list_all"],
    queryFn: async () => (await categories_service.getAllCategories()) ?? [],
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetSingleCategory = (id: string | null) => {
  return useQuery<Category | null, Error>({
    queryKey: ["category_by_id", id],
    queryFn: async () => await categories_service.getSingleCategoryById(id),
    enabled: !!id,
    refetchOnWindowFocus: false, // Don't refetch on tab/window switch
    refetchOnMount: false, // Don't refetch when component mounts again
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateNewCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Category) =>
      categories_service.createNewCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all_main"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Category) =>
      categories_service.updateCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categories_service.deleteCategoryById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_list_all"] });
    },
  });
};
