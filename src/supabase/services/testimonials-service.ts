import { supabase } from "../client";
import { Testimonial } from "../schema/schema.type";

class TestimonialsService {
  private table = "testimonials";

  async getAllTestimonials(): Promise<Testimonial[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .order("order_index", { ascending: true, nullsLast: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getActiveTestimonials(): Promise<Testimonial[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true, nullsLast: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFeaturedTestimonials(): Promise<Testimonial[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("order_index", { ascending: true, nullsLast: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getSingleTestimonialById(id: string): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async createNewTestimonial(payload: Testimonial): Promise<Testimonial[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(payload)
      .select("*");

    if (error) throw error;
    return data;
  }

  async updateTestimonial(payload: Testimonial): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq("id", payload.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTestimonialById(id: string): Promise<Testimonial[] | null> {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id)
      .select("*");

    if (error) throw error;
    return data;
  }

  async toggleTestimonialStatus(id: string, is_active: boolean): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ is_active })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async toggleFeaturedStatus(id: string, is_featured: boolean): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ is_featured })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  async updateOrderIndex(id: string, order_index: number): Promise<Testimonial | null> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ order_index })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
}

export const testimonialsService = new TestimonialsService();
