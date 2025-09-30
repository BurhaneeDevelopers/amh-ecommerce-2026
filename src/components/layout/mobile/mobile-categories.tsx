'use client'

import { categories } from '@/components/constants/globals'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default function MobileCategories() {
    // Get top-level categories for mobile horizontal scroll
    const topCategories = categories.slice(0, 8)

    return (
        <div className="w-full">
            <h3 className="font-semibold text-lg mb-3 px-1">Shop by Category</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {topCategories.map((category) => (
                    <Link
                        key={category.name}
                        href={category.href || '#'}
                        className="flex-shrink-0"
                    >
                        <Card className="px-4 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 transition-all duration-200 border-orange-200 min-w-[120px]">
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                    {category.name}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
