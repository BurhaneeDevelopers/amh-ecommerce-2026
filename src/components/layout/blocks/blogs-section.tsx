'use client'

import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { toast } from 'sonner'
import { useGetRecentBlogs } from '@/api/blogs.service'
import { Blog } from '@/supabase/schema/schema.type'

const BlogsSection = () => {
    const {
        data: blogs = [],
        error: blogs_error,
        isLoading
    } = useGetRecentBlogs(4); // Fetch 4 recent blogs for home page

    if (blogs_error) toast.error("Error fetching blogs");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <Container className='!px-0 mt-16'>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-7"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-gray-100 rounded-lg h-80"></div>
                        ))}
                    </div>
                </div>
            </Container>
        );
    }

    if (!blogs.length) {
        return null;
    }

    return (
        <Container className='!px-0 mt-16'>
            {/* Header */}
            <div className="flex justify-between items-center mb-7">
                <H2>Latest from Our Blog</H2>
                <Link 
                    href="/blog" 
                    className="text-sm text-[#272727] hover:underline font-medium flex items-center gap-1"
                >
                    View All Articles
                    <ArrowRight size={16} />
                </Link>
            </div>

            {/* Blogs Grid - Show 4 blogs in a 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {blogs.slice(0, 4).map((blog: Blog) => (
                    <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        className="group bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Featured Image */}
                        <div className="relative h-48 overflow-hidden">
                            {blog.gallery_images && blog.gallery_images.length > 0 ? (
                                <Image
                                    src={blog.gallery_images[0]}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">No Image</span>
                                </div>
                            )}
                            
                            {/* Category Badge */}
                            {blog.category && (
                                <div className="absolute top-3 left-3">
                                    <span className="bg-[#272727] text-white text-xs px-2 py-1 rounded-full">
                                        {blog.category.category_name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{formatDate(blog.publish_date || blog.created_at || '')}</span>
                                </div>
                                {blog.read_time && (
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{blog.read_time} min read</span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-[#272727] transition-colors">
                                {blog.title}
                            </h3>

                            {/* Excerpt */}
                            {blog.excerpt && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {blog.excerpt}
                                </p>
                            )}

                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {blog.author_image ? (
                                        <Image
                                            src={blog.author_image}
                                            alt={blog.author_name || 'Author'}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs font-medium">
                                                {blog.author_name?.charAt(0).toUpperCase() || 'A'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-600">{blog.author_name || 'Anonymous'}</span>
                                </div>
                                
                                <ArrowRight 
                                    size={16} 
                                    className="text-gray-400 group-hover:text-[#272727] group-hover:translate-x-1 transition-all" 
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Container>
    )
}

export default BlogsSection
