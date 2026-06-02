import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import BlogListingClient from './blog-client';

export const metadata: Metadata = {
  title: 'Hydraulic & Pneumatic Industry Insights',
  description: 'Expert guides on hydraulic hoses, fittings, pumps for engineers and buyers. Technical insights from ISO certified supplier in Chennai.',
  alternates: {
    canonical: 'https://hydraulicstore.in/blog',
  },
  openGraph: {
    title: 'Hydraulic Industry Insights — Technical Guides for Engineers',
    description: 'Technical articles about hydraulic components, maintenance tips, and industry best practices. Written by authorized Parker, Yuken, Rexroth dealer in Chennai.',
    url: 'https://hydraulicstore.in/blog',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Hydraulic Industry Blog - A.M. Hydraulics & Tubes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hydraulic Industry Insights — Technical Guides for Engineers',
    description: 'Technical articles about hydraulic components, maintenance tips, and industry best practices. Written by authorized Parker, Yuken, Rexroth dealer in Chennai.',
    images: ['/og-default.jpg'],
  },
};

export default function BlogListingPage() {
  return (
    <Suspense fallback={
      <Container>
        <div className="py-8 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Container>
    }>
      <BlogListingClient />
    </Suspense>
  );
}
