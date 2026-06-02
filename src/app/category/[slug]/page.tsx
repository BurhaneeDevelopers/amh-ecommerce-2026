import { Metadata } from 'next';
import { createClient, supabase } from '@/supabase/client';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryPageClient from './category-client';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from '@/lib/seo/structured-data';

export const revalidate = 86400; // 24 hours ISR

type Props = {
  params: Promise<{ slug: string }>; // ← was: { slug: string }
};

// Category-specific descriptions for known categories (max 155 characters)
const categoryDescriptions: Record<string, string> = {
  'hydraulic-hoses': 'Authorized Parker R1, R2, 4SP, 4SH hoses in Chennai. Polyhose dealer with custom crimping service. ISO certified stock. Call for bulk pricing.',
  'hydraulic-fittings': 'JIC, BSP, NPT, SAE hydraulic fittings in Chennai. Ermeto carbon steel fittings, Dowty seals. Authorized stockist since 1999. Same-day availability.',
  'hydraulic-pumps': 'Authorized Yuken, Polyhydron, Vickers pumps in Chennai. Gear pumps, test pumps 40-500 bar. ISO certified dealer. Call for technical specs.',
  'hydraulic-valves': 'Yuken, Rexroth solenoid valves in Chennai. Directional control, pressure relief, check valves. Authorized dealer with ISO certification.',
  'hydraulic-cylinders': 'Standard and custom hydraulic cylinders in Chennai. Manufactured at Ambattur facility. ISO 9001:2015 certified. Custom specs available.',
  'hydraulic-power-packs': 'Torque AC/DC power packs in Chennai. Custom hydraulic power units manufactured at Ambattur. ISO certified. Call for custom requirements.',
  'pneumatic-products': 'Authorized Festo dealer in Chennai. Pneumatic fittings, FRL units, solenoid valves, air cylinders. ISO certified stock with same-day delivery.',
};

// Category-specific titles (max 60 characters)
const categoryTitles: Record<string, string> = {
  'hydraulic-hoses': 'Hydraulic Hoses Chennai | Parker Authorized Dealer',
  'hydraulic-fittings': 'Hydraulic Fittings Chennai | JIC BSP NPT SAE Stock',
  'hydraulic-pumps': 'Hydraulic Pumps Chennai | Yuken Authorized Dealer',
  'hydraulic-valves': 'Hydraulic Valves Chennai | Yuken Rexroth Dealer',
  'hydraulic-cylinders': 'Hydraulic Cylinders Chennai | Custom Manufacturing',
  'hydraulic-power-packs': 'Hydraulic Power Packs Chennai | Torque Dealer',
  'pneumatic-products': 'Pneumatic Components Chennai | Festo Dealer',
};

async function getCategory(slug: string) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  return category;
}

async function getCategoryWithNested(slug: string) {
  // Get the main category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) return null;

  // Recursively fetch all subcategories
  const subcategories = await getSubcategoriesRecursive(category.id);
  
  return {
    ...category,
    subcategories
  };
}

async function getSubcategoriesRecursive(parentId: string): Promise<Array<{ id: string; name: string; slug?: string; subcategories?: Array<{ id: string; name: string }> }>> {
  const { data: subcategories } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name', { ascending: true });

  if (!subcategories) return [];

  // For each subcategory, fetch its nested subcategories
  const categoriesWithNested = await Promise.all(
    subcategories.map(async (subcat: { id: string; name: string; slug?: string }) => {
      const nestedSubcategories = await getSubcategoriesRecursive(subcat.id);
      return {
        ...subcat,
        subcategories: nestedSubcategories.length > 0 ? nestedSubcategories : undefined
      };
    })
  );

  return categoriesWithNested;
}

async function getCategoryProductCount(slug: string) {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!category) return 0;

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id)
    .eq('status', 'active');

  return count || 0;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const title = categoryTitles[slug] || `${category.name} Supplier Chennai`;
  const description = categoryDescriptions[slug] || `Authorized dealer for ${category.name} in Chennai. ISO certified stock with same-day availability. Call for bulk pricing in Tamil Nadu.`;
  
  const ogTitle = categoryTitles[slug] || `${category.name} — Authorized Dealer in Chennai`;
  const ogDescription = categoryDescriptions[slug] || `Shop ${category.name} from authorized dealer in Chennai. ISO certified genuine stock with manufacturer warranty.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydraulicstore.in/category/${slug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://hydraulicstore.in/category/${slug}`,
      images: [
        {
          url: `/og?title=${encodeURIComponent(category.name)}&category=${encodeURIComponent('Browse Products')}`,
          width: 1200,
          height: 630,
          alt: `${category.name} - A.M. Hydraulics & Tubes Chennai`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`/og?title=${encodeURIComponent(category.name)}&category=${encodeURIComponent('Browse Products')}`],
    },
  };
}


export async function generateStaticParams() {
  const supabase = createClient();
  // Get ALL categories with slugs, not just main categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .not('slug', 'is', null);

  if (!categories) return [];

  return categories
    .filter((category) => category.slug && typeof category.slug === 'string')
    .map((category) => ({
      slug: String(category.slug),
    }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const productCount = await getCategoryProductCount(slug);

  if (!category) {
    return null;
  }

  const breadcrumbData = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://hydraulicstore.in' },
    { name: 'Products', url: 'https://hydraulicstore.in/products' },
    { name: category.name, url: `https://hydraulicstore.in/category/${slug}` },
  ]);

  const collectionData = generateCollectionPageJsonLd(
    category.name,
    category.description || `Browse ${category.name} from A.M. Hydraulics & Tubes`,
    `https://hydraulicstore.in/category/${slug}`,
    productCount
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, collectionData]} />
      <CategoryPageClient />
    </>
  );
}
