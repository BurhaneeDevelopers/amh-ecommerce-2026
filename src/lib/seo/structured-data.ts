import type { Product } from '@/supabase/schema/schema.type';

const SITE_URL = 'https://hydraulicstore.in';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * Complete Organization + LocalBusiness schema
 * This is the single source of truth for business identity across all pages
 */
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': ORGANIZATION_ID,
  name: 'A.M. Hydraulics & Tubes',
  alternateName: ['AM Hydraulics', 'A.M. Hydraulics Tubes', 'AMHAT', 'A.M. Hydraulics and Tubes'],
  legalName: 'A.M. Hydraulics & Tubes',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: [
    `${SITE_URL}/logo.png`,
    `${SITE_URL}/banner.png`,
  ],
  description: 'ISO 9001:2015 & ISO 14001:2015 certified manufacturer and authorized distributor of hydraulic hoses, fittings, pumps, valves, cylinders, and pneumatic components in Chennai, India. Authorized stockist for Parker, Polyhose, Yuken, Rexroth, and more since 1999.',
  foundingDate: '1999',
  founder: {
    '@type': 'Person',
    name: 'Mohammed HB',
    jobTitle: 'Managing Director',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '148, Angappa Naicken Street, Parrys Corner, Near High Court',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0934057,
    longitude: 80.2546441,
  },
  telephone: ['+91 98843 69751', '044 42161198'],
  email: 'info@amhat.com',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Bank Transfer, UPI, Net Banking',
  priceRange: '₹₹',
  hasMap: 'https://maps.app.goo.gl/feb24DqhazcAds2DA',
  sameAs: [
    'https://www.am-hydraulics.com',
    'https://www.linkedin.com/company/amhydraulicsandtubes/',
    'https://www.linkedin.com/in/amhydraulicsandtubes/',
    'https://www.indiamart.com/am-hydraulics-tubes/',
    'https://www.tradeindia.com/am-hydraulics-tubes/',
  ],
  knowsAbout: [
    'Hydraulic Hoses',
    'Hydraulic Fittings',
    'Hydraulic Pumps',
    'Hydraulic Valves',
    'Hydraulic Cylinders',
    'Hydraulic Power Packs',
    'Pneumatic Components',
    'Industrial Hoses',
    'Parker Hoses',
    'Yuken Valves',
    'Rexroth Components',
    'Hydraulic Systems',
    'Fluid Power',
    'Industrial Automation',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Quality Management System',
      name: 'ISO 9001:2015',
      recognizedBy: {
        '@type': 'Organization',
        name: 'International Organization for Standardization',
      },
      dateCreated: '2024',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Environmental Management System',
      name: 'ISO 14001:2015',
      recognizedBy: {
        '@type': 'Organization',
        name: 'International Organization for Standardization',
      },
      dateCreated: '2024',
    },
  ],
  taxID: '33AARFA1763B1ZS',
  vatID: '33AARFA1763B1ZS',
  areaServed: [
    {
      '@type': 'State',
      name: 'Tamil Nadu',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'State',
      name: 'Karnataka',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'State',
      name: 'Andhra Pradesh',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'State',
      name: 'Telangana',
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'Country',
      name: 'India',
    },
  ],
  brand: [
    { '@type': 'Brand', name: 'Parker' },
    { '@type': 'Brand', name: 'Polyhose' },
    { '@type': 'Brand', name: 'Yuken' },
    { '@type': 'Brand', name: 'Rexroth' },
    { '@type': 'Brand', name: 'Boss Hydraulics' },
    { '@type': 'Brand', name: 'Torque' },
    { '@type': 'Brand', name: 'Polyhydron' },
    { '@type': 'Brand', name: 'Hydroline Products' },
    { '@type': 'Brand', name: 'Micro Pre Temp' },
    { '@type': 'Brand', name: 'H-T' },
    { '@type': 'Brand', name: 'Enerpac' },
    { '@type': 'Brand', name: 'Festo' },
    { '@type': 'Brand', name: 'Vickers' },
    { '@type': 'Brand', name: 'Dowty' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.1',
    reviewCount: '40',
    bestRating: '5',
    worstRating: '1',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91 98843 69751',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil', 'Hindi'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '044 42161198',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil', 'Hindi'],
    },
  ],
  location: [
    {
      '@type': 'Place',
      name: 'Shop - Parrys Corner',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '148, Angappa Naicken Street, Parrys Corner, Near High Court',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.0934057,
        longitude: 80.2546441,
      },
    },
    {
      '@type': 'Place',
      name: 'Factory - Ambattur Industrial Estate',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '53/26, Amman Koil Street, Athipet, Kuppam, Ambattur Industrial Estate',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600058',
        addressCountry: 'IN',
      },
    },
  ],
};

/**
 * WebSite schema with SearchAction
 */
export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'A.M. Hydraulics & Tubes',
  description: 'Buy hydraulic hoses, fittings, pumps, valves, and pneumatic components online in India',
  publisher: {
    '@id': ORGANIZATION_ID,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

/**
 * FAQPage schema with comprehensive questions and answers
 */
export const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I buy hydraulic hoses in Chennai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A.M. Hydraulics & Tubes is a leading supplier of hydraulic hoses in Chennai, located at 148, Angappa Naicken Street, Parrys Corner. We are authorized stockists for Parker, Polyhose, and other premium brands. We offer Parker R1, R2, 4SP, 4SH high-pressure hoses, Teflon hoses, SS bellow hoses, and custom hose assemblies with crimping services. Call +91 98843 69751 for immediate assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are you an authorized Parker dealer in Chennai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, A.M. Hydraulics & Tubes is an authorized stockist and dealer for Parker hydraulic products in Chennai. We supply genuine Parker hoses, fittings, and components with manufacturer warranty. We have been serving the hydraulic industry since 1999 and maintain ISO 9001:2015 and ISO 14001:2015 certifications.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you supply hydraulic components pan-India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we supply hydraulic and pneumatic components across India. While our primary locations are in Chennai (Parrys Corner shop and Ambattur factory), we serve customers in Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and other states. We offer shipping and logistics support for bulk orders.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide custom hydraulic hose assembly and crimping services?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we specialize in custom hydraulic hose assemblies and professional crimping services. We can manufacture hoses to your exact specifications with the correct fittings (JIC, BSP, NPT, SAE) and pressure ratings. Our experienced technicians ensure proper crimping for leak-free, high-pressure applications. Contact us at +91 98843 69751 for custom assembly quotes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which brands do you stock?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are authorized stockists for Parker, Polyhose, Yuken, Rexroth (Bosch Group), Boss Hydraulics, Torque, Polyhydron, Hydroline Products, Micro Pre Temp, H-T, Enerpac, Festo, Vickers, and Dowty. All products are genuine and come with manufacturer warranties.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your business address and contact number?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shop Address: 148, Angappa Naicken Street, Parrys Corner, Near High Court, Chennai – 600001, Tamil Nadu, India. Factory Address: 53/26, Amman Koil Street, Athipet, Kuppam, Ambattur Industrial Estate, Chennai – 600058. Phone: +91 98843 69751 (Primary), 044 42161198 (Office). WhatsApp: +91 93827 13392. Email: info@amhat.com',
      },
    },
    {
      '@type': 'Question',
      name: 'What are DIN, BSP, and NPT fittings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DIN (Deutsches Institut für Normung) fittings are German standard metric fittings commonly used in European hydraulic systems. BSP (British Standard Pipe) fittings use British thread standards and are common in India and Commonwealth countries. NPT (National Pipe Thread) fittings are American standard tapered threads. We stock all three types including JIC (Joint Industry Council) and SAE (Society of Automotive Engineers) fittings. Our team can help you identify the correct fitting type for your application.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are you ISO certified?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, A.M. Hydraulics & Tubes holds ISO 9001:2015 certification for Quality Management System and ISO 14001:2015 certification for Environmental Management System, both issued in 2024. These certifications demonstrate our commitment to quality, customer satisfaction, and environmental responsibility.',
      },
    },
  ],
};

/**
 * Generate Product schema for individual product pages
 */
export function generateProductJsonLd(product: Product & {
  category?: { name: string; parent?: { name: string; parent?: { name: string } } };
  product_master_values?: Array<{
    master_values?: {
      value: string;
      master_fields?: {
        label: string;
        unit?: string | null;
      };
    };
  }>;
}): Record<string, any> {
  // Build category breadcrumb string
  let categoryPath = '';
  if (product.category) {
    const categories: string[] = [];
    let current = product.category;
    
    // Traverse up the category tree
    while (current) {
      categories.unshift(current.name);
      current = current.parent as any;
    }
    
    categoryPath = categories.join(' > ');
  }

  // Extract specifications for additionalProperty
  const specifications: Array<{ name: string; value: string }> = [];
  if (product.product_master_values) {
    product.product_master_values.forEach((pmv) => {
      if (pmv.master_values?.master_fields) {
        const label = pmv.master_values.master_fields.label;
        const value = pmv.master_values.value;
        const unit = pmv.master_values.master_fields.unit;
        specifications.push({
          name: label,
          value: unit ? `${value} ${unit}` : value,
        });
      }
    });
  }

  // Determine brand from product name or specifications
  const knownBrands = ['Parker', 'Polyhose', 'Yuken', 'Rexroth', 'Boss', 'Torque', 'Polyhydron', 'Enerpac', 'Festo', 'Vickers', 'Dowty'];
  let detectedBrand = 'A.M. Hydraulics & Tubes';
  
  for (const brand of knownBrands) {
    if (product.name.toLowerCase().includes(brand.toLowerCase())) {
      detectedBrand = brand;
      break;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/products/${product.sku}`,
    name: product.name,
    description: product.description || `${product.name} - High-quality hydraulic component available from A.M. Hydraulics & Tubes, Chennai. Authorized supplier with ISO 9001:2015 certification.`,
    url: `${SITE_URL}/products/${product.sku}`,
    image: product.image_url ? [product.image_url] : [`${SITE_URL}/og-default.jpg`],
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: detectedBrand,
    },
    manufacturer: {
      '@id': ORGANIZATION_ID,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.sku}`,
      priceCurrency: 'INR',
      availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@id': ORGANIZATION_ID,
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    },
    additionalProperty: specifications.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.name,
      value: spec.value,
    })),
    category: categoryPath,
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate CollectionPage schema for category pages
 */
export function generateCollectionPageJsonLd(
  name: string,
  description: string,
  url: string,
  productCount?: number
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name,
    description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': ORGANIZATION_ID,
    },
    ...(productCount !== undefined && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: productCount,
      },
    }),
  };
}
