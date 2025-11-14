"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Package } from "lucide-react"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import Image from "next/image"
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
}

export function ListItem({ title, href, icon, subcategories }: ListItemProps) {
    const [open, setOpen] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
    const itemRef = useRef<HTMLLIElement>(null)

    useEffect(() => {
        if (open && itemRef.current) {
            const rect = itemRef.current.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            
            // Calculate position
            let top = rect.top
            let left = rect.right + 8
            
            // Adjust if dropdown would go off-screen vertically
            const dropdownHeight = Math.min(viewportHeight * 0.7, 500)
            if (top + dropdownHeight > viewportHeight) {
                top = Math.max(10, viewportHeight - dropdownHeight - 10)
            }
            
            // Adjust if dropdown would go off-screen horizontally
            const dropdownWidth = 320
            if (left + dropdownWidth > viewportWidth) {
                left = rect.left - dropdownWidth - 8
            }
            
            setDropdownPosition({ top, left })
        }
    }, [open])

    return (
        <li
            ref={itemRef}
            className="relative group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Main Category */}
            <NavigationMenuLink asChild>
                <Link
                    href={href ?? "#"}
                    className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 flex flex-col sm:flex-row items-center justify-between gap-2 relative hover:shadow-lg transition-all duration-300 group h-full"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full">
                        {/* Category Image/Icon */}
                        <div className="relative w-16 h-16 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                            {icon && !imageError ? (
                                <Image
                                    width={80}
                                    height={80}
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
                        <H6 className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors text-center sm:text-left text-sm leading-tight line-clamp-2">
                            {title}
                        </H6>
                    </div>

                    {subcategories && (
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-600 transition-colors flex-shrink-0 hidden sm:block" />
                    )}
                </Link>
            </NavigationMenuLink>

            {/* Sub Dropdown - Fixed positioning */}
            {subcategories && open && (
                <div 
                    className="fixed z-[100] bg-white shadow-2xl rounded-xl p-3 border border-gray-200 w-[320px]"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        maxHeight: '70vh',
                        overflowY: 'auto',
                    }}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
                        Subcategories
                    </div>
                    <div className="space-y-1">
                        {subcategories.map((sub) => (
                            <div key={sub.id}>
                                <Link
                                    href={sub.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-200 group/sub"
                                >
                                    {sub.icon ? (
                                        <Image
                                            width={40}
                                            height={40}
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </li>
    )
}
