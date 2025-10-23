'use client'

import { useState } from 'react'
import { categories } from '@/components/constants/globals'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toggleAllCategoriesAtom } from '@/jotai/store'
import { useAtomValue } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight } from 'lucide-react'

export default function CategoryBox() {
    const [showAll, setShowAll] = useState(false)
    const visibleCategories = showAll ? categories : categories.slice(0, 7)
    const toggleAllCategories = useAtomValue(toggleAllCategoriesAtom)

    return (
        <AnimatePresence>
            {toggleAllCategories && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                >
                    <Card className="w-full max-w-xs rounded-2xl bg-gradient-to-bl from-[#f38b00] to-[#ffeD05] shadow-md p-1 transition-transform duration-500 ease-linear">
                        <div className="rounded-xl bg-white">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-3">Categories</h3>

                                <div className="w-full space-y-1">
                                    {visibleCategories.map((cat) => (
                                        <div key={cat.name} className="relative">
                                            {cat.subcategories ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="w-full flex items-center justify-between text-sm font-medium text-gray-800 hover:text-primary px-3 py-2 rounded-lg hover:bg-muted transition-all group">
                                                            <span>{cat.name}</span>
                                                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent 
                                                        side="right" 
                                                        align="start"
                                                        className="w-56 max-h-80 overflow-y-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm"
                                                        sideOffset={8}
                                                        alignOffset={-4}
                                                    >
                                                        {cat.subcategories.map((sub) => (
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
                                            ) : cat.href ? (
                                                <Link
                                                    href={cat.href}
                                                    className={cn(
                                                        'block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all'
                                                    )}
                                                >
                                                    {cat.name}
                                                </Link>
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-muted-foreground">{cat.name}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {categories.length > 6 && (
                                    <div className="mt-3 flex justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowAll(!showAll)}
                                            className="text-primary hover:underline"
                                        >
                                            {showAll ? 'Show Less' : 'Show More'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
