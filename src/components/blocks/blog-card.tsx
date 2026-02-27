import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Blog } from '@/supabase/schema/schema.type'
import { Card, CardContent } from '../ui/card'

interface BlogCardProps {
    blog: Blog
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <Link href={`/blog/${blog.slug}`} className="block h-full">
            <Card className="group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-xl h-full flex flex-col hover:-translate-y-1">
                <CardContent className="p-0 h-full flex flex-col">
                    {/* Featured Image */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0 border-b border-gray-100">
                        {blog.gallery_images && blog.gallery_images.length > 0 ? (
                            <img
                                src={blog.gallery_images[0]}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
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
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                {blog.excerpt}
                            </p>
                        )}

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.slice(0, 3).map((tag) => (
                                    <span 
                                        key={tag} 
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Author */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                {blog.author_image ? (
                                    <img
                                        src={blog.author_image}
                                        alt={blog.author_name || 'Author'}
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
                </CardContent>
            </Card>
        </Link>
    )
}

export default BlogCard
