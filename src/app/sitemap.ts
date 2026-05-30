import { MetadataRoute } from 'next';
import { createClient } from '@/supabase/client';

export const revalidate = 86400; // Revalidate every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hydraulicstore.in';
  const supabase = createClient();
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.70,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.70,
    },
  ];

  // Fetch all active products with SKU
  const { data: products } = await supabase
    .from('products')
    .select('sku, updated_at')
    .eq('status', 'active')
    .not('sku', 'is', null);

  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.sku}`,
    lastModified: product.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.90,
  }));

  // Fetch all categories with slugs
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .not('slug', 'is', null)
    .order('name');

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Fetch all published blog posts
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, updated_at')
    .eq('is_published', true);

  const blogPages: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updated_at || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.60,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...blogPages,
  ];
}
