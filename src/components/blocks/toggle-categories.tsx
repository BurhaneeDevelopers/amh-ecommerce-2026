"use client"

import React, { useMemo, useState } from "react"
import { LayoutDashboard, Loader2 } from "lucide-react"
import { H6 } from "../typography/typography"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ListItem } from "./nav/list-item"
import { useGetAllCategories } from "@/api/category.service"

export default function ToggleCategories() {
    const { data: allCategories = [], isLoading } = useGetAllCategories()
    const [mobileOpen, setMobileOpen] = useState(false)

    // Organize categories: main categories with their subcategories
    const organizedCategories = useMemo(() => {
        const mainCategories = allCategories.filter(cat => cat.type === 'main')
        
        return mainCategories.map(mainCat => {
            const subcategories = allCategories
                .filter(cat => cat.type === 'sub' && cat.parent_id === mainCat.id)
                .map(sub => ({
                    id: sub.id || '',
                    name: sub.category_name,
                    href: `/products?category=${sub.id}`,
                    icon: sub.icon
                }))
            
            return {
                id: mainCat.id || '',
                name: mainCat.category_name,
                href: `/products?category=${mainCat.id}`,
                icon: mainCat.icon,
                subcategories: subcategories.length > 0 ? subcategories : undefined
            }
        })
    }, [allCategories])

    const categoriesContent = isLoading ? (
        <div className="w-full flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    ) : organizedCategories.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-3 md:gap-5">
            {organizedCategories.map((item) => (
                <ListItem
                    key={item.id}
                    title={item.name}
                    href={item.href}
                    icon={item.icon}
                    subcategories={item.subcategories}
                    onClick={() => setMobileOpen(false)}
                />
            ))}
        </ul>
    ) : (
        <div className="w-full flex items-center justify-center py-12 text-gray-500">
            No categories available
        </div>
    )

    return (
        <>
            {/* Desktop: HoverCard with viewport-aware positioning */}
            <div className="hidden md:block">
                <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <Button 
                            className="bg-white/10 hover:bg-white/20 text-white h-10 w-10 flex items-center justify-center p-0 rounded-md transition-all duration-200"
                        >
                            <LayoutDashboard color="#fff" className="!w-5 !h-5" />
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent 
                        className="p-6 bg-gradient-to-br from-white to-gray-50 text-black shadow-2xl rounded-xl border border-gray-200 w-[90vw] max-w-[1200px]"
                        align="end"
                        sideOffset={8}
                        alignOffset={-10}
                        collisionPadding={16}
                        avoidCollisions={true}
                    >
                        <div className="mb-4 pb-3 border-b border-gray-200">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-[#f38b00] to-[#ffed05] bg-clip-text text-transparent">
                                Browse All Categories
                            </h3>
                        </div>
                        {categoriesContent}
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* Mobile: Dialog Button */}
            <div className="md:hidden">
                <Button 
                    onClick={() => setMobileOpen(true)}
                    className="bg-gradient-to-br from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-5 flex gap-2 justify-between items-center w-full"
                >
                    <span className="flex gap-2 items-center">
                        <LayoutDashboard className="!w-5 !h-5" />
                        <H6 className="text-sm">All Categories</H6>
                    </span>
                </Button>

                <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                    <DialogContent className="max-w-[95vw] max-h-[85vh] p-0 gap-0">
                        <DialogHeader className="p-4 pb-3 border-b sticky top-0 bg-white z-10">
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#f38b00] to-[#ffed05] bg-clip-text text-transparent">
                                All Categories
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
                            {categoriesContent}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}