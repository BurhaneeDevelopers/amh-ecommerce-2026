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

  // Build title
  let title = product.name;
  if (detectedBrand) {
    title = `${product.name} (${detectedBrand}) — Buy in Chennai, India`;
  } else {
    title = `${product.name} — Buy in Chennai, India`;
  }

  if (product.sku) {
    title = `${product.name} ${product.sku} — Buy in Chennai, India`;
  }

  // Build description
  let description = '';
  if (product.description) {
    description = product.description;
  } else {
    description = `${product.name}`;
    if (detectedBrand) {
      description += ` by ${detectedBrand}`;
    }
    if (product.category) {
      description += ` - ${product.category.name}`;
    }
    description += '. Authorized supplier with ISO 9001:2015 certification.';
  }

  // Add specifications to description
  const specs: string[] = [];
  if (product.product_master_values && product.product_master_values.length > 0) {
    product.product_master_values.slice(0, 3).forEach((pmv: any) => {
      if (pmv.master_values?.master_fields) {
        const label = pmv.master_values.master_fields.label;
        const value = pmv.master_values.value;
        const unit = pmv.master_values.master_fields.unit;
        specs.push(`${label}: ${value}${unit ? ' ' + unit : ''}`);
      }
    });
  }

  if (specs.length > 0) {
    description += ` Specifications: ${specs.join(', ')}.`;
  }

  description += ' Available from A.M. Hydraulics & Tubes, Chennai. Call +91 98843 69751 for pricing and availability.';

  // Build keywords
  const keywords = [
    product.name,
    `${product.name} price India`,
    `${product.name} supplier Chennai`,
  ];

  if (detectedBrand) {
    keywords.push(`${detectedBrand} ${product.category?.name || 'products'} Chennai`);
  }

  if (product.sku) {
    keywords.push(product.sku);
  }

  if (product.category) {
    keywords.push(product.category.name);
  }

  keywords.push('A.M. Hydraulics', 'hydraulicstore.in');

  // OG Image
  const ogImageUrl = product.image_url
    ? product.image_url
    : `/og?title=${encodeURIComponent(product.name)}${detectedBrand ? `&brand=${encodeURIComponent(detectedBrand)}` : ''}${product.category ? `&category=${encodeURIComponent(product.category.name)}` : ''}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://hydraulicstore.in/products/${sku}`,
    },
    openGraph: {
      url: `https://hydraulicstore.in/products/${sku}`,
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
    const categories: any[] = [];
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
    url: `https://hydraulicstore.in/products/${params.sku}`,
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
