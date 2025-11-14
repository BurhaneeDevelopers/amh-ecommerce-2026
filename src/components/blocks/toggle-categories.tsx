"use client"

import React, { useMemo } from "react"
import { LayoutDashboard, Loader2 } from "lucide-react"
import { H6 } from "../typography/typography"
import {
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { ListItem } from "./nav/list-item"
import { useGetAllCategories } from "@/api/category.service"

export default function ToggleCategories() {
    const { data: allCategories = [], isLoading } = useGetAllCategories()

    // Organize categories: main categories with their subcategories
    const organizedCategories = useMemo(() => {
        const mainCategories = allCategories.filter(cat => cat.type === 'main')
        
        return mainCategories.map(mainCat => {
            const subcategories = allCategories
                .filter(cat => cat.type === 'sub' && cat.parent_id === mainCat.id)
                .map(sub => ({
                    id: sub.id || '',
                    name: sub.category_name,
                    href: `/products?category=${sub.slug}`,
                    icon: sub.icon
                }))
            
            return {
                id: mainCat.id || '',
                name: mainCat.category_name,
                href: `/products?category=${mainCat.slug}`,
                icon: mainCat.icon,
                subcategories: subcategories.length > 0 ? subcategories : undefined
            }
        })
    }, [allCategories])

    return (
        <NavigationMenuItem className="min-w-full relative">
            {/* Trigger */}
            <NavigationMenuTrigger className="bg-gradient-to-br from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-7 flex gap-2 justify-between items-center flex-grow lg:!w-80 max-w-80">
                <span className="flex gap-2 items-center">
                    <LayoutDashboard className="!w-7 !h-7" />
                    <H6>All Categories</H6>
                </span>
            </NavigationMenuTrigger>

            {/* Dropdown Content (Mega Menu) */}
            <NavigationMenuContent className="p-6 flex flex-wrap gap-6 min-w-full bg-white text-black shadow-xl rounded-xl z-10">
                {isLoading ? (
                    <div className="w-[94vw] flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : organizedCategories.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-[94vw] z-10 gap-5">
                        {organizedCategories.map((item) => (
                            <ListItem
                                key={item.id}
                                title={item.name}
                                href={item.href}
                                icon={item.icon}
                                subcategories={item.subcategories}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="w-[94vw] flex items-center justify-center py-12 text-gray-500">
                        No categories available
                    </div>
                )}
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}