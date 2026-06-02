import { Metadata } from 'next';
import { supabase } from '@/supabase/client';
import ProductDetailsClient from './product-details-client';
import JsonLd from '@/components/seo/JsonLd';
import { generateProductJsonLd, generateBreadcrumbJsonLd, ORGANIZATION_JSON_LD } from '@/lib/seo/structured-data';

export const revalidate = 86400; // 24 hours ISR

type Props = {
  params: Promise<{ sku: string }>;
};

async function getProductBySku(sku: string) {
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(
        id,
        name,
        parent:categories!parent_id(
          id,
          name,
          parent:categories!parent_id(
            id,
            name
          )
        )
      ),
      product_master_values(
        master_values(
          value,
          master_fields(
            label,
            unit,
            masters(
              id,
              name
            )
          )
        )
      ),
      product_variants(
        id,
        variant_name,
        sort_order,
        product_variant_values(
          value,
          master_field:master_fields(
            id,
            label,
            unit,
            sort_order
          )
        )
      )
    `)
    .eq('sku', sku)
    .single();

  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  // Detect brand from product name
  const knownBrands = ['Parker', 'Polyhose', 'Yuken', 'Rexroth', 'Boss', 'Torque', 'Polyhydron', 'Enerpac', 'Festo', 'Vickers', 'Dowty'];
  let detectedBrand = '';

  for (const brand of knownBrands) {
    if (product.name.toLowerCase().includes(brand.toLowerCase())) {
      detectedBrand = brand;
      break;
    }
  }

  // Build title (max 60 characters)
  let title = product.name;
  if (title.length > 45) {
    title = `${title.substring(0, 42)}... Chennai`;
  } else if (detectedBrand) {
    title = `${detectedBrand} ${product.category?.name || 'Product'} Chennai`;
  } else {
    title = `${product.name} | Chennai`;
  }

  // Build description (max 155 characters)
  let description = `Authorized ${detectedBrand || ''} stockist in Chennai. ${product.category?.name || 'Industrial component'} for ${product.description?.substring(0, 50) || 'hydraulic systems'}. ISO certified. Call for pricing.`;
  
  if (description.length > 155) {
    description = description.substring(0, 152) + '...';
  }

  // Build OG title (max 70 characters)
  let ogTitle = product.name;
  if (detectedBrand) {
    ogTitle = `${detectedBrand} ${product.name} — Authorized Dealer Chennai`;
    if (ogTitle.length > 70) {
      ogTitle = `${product.name} — ${detectedBrand} Authorized Dealer Chennai`;
    }
  } else {
    ogTitle = `${product.name} — Buy in Chennai`;
  }
  if (ogTitle.length > 70) {
    ogTitle = ogTitle.substring(0, 67) + '...';
  }

  // Build OG description (max 200 characters)
  let ogDescription = '';
  if (detectedBrand) {
    ogDescription = `Authorized ${detectedBrand} stockist for ${product.name}. `;
  }
  if (product.description) {
    ogDescription += product.description.substring(0, 100);
  }
  ogDescription += ` Available from ISO certified dealer in Chennai. Call +91 98843 69751 for pricing.`;
  if (ogDescription.length > 200) {
    ogDescription = ogDescription.substring(0, 197) + '...';
  }

  // OG Image
  const ogImageUrl = product.image_url
    ? product.image_url
    : `/og?title=${encodeURIComponent(product.name)}${detectedBrand ? `&brand=${encodeURIComponent(detectedBrand)}` : ''}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydraulicstore.in/products/${sku}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://hydraulicstore.in/products/${sku}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${detectedBrand || 'A.M. Hydraulics & Tubes'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    other: {
      'product:brand': detectedBrand || 'A.M. Hydraulics & Tubes',
      'product:condition': 'new',
      'product:price:currency': 'INR',
      'product:availability': product.status === 'active' ? 'in stock' : 'out of stock',
    },
  };
}

export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('sku')
    .eq('status', 'active')
    .not('sku', 'is', null);

  return (products || []).map((product) => ({
    sku: product.sku,
  }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return null; // Client component will handle the not found state
  }

  // Build breadcrumb
  const breadcrumbItems = [{ name: 'Home', url: 'https://hydraulicstore.in' }];
  breadcrumbItems.push({
    name: product.name,
    url: `https://hydraulicstore.in/products/${sku}`,
  });

  // Add category hierarchy to breadcrumb
  if (product.category) {
    const categories: { id: string; name: string; parent?: { id: string; name: string; parent?: { id: string; name: string } } }[] = [];
    let current = product.category;

    while (current) {
      categories.unshift(current);
      current = current.parent;
    }

    categories.forEach((cat) => {
      breadcrumbItems.push({
        name: cat.name,
        url: `https://hydraulicstore.in/category/${cat.id}`,
      });
    });
  }

  breadcrumbItems.push({
    name: product.name,
    url: `https://hydraulicstore.in/products/${sku}`,
  });

  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <JsonLd data={[productJsonLd, breadcrumbJsonLd, ORGANIZATION_JSON_LD]} />
      <ProductDetailsClient />
    </>
  );
}
