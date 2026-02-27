"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronRight, Package, ChevronDown } from "lucide-react"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import { H6 } from "@/components/typography/typography"

interface SubCategory {
    id: string
    name: string
    href: string
    icon?: string | null
}

interface ListItemProps {
    title: string
    href?: string
    icon?: string | null
    subcategories?: SubCategory[]
    onClick?: () => void
}

export function ListItem({ title, href, icon, subcategories, onClick }: ListItemProps) {
    const [imageError, setImageError] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const categoryContent = (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
            {/* Category Image/Icon */}
            <div className="relative w-16 h-16 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                {icon && !imageError ? (
                    <img
                        src={icon}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                        <Package className="w-8 h-8 text-orange-600" />
                    </div>
                )}
            </div>
            
            {/* Category Name */}
            <H6 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors text-center sm:text-left text-sm leading-tight line-clamp-2 flex-1">
                {title}
            </H6>
            
            {/* Indicator for subcategories */}
            {subcategories && subcategories.length > 0 && (
                <div className="flex items-center gap-1">
                    <span className="text-xs text-orange-600 font-medium hidden sm:inline">
                        {subcategories.length}
                    </span>
                    <ChevronRight className="w-4 h-4 text-orange-600 transition-colors flex-shrink-0 hidden md:block" />
                    <ChevronDown className="w-4 h-4 text-orange-600 transition-colors flex-shrink-0 md:hidden" />
                </div>
            )}
        </div>
    )

    // If no subcategories, render simple link
    if (!subcategories || subcategories.length === 0) {
        return (
            <li className="relative group">
                <NavigationMenuLink asChild>
                    <Link
                        href={href ?? "#"}
                        onClick={onClick}
                        className="p-3 sm:p-4 rounded-xl border-2 border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 flex items-center justify-between gap-2 hover:shadow-lg transition-all duration-300 group h-full"
                    >
                        {categoryContent}
                    </Link>
                </NavigationMenuLink>
            </li>
        )
    }

    // Desktop: HoverCard with hover
    return (
        <>
            {/* Desktop version with HoverCard */}
            <li className="hidden md:block relative group">
                <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <div className="p-3 sm:p-4 rounded-xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 flex items-center justify-between gap-2 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                            {categoryContent}
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent 
                        side="right" 
                        align="start"
                        className="w-80 p-3 max-h-[400px] overflow-y-auto"
                        sideOffset={8}
                    >
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b">
                            {title} - Subcategories
                        </div>
                        <div className="space-y-1">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.href}
                                    onClick={onClick}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 group/sub"
                                >
                                    {sub.icon ? (
                                        <img
                                            src={sub.icon}
                                            alt={sub.name}
                                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
                                            <Package className="w-5 h-5 text-orange-600" />
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 group-hover/sub:text-orange-700 font-medium leading-tight">
                                        {sub.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </li>

            {/* Mobile version with Popover dropdown */}
            <li className="md:hidden relative">
                <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
                    <PopoverTrigger asChild>
                        <div className="p-3 rounded-xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 active:from-orange-100 active:to-yellow-100 flex items-center justify-between gap-2 transition-all duration-300 cursor-pointer">
                            {categoryContent}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent 
                        side="bottom" 
                        align="start"
                        className="w-[calc(100vw-2rem)] max-w-sm p-3 max-h-[60vh] overflow-y-auto"
                        sideOffset={4}
                    >
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b sticky top-0 bg-white z-10">
                            {title} - Subcategories ({subcategories.length})
                        </div>
                        <div className="space-y-2">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.href}
                                    onClick={() => {
                                        setMobileOpen(false)
                                        onClick?.()
                                    }}
                                    className="flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-all duration-200 border border-orange-200"
                                >
                                    {sub.icon ? (
                                        <img
                                            src={sub.icon}
                                            alt={sub.name}
                                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
                                            <Package className="w-5 h-5 text-orange-600" />
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 font-medium leading-tight">
                                        {sub.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </li>
        </>
    )
}
