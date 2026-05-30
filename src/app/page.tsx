import MainColumn from "@/components/layout/home/main-column";
import JsonLd from "@/components/seo/JsonLd";
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, FAQ_JSON_LD } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'A.M. Hydraulics & Tubes — Hydraulic Hoses, Fittings, Pumps, Valves, Cylinders | ISO Certified Supplier Chennai, India',
  description: 'A.M. Hydraulics & Tubes — Leading ISO 9001:2015 & ISO 14001:2015 certified manufacturer and authorized distributor of hydraulic hoses (Parker R1, R2, 4SP, 4SH), hydraulic fittings (JIC, BSP, NPT, SAE), hydraulic pumps (Yuken, Polyhydron, Vickers), hydraulic valves (Yuken, Rexroth solenoid valves), hydraulic cylinders, hydraulic power packs, and pneumatic components (Festo) in Chennai, Tamil Nadu, India. Authorized stockist for Parker, Polyhose, Yuken, Rexroth (Bosch Group), Boss Hydraulics, Torque, Enerpac, Festo, Vickers, Dowty. Serving since 1999. Shop: 148 Angappa Naicken Street, Parrys Corner, Chennai 600001. Factory: Ambattur Industrial Estate. Call +91 98843 69751 for hydraulic hose crimping, custom assemblies, and bulk orders.',
  alternates: {
    canonical: 'https://hydraulicstore.in',
  },
  openGraph: {
    title: 'A.M. Hydraulics & Tubes — Hydraulic Components Supplier Chennai | ISO Certified Since 1999',
    description: 'ISO certified manufacturer and authorized distributor of hydraulic hoses, fittings, pumps, valves, cylinders, and pneumatic components. Authorized Parker, Yuken, Rexroth, Festo dealer in Chennai.',
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
};

export default function Home() {
  return (
    <>
      <JsonLd data={[ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, FAQ_JSON_LD]} />
      <MainColumn />
    </>
  );
}
