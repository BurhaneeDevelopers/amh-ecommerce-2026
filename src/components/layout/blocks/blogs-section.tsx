'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { toast } from 'sonner'
import { useGetRecentBlogs } from '@/api/blogs.service'
import BlogCard from '@/components/blocks/blog-card'

const BlogsSection = () => {
    const {
        data: blogs = [],
        error: blogs_error,
        isLoading
    } = useGetRecentBlogs(4); // Fetch 4 recent blogs for home page

    if (blogs_error) toast.error("Error fetching blogs");

    if (isLoading) {
        return (
            <Container className='!px-0 mt-16'>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-7"></div>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-gray-100 rounded-lg h-80 !w-72 2xl:w-80! flex-shrink-0"></div>
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

            {/* Blogs Grid - Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-4 sm:gap-6 flex-wrap">
                {blogs.slice(0, 4).map((blog) => (
                    <div key={blog.id} className="flex-shrink-0">
                        <BlogCard blog={blog} />
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default BlogsSection
