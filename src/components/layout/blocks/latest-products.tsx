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
    const [isMounted, setIsMounted] = useState(false)
    
    // Responsive configuration - maximized density for all screen sizes
    const getResponsiveConfig = useCallback(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) return { itemsPerRow: 3, rows: 3 }; // mobile: 3x3 (9 products)
            if (width < 768) return { itemsPerRow: 4, rows: 2 }; // small tablet: 4x2 (8 products)
            if (width < 1024) return { itemsPerRow: 5, rows: 2 }; // tablet: 5x2 (10 products)
            if (width < 1280) return { itemsPerRow: 6, rows: 2 }; // laptop: 6x2 (12 products)
            if (width < 1536) return { itemsPerRow: 7, rows: 2 }; // large laptop: 7x2 (14 products)
            return { itemsPerRow: 7, rows: 2 }; // xl desktop: 7x2 (14 products)
        }
        return { itemsPerRow: 6, rows: 2 };
    }, []);
    
    const [config, setConfig] = useState({ itemsPerRow: 6, rows: 2 });
    
    // Set mounted state and initial config
    useEffect(() => {
        setIsMounted(true);
        setConfig(getResponsiveConfig());
    }, [getResponsiveConfig]);
    
    // Handle window resize with debouncing
    useEffect(() => {
        if (!isMounted) return;
        
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
    }, [getResponsiveConfig, isMounted]);

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
                <H2>Latest Products</H2>
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
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className={`grid gap-1.5 sm:gap-2 md:gap-2.5 ${
                        config.itemsPerRow === 3 ? 'grid-cols-3' :
                        config.itemsPerRow === 4 ? 'grid-cols-4' :
                        config.itemsPerRow === 5 ? 'grid-cols-5' :
                        config.itemsPerRow === 6 ? 'grid-cols-6' :
                        config.itemsPerRow === 7 ? 'grid-cols-7' :
                        'grid-cols-8'
                    }`}
                >
                    {currentProducts.map((product) => (
                        <div
                            key={`${product.id}-${currentPage}`}
                            className="w-full h-fit"
                        >
                            <ProductCard {...product} />
                        </div>
                    ))}
                </motion.div>
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
