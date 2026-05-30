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

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('status', 'active');

  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.90,
  }));

  // Fetch all main categories (is_main = true)
  const { data: mainCategories } = await supabase
    .from('categories')
    .select('id, name, updated_at')
    .eq('is_main', true)
    .order('name');

  const mainCategoryPages: MetadataRoute.Sitemap = (mainCategories || []).map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: category.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Fetch all subcategories (is_main = false, has parent_id)
  const { data: subcategories } = await supabase
    .from('categories')
    .select('id, name, parent_id, updated_at')
    .eq('is_main', false)
    .not('parent_id', 'is', null);

  // Build subcategory URLs with parent path
  const subcategoryPages: MetadataRoute.Sitemap = [];
  for (const subcat of subcategories || []) {
    if (subcat.parent_id) {
      // Fetch parent to build correct URL
      const { data: parent } = await supabase
        .from('categories')
        .select('id, parent_id')
        .eq('id', subcat.parent_id)
        .single();

      if (parent) {
        if (parent.parent_id) {
          // This is a level 3 nested category
          const { data: grandparent } = await supabase
            .from('categories')
            .select('id')
            .eq('id', parent.parent_id)
            .single();

          if (grandparent) {
            subcategoryPages.push({
              url: `${baseUrl}/category/${grandparent.id}/${parent.id}/${subcat.id}`,
              lastModified: subcat.updated_at || currentDate,
              changeFrequency: 'weekly' as const,
              priority: 0.75,
            });
          }
        } else {
          // This is a level 2 subcategory
          subcategoryPages.push({
            url: `${baseUrl}/category/${parent.id}/${subcat.id}`,
            lastModified: subcat.updated_at || currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.80,
          });
        }
      }
    }
  }

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
    ...mainCategoryPages,
    ...subcategoryPages,
    ...blogPages,
  ];
}
