import { supabase } from "../client";
import { BlogCategory } from "../schema/schema.type";

class BlogCategoriesService {
  private table = "blog_categories";

  async getAllBlogCategories(): Promise<BlogCategory[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order("category_name", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getActiveBlogCategories(): Promise<BlogCategory[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("category_name", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getSingleBlogCategoryById(id: string): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getSingleBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async createNewBlogCategory(payload: BlogCategory): Promise<BlogCategory[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateBlogCategory(payload: BlogCategory): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", payload.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlogCategoryById(id: string): Promise<BlogCategory[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async toggleCategoryStatus(id: string, is_active: boolean): Promise<BlogCategory | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ is_active })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from(this.table)
      .select("id")
      .eq("slug", slug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data && data.length > 0;
  }
}

export const blogCategoriesService = new BlogCategoriesService();
