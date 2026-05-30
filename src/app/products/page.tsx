import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import ProductsPageClient from "./products-client";
import JsonLd from "@/components/seo/JsonLd";
import { generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import { createClient } from "@/supabase/client";

export const metadata: Metadata = {
  title: 'Buy Hydraulic & Pneumatic Components Online India — All Products',
  description: 'Browse and buy hydraulic hoses, fittings, pumps, valves, cylinders, power packs, and pneumatic components online in India. A.M. Hydraulics & Tubes is an ISO 9001:2015 certified authorized stockist for Parker, Polyhose, Yuken, Rexroth, Boss Hydraulics, Torque, Enerpac, Festo, Vickers in Chennai. Shop genuine industrial components with manufacturer warranty. Call +91 98843 69751 for bulk orders and custom assemblies.',
  alternates: {
    canonical: 'https://hydraulicstore.in/products',
  },
  openGraph: {
    title: 'Buy Hydraulic & Pneumatic Components Online India — All Products',
    description: 'Browse hydraulic hoses, fittings, pumps, valves, and pneumatic components. Authorized Parker, Yuken, Rexroth dealer in Chennai.',
    url: 'https://hydraulicstore.in/products',
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
