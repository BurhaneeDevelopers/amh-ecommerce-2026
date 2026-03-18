import { supabase } from "../client";
import { Category } from "../schema/schema.type";

class Categories_Service {
  private table = "category";

  async getAllMainCategories(): Promise<Category[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("type", "main")
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getFeaturedMainCategories(): Promise<Category[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("type", "main")
      .eq("is_featured", true)
      .order("order", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getAllSubCategories(): Promise<Category[] | null> {
    // get all sub categories
    const { data: subs, error: subError } = await supabase
      .from(this.table)
      .select("*")
      .eq("type", "sub");

    if (subError) throw subError;

    // get all main categories (parents)
    const { data: mains, error: mainError } = await supabase
      .from(this.table)
      .select("id, category_name")
      .eq("type", "main");

    if (mainError) throw mainError;

    // map parent name into subs
    const mainsMap = new Map(mains.map((m) => [m.id, m.category_name]));

    return subs?.map((sub) => ({
      ...sub,
      parent_category_name: mainsMap.get(sub.parent_id) || null,
    })) as Category[];
  }

  async getSubCatBasedOnMainCatId(
    main_category_id?: string | null
  ): Promise<Category[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("parent_id", main_category_id);

    if (error) throw error;
    return data;
  }

  async getAllCategories(): Promise<Category[] | null> {
    const { data, error } = await supabase.from(this.table).select("*");

    if (error) throw error;
    return data;
  }

  async getSingleCategoryById(id: string | null): Promise<Category | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getSingleCategoryBySlug(slug: string | null): Promise<Category | null> {
    if (!slug) return null;
    
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategoryById(id: string): Promise<Category[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async createNewCategory(payload: Category): Promise<Category[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateCategory(payload: Category): Promise<Category | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", payload.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async getAllMainCategoriesWithProductCount(): Promise<(Category & { product_count: number })[] | null> {
    // Get all main categories
    const { data: categories, error: catError } = await supabase
      .from(this.table)
      .select("*")
      .eq("type", "main")
      .order("order", { ascending: true });

    if (catError) throw catError;
    if (!categories) return null;

    // For each category, count products
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        // Count products in this category
        const { count: mainCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("category_id", cat.id);

        // Get subcategories
        const { data: subcats } = await supabase
          .from(this.table)
          .select("id")
          .eq("parent_id", cat.id);

        // Count products in subcategories
        let subCount = 0;
        if (subcats && subcats.length > 0) {
          const subcatIds = subcats.map(s => s.id);
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .in("category_id", subcatIds);
          subCount = count || 0;
        }

        return {
          ...cat,
          product_count: (mainCount || 0) + subCount
        };
      })
    );

    return categoriesWithCount;
  }
}

export const categories_service = new Categories_Service();
