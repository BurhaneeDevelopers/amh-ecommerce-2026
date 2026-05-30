import { Metadata } from 'next';
import { createClient } from '@/supabase/client';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryPageClient from './category-client';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from '@/lib/seo/structured-data';

export const revalidate = 86400; // 24 hours ISR

type Props = {
  params: { slug: string };
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
  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', slug)
    .single();

  return category;
}

async function getCategoryProductCount(slug: string) {
  const supabase = createClient();
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', slug)
    .eq('status', 'active');

  return count || 0;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const title = `${category.name} — Buy ${category.name} Online in India | A.M. Hydraulics Chennai`;
  
  // Use specific description if available, otherwise generate generic one
  const description = categoryDescriptions[params.slug] || 
    `Buy ${category.name} online in India from A.M. Hydraulics & Tubes, Chennai. ISO 9001:2015 certified authorized supplier of hydraulic and pneumatic components. Authorized stockist for Parker, Polyhose, Yuken, Rexroth, Festo. Shop genuine industrial components with manufacturer warranty. Call +91 98843 69751 for bulk orders and technical support.`;

  const keywords = [
    category.name,
    `${category.name} Chennai`,
    `${category.name} India`,
    `${category.name} supplier`,
    `${category.name} price`,
    `buy ${category.name} online India`,
    'A.M. Hydraulics',
    'hydraulicstore.in',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://hydraulicstore.in/category/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hydraulicstore.in/category/${params.slug}`,
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
  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .eq('is_main', true);

  return (categories || []).map((category) => ({
    slug: category.id,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategory(params.slug);
  const productCount = await getCategoryProductCount(params.slug);

  if (!category) {
    return null;
  }

  const breadcrumbData = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://hydraulicstore.in' },
    { name: 'Products', url: 'https://hydraulicstore.in/products' },
    { name: category.name, url: `https://hydraulicstore.in/category/${params.slug}` },
  ]);

  const collectionData = generateCollectionPageJsonLd(
    category.name,
    category.description || `Browse ${category.name} from A.M. Hydraulics & Tubes`,
    `https://hydraulicstore.in/category/${params.slug}`,
    productCount
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, collectionData]} />
      <Suspense fallback={
        <Container>
          <div className="mx-auto space-y-4 py-8">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
        </Container>
      }>
        <CategoryPageClient />
      </Suspense>
    </>
  );
}
