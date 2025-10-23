'use client'

import { categories } from '@/components/constants/globals'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export default function MobileCategories() {
    // Get top-level categories for mobile horizontal scroll
    const topCategories = categories.slice(0, 8)

    return (
        <div className="w-full">
            <h3 className="font-semibold text-lg mb-3 px-1">Shop by Category</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {topCategories.map((category) => (
                    <div key={category.name} className="flex-shrink-0">
                        {category.subcategories ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full">
                                        <Card className="px-4 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 transition-all duration-200 border-orange-200 min-w-[120px]">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-gray-800 whitespace-nowrap flex items-center justify-center gap-1">
                                                    <span>{category.name}</span>
                                                    <ChevronDown className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </Card>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    side="bottom" 
                                    align="center"
                                    className="w-48 max-h-60 overflow-y-auto shadow-lg bg-white/95 backdrop-blur-sm"
                                    sideOffset={4}
                                >
                                    {category.subcategories.map((sub) => (
                                        <DropdownMenuItem key={sub.name} asChild>
                                            <Link
                                                href={sub.href}
                                                className="w-full cursor-pointer text-sm text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-md px-2 py-1.5 flex items-center"
                                            >
                                                <span className="truncate">{sub.name}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href={category.href || '#'}
                                className="block"
                            >
                                <Card className="px-4 py-3 bg-gradient-to-r from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 transition-all duration-200 border-orange-200 min-w-[120px]">
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                                            {category.name}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
