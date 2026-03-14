'use client'

import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { useGetAllMainCategories } from '@/api/category.service'
import { Loader2, Package, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const CategoriesSection = () => {
    const { data: categories = [], isLoading } = useGetAllMainCategories()

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

            {/* Modern Categories Grid */}
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
                                {/* Image Container with Modern Overlay */}
                                <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                    {category.icon ? (
                                        <>
                                            <Image
                                                width={500}
                                                height={500}
                                                src={category.icon}
                                                alt={category.category_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            {/* Modern Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Animated Shine Effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500" />
                                                <Package className="relative w-12 h-12 sm:w-14 sm:h-14 text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Floating Badge */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-lg">
                                            <ArrowRight className="w-3 h-3 text-primary" />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Name with Modern Typography */}
                                <div className="relative p-3 sm:p-4 text-center flex-1 flex items-center justify-center min-h-[60px] bg-gradient-to-b from-white to-gray-50/50 group-hover:from-gray-50 group-hover:to-white transition-all duration-500">
                                    <h3 className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                                        {category.category_name}
                                    </h3>

                                    {/* Bottom Accent Line */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500" />
                                </div>

                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(243,139,0,0.3)]" />
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
