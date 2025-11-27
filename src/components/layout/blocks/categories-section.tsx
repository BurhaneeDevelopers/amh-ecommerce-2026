'use client'

import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { useGetAllMainCategories } from '@/api/category.service'
import { Loader2, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const CategoriesSection = () => {
    const { data: categories = [], isLoading } = useGetAllMainCategories()

    if (isLoading) {
        return (
            <Container className='!px-0'>
                <H2>Shop by Category</H2>
                <div className="mt-7 flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Container>
        )
    }

    if (categories.length === 0) {
        return null
    }

    return (
        <Container className='!px-0'>
            {/* Header */}
            <div className="flex justify-between items-center">
                <H2>Shop by Category</H2>
                <Link 
                    href="/products" 
                    className="text-sm text-[#272727] hover:underline font-medium hidden sm:block"
                >
                    View All Products →
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="mt-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.3, 
                                delay: index * 0.05,
                                ease: [0.25, 0.1, 0.25, 1]
                            }}
                        >
                            <Link 
                                href={`/products?category=${category.id}`}
                                className="group block h-full"
                            >
                                <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-orange-300 hover:-translate-y-1 h-full flex flex-col">
                                    {/* Image Container */}
                                    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                        {category.icon ? (
                                            <Image
                                                src={category.icon}
                                                alt={category.category_name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-300 group-hover:text-orange-400 transition-colors duration-300" />
                                            </div>
                                        )}
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Category Name */}
                                    <div className="p-3 text-center flex-1 flex items-center justify-center min-h-[60px]">
                                        <h3 className="font-semibold text-sm md:text-base text-gray-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                                            {category.category_name}
                                        </h3>
                                    </div>

                                    {/* Hover Effect Border */}
                                    <div className="absolute inset-0 border-2 border-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mobile View All Link */}
            <div className="mt-6 text-center sm:hidden">
                <Link 
                    href="/products" 
                    className="text-sm text-[#272727] hover:underline font-medium"
                >
                    View All Products →
                </Link>
            </div>
        </Container>
    )
}

export default CategoriesSection
