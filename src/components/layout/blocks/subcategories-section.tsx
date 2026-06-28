'use client'

import { H2 } from '@/components/typography/typography'
import { Container } from '../container'
import { useGetFirstLevelSubcategories } from '@/api/category.service'
import { Loader2, ArrowRight, Layers } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

const SubcategoriesSection = () => {
    const { data: subcategories = [], isLoading } = useGetFirstLevelSubcategories()

    if (isLoading) {
        return (
            <Container className='!px-0'>
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50/30 rounded-2xl p-8 border border-slate-200/60">
                    {/* Loading skeleton */}
                    <div className="space-y-6">
                        <div className="h-20 bg-gray-200 animate-pulse rounded-2xl" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 min-h-[350px]">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="aspect-square bg-gray-200 animate-pulse rounded-2xl" style={{ minHeight: '130px' }} />
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    if (subcategories.length === 0) {
        return null
    }

    return (
        <Container className='!px-0'>
            {/* Modern Header with Gradient Background */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 rounded-2xl p-6 sm:p-8 mb-6 border border-purple-200/40 shadow-sm">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl -z-0" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-600" />
                            <H2 className="!mb-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                Browse by Brand & Type
                            </H2>
                        </div>
                        <p className="text-sm text-gray-600 max-w-xl">
                            Explore hydraulic product types, compatible fittings, and trusted industrial brands available from our Chennai stock.
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="group flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        View All Categories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 min-h-[350px]">
                {subcategories.map((subcategory, index) => {
                    const parent = Array.isArray(subcategory.parent) 
                        ? subcategory.parent[0] 
                        : subcategory.parent;

                    return (
                        <motion.div
                            key={subcategory.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.03,
                                ease: [0.34, 1.56, 0.64, 1]
                            }}
                        >
                            <Link
                                href={`/category/${subcategory.slug || subcategory.id}`}
                                className="group block h-full"
                            >
                                <div className="relative bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-gray-200/60 hover:border-purple-400/60 hover:-translate-y-2">
                                    {/* Image Container */}
                                    <div
                                        className="relative w-full aspect-square overflow-hidden"
                                        style={{ 
                                            backgroundColor: `${subcategory.color || '#9333ea'}12`,
                                            minHeight: '130px'
                                        }}
                                    >
                                        {subcategory.image_url ? (
                                            <>
                                                <Image
                                                    src={subcategory.image_url}
                                                    alt={subcategory.name}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    loading={index < 6 ? "eager" : "lazy"}
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 80 80"
                                                    className="w-12 h-12 sm:w-14 sm:h-14 transition-all duration-500 drop-shadow-sm"
                                                >
                                                    <rect width="80" height="80" rx="16" fill={`${subcategory.color || '#9333ea'}20`} />
                                                    <rect x="22" y="28" width="36" height="28" rx="4" fill={subcategory.color || '#9333ea'} opacity="0.7" />
                                                    <rect x="28" y="22" width="24" height="10" rx="3" fill={subcategory.color || '#9333ea'} opacity="0.9" />
                                                    <rect x="32" y="38" width="16" height="12" rx="2" fill="white" opacity="0.5" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </div>

                                        {/* Arrow badge */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <div className="bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                                                <ArrowRight className="w-3 h-3 text-purple-600" />
                                            </div>
                                        </div>

                                        {/* Parent category badge */}
                                        {parent && (
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                                                    <p className="text-[9px] sm:text-[10px] text-white/90 font-medium truncate">
                                                        {parent.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subcategory Name */}
                                    <div className="relative p-3 sm:p-3.5 text-center flex-1 flex items-center justify-center min-h-[52px] bg-gradient-to-b from-white to-gray-50/50 group-hover:from-purple-50/30 group-hover:to-white transition-all duration-500">
                                        <h3 className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                            {subcategory.name}
                                        </h3>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent transition-all duration-500" />
                                    </div>

                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.25)]" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </Container>
    )
}

export default SubcategoriesSection
