import MainColumn from "@/components/layout/home/main-column";
import JsonLd from "@/components/seo/JsonLd";
import { FAQ_JSON_LD, HOME_PAGE_JSON_LD, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Hydraulic Components, Hoses & Fittings Supplier in Chennai',
  description: 'Buy hydraulic components, hydraulic hoses, hose fittings, tubes, pumps, valves, and pneumatic products from a trusted supplier in Chennai. A.M. Hydraulics & Tubes serves industrial buyers across Tamil Nadu.',
  keywords: [
    'hydraulic components in chennai',
    'hydraulic hoses in chennai',
    'hydraulic fittings in chennai',
    'hydraulic tube suppliers chennai',
    'hydraulic pumps and valves chennai',
    'pneumatic components chennai',
  ],
  alternates: {
    canonical: 'https://hydraulicstore.in',
  },
  openGraph: {
    title: 'Hydraulic Components, Hoses & Fittings Supplier in Chennai',
    description: 'Hydraulic hoses, fittings, tubes, pumps, valves, and pneumatic products for industrial buyers in Chennai. Custom hose assembly and quote support available.',
    url: 'https://hydraulicstore.in',
    type: 'website',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'A.M. Hydraulics & Tubes - Hydraulic Components Supplier Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hydraulic Components, Hoses & Fittings Supplier in Chennai',
    description: 'Hydraulic hoses, fittings, tubes, pumps, valves, and pneumatic products for industrial buyers in Chennai. Custom hose assembly and quote support available.',
    images: ['/og-default.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={[ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, HOME_PAGE_JSON_LD, FAQ_JSON_LD]} />
      <MainColumn />
    </>
  );
}
