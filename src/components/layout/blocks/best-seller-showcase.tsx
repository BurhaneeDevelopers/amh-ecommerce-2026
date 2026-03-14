'use client'

import { H5 } from '@/components/typography/typography'
import React from 'react'
import { useGetBestsellerProducts } from '@/api/bestseller.service'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const BestSellerShowcase: React.FC = () => {
    const { data: bestSellers = [], isLoading } = useGetBestsellerProducts(4)

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-white shadow-sm p-1">
                <H5 className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bestseller Products
                </H5>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 items-center animate-pulse">
                            <div className="w-20 h-16 bg-gray-200 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (bestSellers.length === 0) {
        return (
            <div className="rounded-xl border bg-white shadow-sm p-1">
                <H5 className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bestseller Products
                </H5>
                <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">No bestsellers yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-white shadow-sm p-1 hover:shadow-md transition-shadow duration-300">
            <H5 className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Bestseller Products
            </H5>
            <ul className="divide-y divide-gray-100">
                {bestSellers.map((product, index) => (
                    <li key={product.id} className="group">
                        <Link
                            href={`/products/${product.id}`}
                            className="flex gap-4 items-center p-3 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="relative flex-shrink-0">
                                <Image
                                    width={500}
                                    height={500}
                                    src={product.photos?.[0] || 'https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg'}
                                    alt={product.product_name}
                                    className="w-20 h-16 object-contain rounded-lg border border-gray-100 group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute -top-1 -left-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                    {product.product_name}
                                </p>
                                {product.model_number && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        Model: {product.model_number}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BestSellerShowcase
