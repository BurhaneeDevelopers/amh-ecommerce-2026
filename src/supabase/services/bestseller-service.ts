import { supabase } from "../client";
import { Product } from "../schema/schema.type";

class Bestseller_Service {
  // Get most enquired products (bestsellers)
  async getBestsellerProducts(limit: number = 4): Promise<Product[]> {
    try {
      // Query enquiry table to get product IDs with most enquiries
      const { data: enquiryData, error: enquiryError } = await supabase
        .from("enquiry")
        .select("products");

      if (enquiryError) throw enquiryError;

      // Count product occurrences
      const productCounts: Record<string, number> = {};
      
      enquiryData?.forEach((enquiry) => {
        if (enquiry.products && Array.isArray(enquiry.products)) {
          enquiry.products.forEach((productId: string) => {
            productCounts[productId] = (productCounts[productId] || 0) + 1;
          });
        }
      });

      // Sort by count and get top product IDs
      const topProductIds = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      // If no enquiries, return featured products as fallback
      if (topProductIds.length === 0) {
        const { data: featuredProducts, error: featuredError } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .limit(limit);

        if (featuredError) throw featuredError;
        return featuredProducts || [];
      }

      // Fetch product details for top products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", topProductIds);

      if (productsError) throw productsError;

      // Sort products by their enquiry count
      const sortedProducts = products?.sort((a, b) => {
        const countA = productCounts[a.id || ""] || 0;
        const countB = productCounts[b.id || ""] || 0;
        return countB - countA;
      });

      return sortedProducts || [];
    } catch (error) {
      console.error("Error fetching bestseller products:", error);
      // Fallback to featured products on error
      const { data: featuredProducts } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(limit);

      return featuredProducts || [];
    }
  }
}

export const bestseller_service = new Bestseller_Service();
