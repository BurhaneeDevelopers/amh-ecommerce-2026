'use client'

import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { useGetMainCategories } from '@/api/category.service'
import { Loader2, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const CategoriesSection = () => {
    const { data: categories = [], isLoading } = useGetMainCategories()

    if (isLoading) {
        return (
            <Container className='!px-0'>
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl p-8 border border-slate-200/60">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
            </Container>
        )
    }

    if (categories.length === 0) {
        return null
    }

    return (
        <Container className='!px-0'>
            {/* Modern Header with Gradient Background */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-yellow-50/30 rounded-2xl p-6 sm:p-8 mb-6 border border-orange-200/40 shadow-sm">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <H2 className="!mb-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                Shop by Category
                            </H2>
                        </div>
                        <p className="text-sm text-gray-600 max-w-xl">
                            Discover our comprehensive range of professional tools and equipment
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="group flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Modern Categories Grid — Main categories only */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.03,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                    >
                        <Link
                            href={`/category/${category.id}`}
                            className="group block h-full"
                        >
                            <div className="relative bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-gray-200/60 hover:border-primary/60 hover:-translate-y-2">
                                {/* Image Container */}
                                <div
                                    className="relative w-full aspect-square overflow-hidden"
                                    style={{ backgroundColor: `${category.color || '#f97316'}12` }}
                                >
                                    {category.image_url ? (
                                        /* Real category image if available */
                                        <>
                                            <Image
                                                src={category.image_url}
                                                alt={category.name}
                                                width={1000}
                                                height={1000}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                                loading="lazy"
                                            />
                                            {/* Gradient Overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </>
                                    ) : (
                                        /* SVG placeholder icon — uses category color as accent */
                                        <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 80 80"
                                                className="w-14 h-14 sm:w-16 sm:h-16 transition-all duration-500 drop-shadow-sm"
                                            >
                                                <rect width="80" height="80" rx="16" fill={`${category.color || '#f97316'}25`} />
                                                <rect x="22" y="28" width="36" height="28" rx="4" fill={category.color || '#f97316'} opacity="0.75" />
                                                <rect x="28" y="22" width="24" height="10" rx="3" fill={category.color || '#f97316'} opacity="0.95" />
                                                <rect x="32" y="38" width="16" height="12" rx="2" fill="white" opacity="0.55" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Shine sweep */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </div>

                                    {/* Arrow badge */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                                            <ArrowRight className="w-3 h-3 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Name */}
                                <div className="relative p-3 sm:p-4 text-center flex-1 flex items-center justify-center min-h-[60px] bg-gradient-to-b from-white to-gray-50/50 group-hover:from-gray-50 group-hover:to-white transition-all duration-500">
                                    <h3 className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                                        {category.name}
                                    </h3>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500" />
                                </div>

                                {/* Glow on hover */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(243,139,0,0.25)]" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </Container>
    )
}

export default CategoriesSection
