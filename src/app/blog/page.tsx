'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Wrapper } from '@/components/layout/wrapper'
import { useGetPublishedBlogs, useGetAllTags } from '@/api/blogs.service'
import { Blog } from '@/supabase/schema/schema.type'
import BlogCard from '@/components/blocks/blog-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import { H1 } from '@/components/typography/typography'
import { toast } from 'sonner'

export default function BlogListingPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    
    const { data: blogs = [], isLoading, error } = useGetPublishedBlogs()
    const { data: tags = [] } = useGetAllTags()

    if (error) toast.error("Error loading blogs")

    // Filter blogs based on search and tag
    const filteredBlogs = blogs.filter((blog: Blog) => {
        const matchesSearch = searchQuery === '' || 
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesTag = !selectedTag || blog.tags?.includes(selectedTag)
        
        return matchesSearch && matchesTag
    })

    return (
        <Container>
            <Wrapper>
                <div className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <H1 className="mb-2">Our Blog</H1>
                        <p className="text-gray-600">
                            Discover insights, tips, and updates from our team
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>

                        {/* Tags Filter */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 items-center">
                                <Filter size={16} className="text-gray-500" />
                                <Button
                                    variant={selectedTag === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedTag(null)}
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                                {tags.map((tag: string) => (
                                    <Button
                                        key={tag}
                                        variant={selectedTag === tag ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedTag(tag)}
                                        className="rounded-full"
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Blog Grid */}
                    {!isLoading && filteredBlogs.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map((blog: Blog) => (
                                <BlogCard key={blog.id} blog={blog} />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!isLoading && filteredBlogs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                {searchQuery || selectedTag 
                                    ? "No articles found matching your criteria" 
                                    : "No articles available yet"}
                            </p>
                        </div>
                    )}

                    {/* Results Count */}
                    {!isLoading && filteredBlogs.length > 0 && (
                        <div className="mt-8 text-center text-sm text-gray-500">
                            Showing {filteredBlogs.length} of {blogs.length} articles
                        </div>
                    )}
                </div>
            </Wrapper>
        </Container>
    )
}
