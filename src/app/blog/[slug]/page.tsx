'use client'

import { useParams } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Wrapper } from '@/components/layout/wrapper'
import { useGetBlogBySlug, useGetRelatedBlogs } from '@/api/blogs.service'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/blocks/blog-card'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function BlogDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const { data: blog, isLoading, error } = useGetBlogBySlug(slug)
    const { data: relatedBlogs = [] } = useGetRelatedBlogs(
        blog?.id || '',
        blog?.category_id || '',
        3
    )

    useEffect(() => {
        if (error) toast.error("Error loading blog post")
    }, [error])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title,
                    text: blog?.excerpt || '',
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard!')
        }
    }

    if (isLoading) {
        return (
            <Container>
                <Wrapper>
                    <div className="py-8 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </Wrapper>
            </Container>
        )
    }

    if (!blog) {
        return (
            <Container>
                <Wrapper>
                    <div className="py-16 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
                        <Link href="/blog">
                            <Button>
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                </Wrapper>
            </Container>
        )
    }

    return (
        <Container>
            <Wrapper>
                <div className="py-8">
                    {/* Back Button */}
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Blog
                    </Link>

                    {/* Article Header */}
                    <article className="max-w-4xl mx-auto">
                        {/* Category */}
                        {blog.category && (
                            <div className="mb-4">
                                <span className="bg-[#272727] text-white text-sm px-3 py-1 rounded-full">
                                    {blog.category.category_name}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {blog.excerpt}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                {blog.author_image ? (
                                    <Image
                                        src={blog.author_image}
                                        alt={blog.author_name || 'Author'}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">
                                            {blog.author_name?.charAt(0).toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                )}
                                <span className="font-medium text-gray-700">{blog.author_name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{formatDate(blog.publish_date || blog.created_at || '')}</span>
                            </div>
                            {blog.read_time && (
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{blog.read_time} min read</span>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="ml-auto"
                            >
                                <Share2 size={16} className="mr-2" />
                                Share
                            </Button>
                        </div>

                        {/* Featured Image */}
                        {blog.featured_image && (
                            <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-xl overflow-hidden">
                                <Image
                                    src={blog.featured_image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none mb-8"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-700">Tags:</span>
                                {blog.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Gallery Images */}
                        {blog.gallery_images && blog.gallery_images.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {blog.gallery_images.map((image, index) => (
                                        <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`Gallery image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Related Posts */}
                    {relatedBlogs.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedBlogs.map((relatedBlog) => (
                                    <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Wrapper>
        </Container>
    )
}
