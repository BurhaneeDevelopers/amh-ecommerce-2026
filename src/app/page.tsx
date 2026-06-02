import MainColumn from "@/components/layout/home/main-column";
import JsonLd from "@/components/seo/JsonLd";
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, FAQ_JSON_LD } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Hydraulic Components Supplier Chennai | AM Hydraulics',
  description: 'ISO certified authorized distributor of Parker, Yuken, Rexroth hydraulic hoses, fittings, pumps since 1999. Call for bulk pricing in Tamil Nadu.',
  alternates: {
    canonical: 'https://hydraulicstore.in',
  },
  openGraph: {
    title: 'Hydraulic Components Supplier Chennai — Authorized Distributor',
    description: 'Authorized Parker, Yuken, Rexroth dealer supplying hydraulic hoses, fittings, pumps, valves in Chennai. ISO 9001:2015 certified since 1999. Custom hose crimping available.',
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
    title: 'Hydraulic Components Supplier Chennai — Authorized Distributor',
    description: 'Authorized Parker, Yuken, Rexroth dealer supplying hydraulic hoses, fittings, pumps, valves in Chennai. ISO 9001:2015 certified since 1999. Custom hose crimping available.',
    images: ['/og-default.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={[ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, FAQ_JSON_LD]} />
      <MainColumn />
    </>
  );
}
