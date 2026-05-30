import { Metadata } from 'next';
import { createClient } from '@/supabase/client';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import BlogDetailClient from './blog-detail-client';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbJsonLd } from '@/lib/seo/structured-data';

export const revalidate = 86400; // 24 hours ISR

type Props = {
  params: { slug: string };
};

async function getBlog(slug: string) {
  const supabase = createClient();
  const { data: blog } = await supabase
    .from('blogs')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return blog;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.excerpt || blog.title;

  return {
    title,
    description,
    keywords: blog.tags || [],
    authors: blog.author_name ? [{ name: blog.author_name }] : [],
    alternates: {
      canonical: `https://hydraulicstore.in/blog/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hydraulicstore.in/blog/${params.slug}`,
      type: 'article',
      publishedTime: blog.publish_date || blog.created_at,
      modifiedTime: blog.updated_at || undefined,
      authors: blog.author_name ? [blog.author_name] : [],
      section: 'Hydraulic Industry',
      tags: blog.tags || [],
      images: blog.gallery_images && blog.gallery_images.length > 0
        ? blog.gallery_images.map((img: string) => ({
            url: img,
            width: 1200,
            height: 630,
            alt: blog.title,
          }))
        : [
            {
              url: '/og-default.jpg',
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.gallery_images && blog.gallery_images.length > 0 ? [blog.gallery_images[0]] : ['/og-default.jpg'],
    },
  };
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug')
    .eq('is_published', true);

  return (blogs || []).map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return null;
  }

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt || blog.title,
    image: blog.gallery_images && blog.gallery_images.length > 0 ? blog.gallery_images : ['/og-default.jpg'],
    datePublished: blog.publish_date || blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      '@type': 'Organization',
      name: 'A.M. Hydraulics & Tubes',
      url: 'https://hydraulicstore.in',
    },
    publisher: {
      '@id': 'https://hydraulicstore.in/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hydraulicstore.in/blog/${params.slug}`,
    },
    about: {
      '@type': 'Thing',
      name: 'Hydraulic Components',
    },
    keywords: blog.tags ? blog.tags.join(', ') : '',
  };

  // Breadcrumb JSON-LD
  const breadcrumbData = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://hydraulicstore.in' },
    { name: 'Blog', url: 'https://hydraulicstore.in/blog' },
    { name: blog.title, url: `https://hydraulicstore.in/blog/${params.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbData]} />
      <Suspense fallback={
        <Container>
          <div className="py-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </Container>
      }>
        <BlogDetailClient />
      </Suspense>
    </>
  );
}
