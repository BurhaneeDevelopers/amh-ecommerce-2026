import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowUpRight, User } from 'lucide-react'
import { Blog } from '@/supabase/schema/schema.type'
import Image from 'next/image'

interface BlogCardProps {
    blog: Blog
    variant?: 'default' | 'horizontal' | 'minimal'
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, variant = 'default' }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const imageUrl = blog.featured_image || blog.gallery_images?.[0]

    // Horizontal layout - image left, content right
    if (variant === 'horizontal') {
        return (
            <Link href={`/blog/${blog.slug}`} className="block group max-w-xl">
                <article className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-white border border-gray-100 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    {/* Image */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        {imageUrl ? (
                            <Image
                                width={192}
                                height={144}
                                src={imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-amber-50 flex items-center justify-center">
                                <span className="text-primary text-xs font-medium">No Image</span>
                            </div>
                        )}
                        {blog.category && (
                            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-semibold px-2 py-1 rounded-md">
                                {blog.category.category_name}
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center flex-grow min-w-0">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(blog.publish_date || blog.created_at || '')}
                            </span>
                            {blog.read_time && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {blog.read_time} min read
                                </span>
                            )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {blog.title}
                        </h3>

                        {blog.excerpt && (
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                {blog.excerpt}
                            </p>
                        )}

                        <div className="flex items-center gap-2 mt-auto">
                            {blog.author_image ? (
                                <Image
                                    width={20}
                                    height={20}
                                    src={getOptimizedImageUrl(blog.author_image, 40)}
                                    alt={blog.author_name}
                                    className="w-5 h-5 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <User className="w-3 h-3 text-primary" />
                                </div>
                            )}
                            <span className="text-xs text-gray-500">{blog.author_name || 'Anonymous'}</span>
                        </div>
                    </div>
                </article>
            </Link>
        )
    }

    // Minimal layout - compact, text-focused
    if (variant === 'minimal') {
        return (
            <Link href={`/blog/${blog.slug}`} className="block group">
                <article className="relative pl-4 border-l-2 border-gray-200 hover:border-primary transition-colors duration-300 py-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
                        <span>{formatDate(blog.publish_date || blog.created_at || '')}</span>
                        {blog.category && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-primary font-medium">{blog.category.category_name}</span>
                            </>
                        )}
                    </div>

                    <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                    </h3>

                    {blog.read_time && (
                        <span className="text-[10px] text-gray-400 mt-1.5 block">
                            {blog.read_time} min read
                        </span>
                    )}
                </article>
            </Link>
        )
    }

    // Default layout - modern card with overlay style
    return (
        <Link href={`/blog/${blog.slug}`} className="block group h-full max-w-sm!">
            <article className="relative h-full rounded-2xl overflow-hidden bg-gray-900">
                {/* Background Image */}
                <div className="absolute inset-0">
                    {imageUrl ? (
                        <Image
                            width={500}
                            height={500}
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-5 min-h-[320px]">
                    {/* Category Badge */}
                    {blog.category && (
                        <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                {blog.category.category_name}
                            </span>
                        </div>
                    )}

                    {/* Arrow Icon - Top Right */}
                    <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-white/70 mb-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(blog.publish_date || blog.created_at || '')}
                        </span>
                        {blog.read_time && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {blog.read_time} min read
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Author & Tags */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            {blog.author_image ? (
                                <Image
                                    width={24}
                                    height={24}
                                    src={getOptimizedImageUrl(blog.author_image, 48)}
                                    alt={blog.author_name}
                                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white/20"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
                                    {(blog.author_name || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs text-white/80 font-medium">{blog.author_name || 'Anonymous'}</span>
                        </div>

                        {blog.tags && blog.tags.length > 0 && (
                            <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded">
                                {blog.tags[0]}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default BlogCard
