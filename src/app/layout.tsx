import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import ProtectedComponent from "@/components/layout/ProtectedComponent";
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap', // Prevent FOIT (Flash of Invisible Text)
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true, // Reduce CLS from font loading
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true, // Reduce CLS from font loading
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hydraulicstore.in'),
  title: {
    default: 'Hydraulic Components Supplier Chennai | AM Hydraulics',
    template: '%s | AM Hydraulics',
  },
  description: 'ISO certified authorized distributor of Parker, Yuken, Rexroth hydraulic hoses, fittings, pumps since 1999. Call for bulk pricing in Tamil Nadu.',
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
    title: 'Hydraulic Components Supplier Chennai — Authorized Distributor',
    description: 'Authorized Parker, Yuken, Rexroth dealer supplying hydraulic hoses, fittings, pumps, valves in Chennai. ISO 9001:2015 certified since 1999.',
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
    description: 'Authorized Parker, Yuken, Rexroth dealer supplying hydraulic hoses, fittings, pumps, valves in Chennai. ISO 9001:2015 certified since 1999.',
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
    'DC.title': 'Hydraulic Components Supplier Chennai | AM Hydraulics',
    'DC.subject': 'Hydraulic Hoses, Hydraulic Fittings, Hydraulic Pumps, Hydraulic Valves, Pneumatic Components',
    'DC.description': 'ISO certified authorized distributor of Parker, Yuken, Rexroth hydraulic hoses, fittings, pumps since 1999 in Chennai',
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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/banners/banner.png" as="image" type="image/png" fetchpriority="high" />
        
        {/* Google Analytics - Deferred for better performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9HDWZC7HCN"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9HDWZC7HCN', {
              page_path: window.location.pathname,
            });
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
        suppressHydrationWarning
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
