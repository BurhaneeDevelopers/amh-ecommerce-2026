/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../client";
import { Blog } from "../schema/schema.type";

class BlogsService {
  private table = "blogs";

  async getAllBlogs(): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getPublishedBlogs(): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("is_published", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFeaturedBlogs(): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getBlogsByCategory(categoryId: string): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("category_id", categoryId)
      .eq("is_published", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getBlogsByTag(tag: string): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .contains("tags", [tag])
      .eq("is_published", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getSingleBlogById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getSingleBlogBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) throw error;
    return data;
  }

  async createNewBlog(payload: Blog): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateBlog(payload: Blog): Promise<Blog | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", payload.id)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlogById(id: string): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async togglePublishStatus(id: string, is_published: boolean): Promise<Blog | null> {
    const updateData: any = { is_published };
    
    // Set publish_date when publishing for the first time
    if (is_published) {
      updateData.publish_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(this.table)
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async toggleFeaturedStatus(id: string, is_featured: boolean): Promise<Blog | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ is_featured })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async incrementViewCount(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .rpc('increment_blog_views', { blog_id: id });

    if (error) throw error;
    return data;
  }

  async searchBlogs(searchTerm: string): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .eq("is_published", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

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

  async getAllTags(): Promise<string[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("tags")
      .not("tags", "is", null)
      .eq("is_published", true);

    if (error) throw error;
    
    // Flatten and deduplicate tags
    const allTags = data?.reduce((acc: string[], blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        acc.push(...blog.tags);
      }
      return acc;
    }, []);

    return allTags ? [...new Set(allTags)].sort() : [];
  }

  async getRecentBlogs(limit: number = 5): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        id,
        title,
        slug,
        excerpt,
        gallery_images,
        author_name,
        author_image,
        read_time,
        publish_date,
        created_at,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("is_published", true)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getRelatedBlogs(blogId: string, categoryId: string, limit: number = 3): Promise<Blog[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        id,
        title,
        slug,
        excerpt,
        gallery_images,
        author_name,
        author_image,
        read_time,
        publish_date,
        created_at,
        category:category_id (
          id,
          category_name,
          slug
        )
      `)
      .eq("category_id", categoryId)
      .eq("is_published", true)
      .neq("id", blogId)
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export const blogsService = new BlogsService();
