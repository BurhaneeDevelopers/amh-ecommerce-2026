'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react'
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
    } = useGetRecentBlogs(9); // Fetch 9 recent blogs

    if (blogs_error) toast.error("Error fetching blogs");
    
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    
    // Responsive items per page
    const getItemsPerPage = () => {
        if (typeof window === 'undefined') return 3;
        const width = window.innerWidth;
        if (width < 768) return 1; // mobile
        if (width < 1024) return 2; // tablet
        return 3; // desktop
    };
    const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
    
    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(getItemsPerPage());
            setCurrentIndex(0); // Reset to first page on resize
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const totalPages = Math.ceil(blogs.length / itemsPerPage);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < totalPages - 1;

    const handleNext = useCallback(() => {
        if (canGoNext && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(prev => prev + 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [canGoNext, isAnimating]);

    const handlePrev = useCallback(() => {
        if (canGoPrev && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(prev => prev - 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [canGoPrev, isAnimating]);

    const currentBlogs = blogs.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

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
            <div className="flex justify-between items-center">
                <H2>Latest from Our Blog</H2>
                <div className="flex gap-2 items-center">
                    {totalPages > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className={`bg-[#272727] p-2 rounded-full transition-opacity duration-200 ${
                                    !canGoPrev || isAnimating ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'
                                }`}
                                disabled={!canGoPrev || isAnimating}
                            >
                                <ChevronLeft color='#fff' size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className={`bg-[#272727] p-2 rounded-full transition-opacity duration-200 ${
                                    !canGoNext || isAnimating ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'
                                }`}
                                disabled={!canGoNext || isAnimating}
                            >
                                <ChevronRight color='#fff' size={24} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="mt-7">
                <div className="relative overflow-hidden min-h-[400px]">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    >
                        {currentBlogs.map((blog: Blog) => (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                className="group bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Featured Image */}
                                <div className="relative h-48 overflow-hidden">
                                    {blog.featured_image ? (
                                        <Image
                                            src={blog.featured_image}
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
                                <div className="p-6">
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
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-[#272727] transition-colors">
                                        {blog.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {blog.excerpt && (
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    {/* Author */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {blog.author_image ? (
                                                <Image
                                                    src={blog.author_image}
                                                    alt={blog.author_name}
                                                    width={24}
                                                    height={24}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs font-medium capitalize">
                                                        {blog.author_name}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-xs text-gray-600">{blog.author_name}</span>
                                        </div>
                                        
                                        <ArrowRight 
                                            size={16} 
                                            className="text-gray-400 group-hover:text-[#272727] group-hover:translate-x-1 transition-all" 
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Fill empty slots to maintain grid structure */}
                        {Array.from({ length: itemsPerPage - currentBlogs.length }).map((_, index) => (
                            <div key={`empty-${index}`} className="w-full h-fit opacity-0 pointer-events-none">
                                {/* Invisible placeholder to maintain grid */}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Footer with pagination and view all link */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                    Showing {currentIndex * itemsPerPage + 1} - {Math.min((currentIndex + 1) * itemsPerPage, blogs.length)} of {blogs.length} articles
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Pagination Dots */}
                    {totalPages > 1 && totalPages <= 5 && (
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (!isAnimating) {
                                            setIsAnimating(true);
                                            setCurrentIndex(index);
                                            setTimeout(() => setIsAnimating(false), 300);
                                        }
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentIndex 
                                            ? 'bg-[#272727] w-6' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    disabled={isAnimating}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* View All Blogs link */}
                    <Link 
                        href="/blog" 
                        className="text-sm text-[#272727] hover:underline font-medium"
                    >
                        View All Articles →
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default BlogsSection
