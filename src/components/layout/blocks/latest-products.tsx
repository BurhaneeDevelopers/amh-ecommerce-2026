'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import ProductCard from '@/components/blocks/product-card'
import { toast } from 'sonner'
import { useGetAllProducts } from '@/api/products.service'

const LatestProducts = () => {
    const {
        data: products = [],
        error: products_error,
    } = useGetAllProducts();

    if (products_error) toast.error("Error fetching products");
    
    const [currentPage, setCurrentPage] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    
    // Responsive configuration - improved for better laptop experience
    const getResponsiveConfig = useCallback(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) return { itemsPerRow: 1, rows: 2 }; // mobile: 1x2 for better card size
            if (width < 768) return { itemsPerRow: 2, rows: 2 }; // tablet: 2x2  
            if (width < 1024) return { itemsPerRow: 2, rows: 2 }; // small laptop: 2x2 to prevent compression
            if (width < 1280) return { itemsPerRow: 3, rows: 2 }; // medium laptop: 3x2
            if (width < 1536) return { itemsPerRow: 4, rows: 2 }; // large laptop: 4x2
            return { itemsPerRow: 4, rows: 2 }; // xl desktop: 4x2
        }
        return { itemsPerRow: 4, rows: 2 };
    }, []);
    
    const [config, setConfig] = useState(getResponsiveConfig());
    
    // Handle window resize with debouncing
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setConfig(getResponsiveConfig());
                setCurrentPage(0); // Reset to first page on resize
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [getResponsiveConfig]);

    // Limit products for "Latest Products" section (typically 12-16 products max)
    const maxProducts = 16; // Show max 16 latest products
    const limitedProducts = useMemo(() => {
        return products.slice(0, maxProducts);
    }, [products]);

    // Calculate pagination based on limited products
    const itemsPerPage = config.itemsPerRow * config.rows;
    const totalPages = Math.ceil(limitedProducts.length / itemsPerPage);
    const canGoNext = currentPage < totalPages - 1;
    const canGoPrev = currentPage > 0;

    // Get current page products from limited set
    const currentProducts = useMemo(() => {
        const startIdx = currentPage * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        return limitedProducts.slice(startIdx, endIdx);
    }, [limitedProducts, currentPage, itemsPerPage]);

    // Navigation handlers with animation lock
    const handleNext = useCallback(() => {
        if (canGoNext && !isAnimating) {
            setIsAnimating(true);
            setCurrentPage(prev => prev + 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [canGoNext, isAnimating]);

    const handlePrev = useCallback(() => {
        if (canGoPrev && !isAnimating) {
            setIsAnimating(true);
            setCurrentPage(prev => prev - 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [canGoPrev, isAnimating]);

    return (
        <Container className='!px-0'>
            {/* Header */}
            <div className="flex justify-between items-center">
                <H2>Featured Products</H2>
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

            {/* Optimized Product Grid */}
            <div className="mt-7">
                {/* Fixed height container to prevent layout shifts */}
                <div 
                    className="relative overflow-hidden"
                    style={{ 
                        minHeight: config.rows === 1 ? '300px' : config.itemsPerRow === 1 ? '600px' : '640px' // Responsive heights based on layout
                    }}
                >
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className={`grid gap-3 sm:gap-4 ${
                            config.itemsPerRow === 1 ? 'grid-cols-1' :
                            config.itemsPerRow === 2 ? 'grid-cols-2' :
                            config.itemsPerRow === 3 ? 'grid-cols-3' :
                            'grid-cols-4'
                        } ${
                            config.rows === 2 ? 'grid-rows-2' : 'grid-rows-1'
                        }`}
                    >
                        {currentProducts.map((product) => (
                            <div
                                key={`${product.id}-${currentPage}`}
                                className="w-full h-fit pb-10"
                            >
                                <ProductCard {...product} />
                            </div>
                        ))}
                        
                        {/* Fill empty slots to maintain grid structure */}
                        {Array.from({ length: itemsPerPage - currentProducts.length }).map((_, index) => (
                            <div key={`empty-${index}`} className="w-full h-fit opacity-0 pointer-events-none">
                                {/* Invisible placeholder to maintain grid */}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Pagination Indicator */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                    Showing {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, limitedProducts.length)} of {limitedProducts.length} latest products
                </div>
                
                {/* Page dots - limit to max 5 dots for better UX */}
                <div className="flex items-center gap-4">
                    {totalPages > 1 && totalPages <= 5 && (
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (!isAnimating) {
                                            setIsAnimating(true);
                                            setCurrentPage(index);
                                            setTimeout(() => setIsAnimating(false), 300);
                                        }
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentPage 
                                            ? 'bg-[#272727] w-6' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    disabled={isAnimating}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* View All Products link */}
                    <Link 
                        href="/products" 
                        className="text-sm text-[#272727] hover:underline font-medium"
                    >
                        View All Products →
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default LatestProducts
