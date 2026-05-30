import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import ProtectedComponent from "@/components/layout/ProtectedComponent";
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900']
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hydraulicstore.in'),
  title: {
    default: 'A.M. Hydraulics & Tubes — Hydraulic Hoses, Fittings, Pumps, Valves | Chennai, India',
    template: '%s | A.M. Hydraulics & Tubes Chennai',
  },
  description: 'A.M. Hydraulics & Tubes — ISO 9001:2015 & ISO 14001:2015 certified manufacturer and authorized distributor of hydraulic hoses, fittings, pumps, valves, cylinders, and pneumatic components in Chennai, India. Authorized stockist for Parker, Polyhose, Yuken, Rexroth, Boss Hydraulics, Torque, Enerpac, Festo, Vickers since 1999. Call +91 98843 69751.',
  keywords: [
    // Product categories with location
    'hydraulic hoses Chennai', 'hydraulic fittings Chennai', 'hydraulic pumps Chennai', 'hydraulic valves Chennai',
    'hydraulic cylinders Chennai', 'hydraulic power packs Chennai', 'pneumatic components Chennai',
    'hydraulic hoses India', 'hydraulic fittings India', 'hydraulic pumps India', 'hydraulic valves India',
    'industrial hoses Chennai', 'Parker hoses Chennai', 'Yuken valves Chennai', 'Rexroth components Chennai',
    // Brand dealers
    'Parker dealer Chennai', 'Polyhose dealer Chennai', 'Yuken dealer Chennai', 'Rexroth dealer Chennai',
    'Enerpac dealer Chennai', 'Festo dealer Chennai', 'Vickers dealer Chennai',
    // Business names
    'A.M. Hydraulics & Tubes', 'AM Hydraulics Chennai', 'AMHAT', 'A.M. Hydraulics Tubes',
    'hydraulicstore.in', 'am-hydraulics.com',
    // Services
    'hydraulic hose crimping Chennai', 'custom hose assembly Chennai', 'hydraulic equipment supplier Chennai',
    'hydraulic components supplier India', 'pneumatic fittings supplier Chennai',
  ],
  authors: [{ name: 'A.M. Hydraulics & Tubes' }],
  creator: 'A.M. Hydraulics & Tubes',
  publisher: 'A.M. Hydraulics & Tubes',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://hydraulicstore.in',
    siteName: 'A.M. Hydraulics & Tubes',
    title: 'A.M. Hydraulics & Tubes — Hydraulic Hoses, Fittings, Pumps, Valves | Chennai, India',
    description: 'ISO certified manufacturer and authorized distributor of hydraulic and pneumatic components in Chennai. Authorized stockist for Parker, Yuken, Rexroth, Festo since 1999.',
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
    title: 'A.M. Hydraulics & Tubes — Hydraulic Components Supplier Chennai',
    description: 'ISO certified supplier of hydraulic hoses, fittings, pumps, valves. Authorized Parker, Yuken, Rexroth dealer.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://hydraulicstore.in',
    languages: {
      'en-IN': 'https://hydraulicstore.in',
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    google: '', // Paste verification code from Google Search Console
    // Add your Bing Webmaster Tools verification code here
    other: {
      'msvalidate.01': '', // Paste verification code from Bing Webmaster Tools
    },
  },
  other: {
    // Geo meta tags for local SEO
    'geo.region': 'IN-TN',
    'geo.placename': 'Chennai',
    'geo.position': '13.0934057;80.2546441',
    'ICBM': '13.0934057, 80.2546441',
    // Dublin Core metadata
    'DC.title': 'A.M. Hydraulics & Tubes — Hydraulic Components Supplier Chennai',
    'DC.subject': 'Hydraulic Hoses, Hydraulic Fittings, Hydraulic Pumps, Hydraulic Valves, Pneumatic Components',
    'DC.description': 'ISO certified manufacturer and authorized distributor of hydraulic and pneumatic components in Chennai, India since 1999',
    'DC.creator': 'A.M. Hydraulics & Tubes',
    'DC.publisher': 'A.M. Hydraulics & Tubes',
    'DC.language': 'en-IN',
    'DC.coverage': 'Chennai, Tamil Nadu, India',
    'DC.rights': '© 1999-2026 A.M. Hydraulics & Tubes. All rights reserved.',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9HDWZC7HCN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9HDWZC7HCN');
          `}
        </Script>
        
        {/* Entity verification links for AI systems */}
        <link rel="me" href="https://www.linkedin.com/company/amhydraulicsandtubes/" />
        <link rel="me" href="https://www.am-hydraulics.com" />
        <link rel="me" href="https://www.amhydraulics.in" />
        <link rel="me" href="https://www.hydraulicsstore.in" />
        <link rel="me" href="https://www.amhydraulicsstore.com" />
        <link rel="me" href="https://www.amhydraulicstore.com" />
        <link rel="me" href="https://www.amhydraulics.in" />
        <link rel="me" href="https://www.amhat.com" />
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <NextTopLoader
          color="#ff6b35"
          height={4}
          showSpinner={false}
          speed={200}
          shadow="0 0 10px #ff6b35,0 0 5px #ff6b35"
        />
        <ProtectedComponent>
          {children}
        </ProtectedComponent>
      </body>
    </html>
  );
}
