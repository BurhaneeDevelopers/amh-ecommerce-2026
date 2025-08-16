'use client'

import { useState } from 'react'
import { categories } from '@/components/constants/globals'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toggleAllCategoriesAtom } from '@/jotai/store'
import { useAtomValue } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'

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

                                <Accordion type="multiple" className="w-full space-y-1">
                                    {visibleCategories.map((cat) => (
                                        <AccordionItem value={cat.name} key={cat.name} className="border-none">
                                            {cat.subcategories ? (
                                                <>
                                                    <AccordionTrigger className="text-sm font-medium text-gray-800 hover:text-primary px-3 py-2 rounded-lg hover:bg-muted transition-all">
                                                        {cat.name}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pl-5 mt-1 space-y-1">
                                                        {cat.subcategories.map((sub) => (
                                                            <Link
                                                                key={sub.name}
                                                                href={sub.href}
                                                                className="block text-sm text-muted-foreground hover:text-primary hover:underline transition"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </AccordionContent>
                                                </>
                                            ) : cat.href ? (
                                                <Link
                                                    href={cat.href}
                                                    className={cn(
                                                        'block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition'
                                                    )}
                                                >
                                                    {cat.name}
                                                </Link>
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-muted-foreground">{cat.name}</div>
                                            )}
                                        </AccordionItem>
                                    ))}
                                </Accordion>

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
