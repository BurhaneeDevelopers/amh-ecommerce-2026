import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import ProductsPageClient from "./products-client";
import JsonLd from "@/components/seo/JsonLd";
import { generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import { createClient } from "@/supabase/client";

export const metadata: Metadata = {
  title: 'Hydraulic & Pneumatic Products Chennai',
  description: 'Browse hydraulic hoses, fittings, pumps, valves from authorized Parker, Yuken, Rexroth dealer. ISO certified stock in Chennai. Same-day availability.',
  alternates: {
    canonical: 'https://hydraulicstore.in/products',
  },
  openGraph: {
    title: 'Hydraulic & Pneumatic Products — Authorized Stock in Chennai',
    description: 'Shop Parker hoses, Yuken pumps, Rexroth valves from authorized ISO certified dealer in Chennai. Genuine industrial components with manufacturer warranty.',
    url: 'https://hydraulicstore.in/products',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Hydraulic & Pneumatic Products - A.M. Hydraulics & Tubes Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hydraulic & Pneumatic Products — Authorized Stock in Chennai',
    description: 'Shop Parker hoses, Yuken pumps, Rexroth valves from authorized ISO certified dealer in Chennai. Genuine industrial components with manufacturer warranty.',
    images: ['/og-default.jpg'],
  },
};

async function getProductCount() {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    return count || 0;
  } catch (error) {
    console.error('Error fetching product count:', error);
    return 0;
  }
}

export default async function ProductsPage() {
  const productCount = await getProductCount();

  const breadcrumbData = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://hydraulicstore.in' },
    { name: 'All Products', url: 'https://hydraulicstore.in/products' },
  ]);

  const collectionData = generateCollectionPageJsonLd(
    'All Hydraulic & Pneumatic Products',
    'Complete range of hydraulic hoses, fittings, pumps, valves, cylinders, power packs, and pneumatic components from authorized brands',
    'https://hydraulicstore.in/products',
    productCount
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, collectionData]} />
      <Suspense fallback={
        <Container>
          <div className="mx-auto py-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </div>
        </Container>
      }>
        <ProductsPageClient />
      </Suspense>
    </>
  );
}
