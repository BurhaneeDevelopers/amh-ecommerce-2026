import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import BlogListingClient from './blog-client';

export const metadata: Metadata = {
  title: 'Blog — Hydraulic & Pneumatic Industry Knowledge | A.M. Hydraulics Chennai',
  description: 'Read expert articles, guides, and industry insights about hydraulic hoses, fittings, pumps, valves, and pneumatic components. Technical knowledge from A.M. Hydraulics & Tubes, ISO 9001:2015 certified hydraulic components supplier in Chennai, India.',
  alternates: {
    canonical: 'https://hydraulicstore.in/blog',
  },
  openGraph: {
    title: 'Blog — Hydraulic & Pneumatic Industry Knowledge',
    description: 'Expert articles and guides about hydraulic and pneumatic components from A.M. Hydraulics & Tubes.',
    url: 'https://hydraulicstore.in/blog',
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
