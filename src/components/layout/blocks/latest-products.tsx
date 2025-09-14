'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import ProductCard from '@/components/blocks/product-card'
import { sampleProducts } from '@/components/constants/globals'
import { toast } from 'sonner'
import { useGetAllProducts } from '@/api/products.service'

const LatestProducts = () => {
    const {
        data: products = [],
        // isLoading: products_loading,
        error: products_error,
    } = useGetAllProducts();

    if (products_error) toast.error("Error fetching products");
    const [startIndex, setStartIndex] = useState(0)
    const itemsPerRow = 4
    const totalVisible = itemsPerRow * 2 // two rows

    const handleNext = () => {
        if (startIndex < sampleProducts.length - 1) {
            setStartIndex(prev => Math.min(prev + 1, sampleProducts.length - 1))
        }
    }

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(prev => Math.max(prev - 1, 0))
        }
    }

    // Slice products for current view
    // const visibleProducts = sampleProducts.slice(startIndex, startIndex + totalVisible)

    // Split into two rows
    const firstRow = products.slice(0, itemsPerRow)
    const secondRow = products.slice(itemsPerRow, totalVisible)

    return (
        <Container className='!px-0'>
            {/* Header */}
            <div className="flex justify-between items-center">
                <H2>Latest Products</H2>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handlePrev}
                        className="bg-[#272727] p-2 rounded-full disabled:opacity-30"
                        disabled={startIndex === 0}
                    >
                        <ChevronLeft color='#fff' size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-[#272727] p-2 rounded-full disabled:opacity-30"
                        disabled={startIndex >= sampleProducts.length - totalVisible}
                    >
                        <ChevronRight color='#fff' size={24} />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="mt-7 space-y-4">
                {[firstRow, secondRow].map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-4">
                        <AnimatePresence initial={false}>
                            {row.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 50 * (rowIndex % 2 === 0 ? 1 : -1) }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 * (rowIndex % 2 === 0 ? 1 : -1) }}
                                    transition={{
                                        duration: 0.5,
                                        delay: idx * 0.07, // stagger effect
                                        ease: 'easeOut'
                                    }}
                                    className="flex-1"
                                >
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Indicator */}
            <div className="text-center mt-4 text-sm text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + totalVisible, sampleProducts.length)} of {sampleProducts.length}
            </div>
        </Container>
    )
}

export default LatestProducts
