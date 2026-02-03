'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { H2, P } from '@/components/typography/typography'
import { Container } from '../container'
import ProductCard from '@/components/blocks/product-card'
import { useGetProductsByMainCategory } from '@/api/products.service'
import { Category } from '@/supabase/schema/schema.type'

interface CategoryProductsSectionProps {
    category: Category
}

const CategoryProductsSection = ({ category }: CategoryProductsSectionProps) => {
    const { data: products = [], isLoading } = useGetProductsByMainCategory(category.id || '', 20)
    const [currentPage, setCurrentPage] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    
    // Configuration for responsive grid
    const itemsPerPage = 10 // Show 10 products per page (2 rows of 5)
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const canGoNext = currentPage < totalPages - 1
    const canGoPrev = currentPage > 0

    // Get current page products
    const currentProducts = products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    // Navigation handlers
    const handleNext = useCallback(() => {
        if (canGoNext && !isAnimating) {
            setIsAnimating(true)
            setCurrentPage(prev => prev + 1)
            setTimeout(() => setIsAnimating(false), 300)
        }
    }, [canGoNext, isAnimating])

    const handlePrev = useCallback(() => {
        if (canGoPrev && !isAnimating) {
            setIsAnimating(true)
            setCurrentPage(prev => prev - 1)
            setTimeout(() => setIsAnimating(false), 300)
        }
    }, [canGoPrev, isAnimating])

    if (isLoading) {
        return (
            <Container className='!px-0'>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </Container>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <Container className='!px-0'>
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <H2 className="mb-1">{category.category_name}</H2>
                    <P className="text-gray-500 text-sm">
                        Explore our range of {category.category_name.toLowerCase()} products
                    </P>
                </div>
                <div className="flex gap-2 items-center">
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
                </div>
            </div>

            {/* Products Grid */}
            <div className="mt-7">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
                >
                    {currentProducts.map((product) => (
                        <div key={`${product.id}-${currentPage}`} className="w-full">
                            <ProductCard {...product} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* View All Link */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                    Showing {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, products.length)} of {products.length} products
                </div>
                
                <Link 
                    href={`/products?category=${category.id}`}
                    className="flex items-center gap-2 text-sm text-[#272727] hover:text-orange-600 font-medium transition-colors group"
                >
                    View All {category.category_name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </Container>
    )
}

export default CategoryProductsSection
