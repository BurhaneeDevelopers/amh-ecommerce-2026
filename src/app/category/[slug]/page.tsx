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

// Category-specific descriptions for known categories
const categoryDescriptions: Record<string, string> = {
  'hydraulic-hoses': 'Buy hydraulic hoses online in India - Parker R1, R2, 4SP, 4SH high-pressure hoses, Teflon hoses, SS bellow hoses, PVC braided hoses, and custom hose assemblies with professional crimping services. Authorized Parker and Polyhose dealer in Chennai. A.M. Hydraulics & Tubes - ISO 9001:2015 certified supplier. Call +91 98843 69751.',
  'hydraulic-fittings': 'Buy hydraulic fittings online in India - Ermeto/EO carbon steel fittings, JIC, BSP, NPT, SAE fittings, needle valves, check valves, flow control valves, Dowty seals, copper washers, SAE flanges, QRC quick release couplings, and hose end fittings. Authorized supplier in Chennai. Call +91 98843 69751.',
  'hydraulic-pumps': 'Buy hydraulic pumps online in India - Yuken gear pumps, Polyhydron pumps, Vickers pumps, hand pumps, radial piston pumps, motorized and manual test pumps (40-500 bar, 1-100 LPM), vane pumps. Authorized Yuken and Vickers dealer in Chennai. A.M. Hydraulics & Tubes. Call +91 98843 69751.',
  'hydraulic-valves': 'Buy hydraulic valves online in India - DC directional control valves, Yuken solenoid valves, Rexroth solenoid valves, pressure relief valves, check valves, flow control valves. Authorized Yuken and Rexroth dealer in Chennai. ISO 9001:2015 certified. Call +91 98843 69751.',
  'hydraulic-cylinders': 'Buy hydraulic cylinders online in India - Standard and custom hydraulic cylinders for industrial applications. Manufactured and supplied by A.M. Hydraulics & Tubes, Chennai. ISO 9001:2015 certified. Call +91 98843 69751 for custom cylinder specifications.',
  'hydraulic-power-packs': 'Buy hydraulic power packs online in India - Torque AC/DC compact power packs, custom power pack units, power pack tanks. Complete hydraulic power solutions from A.M. Hydraulics & Tubes, Chennai. Call +91 98843 69751.',
  'pneumatic-products': 'Buy pneumatic components online in India - Festo pneumatic products, push-on fittings, PU tubing and coiled hoses, FRL units, air hose reels, spring balancers, air guns, solenoid and mechanical valves, directional control valves, air cylinders. Authorized Festo dealer in Chennai. Call +91 98843 69751.',
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

async function getSubcategoriesRecursive(parentId: string): Promise<any[]> {
  const { data: subcategories } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name', { ascending: true });

  if (!subcategories) return [];

  // For each subcategory, fetch its nested subcategories
  const categoriesWithNested = await Promise.all(
    subcategories.map(async (subcat) => {
      const nestedSubcategories = await getSubcategoriesRecursive(subcat.id!);
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
  const { slug } = await params; // ← await it
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const title = `${category.name} — Buy ${category.name} Online in India | A.M. Hydraulics Chennai`;
  const description = categoryDescriptions[slug] || `Buy ${category.name} online...`;

  // rest stays the same, just use `slug` instead of `params.slug`
  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} Chennai`,
      // ...
    ],
    alternates: {
      canonical: `https://hydraulicstore.in/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hydraulicstore.in/category/${slug}`,
      images: [
        {
          url: `/og?title=${encodeURIComponent(category.name)}&category=${encodeURIComponent('Browse Products')}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
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
