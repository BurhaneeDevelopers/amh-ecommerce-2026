"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import Image from "next/image"
import { H6 } from "@/components/typography/typography"

interface SubCategory {
    name: string
    href: string
}

interface ListItemProps {
    title: string
    href?: string
    subcategories?: SubCategory[]
}

export function ListItem({ title, href, subcategories }: ListItemProps) {
    const [open, setOpen] = useState(false)

    return (
        <li
            className="relative group"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Main Category */}
            <NavigationMenuLink asChild>
                <Link
                    href={href ?? "#"}
                    className="p-4 rounded-xl border border-gray-300 bg-primary/5 flex flex-row items-center justify-between gap-2 relative hover:bg-primary hover:text-white hover:shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        <Image
                            width={500}
                            height={500}
                            src="https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg"
                            alt={title}
                            className="w-20 h-16 object-cover rounded-lg"
                        />
                        <H6 className="font-medium">{title}</H6>
                    </div>

                    {subcategories && (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                </Link>
            </NavigationMenuLink>

            {/* Sub Dropdown */}
            {subcategories && open && (
                <ul className="absolute top-0 left-full ml-2 min-w-[220px] bg-white shadow-lg rounded-lg p-2 !z-50">
                    {subcategories.map((sub, idx) => (
                        <li key={idx}>
                            <Link
                                href={sub.href}
                                className="block px-4 py-2 rounded-md hover:bg-gray-100"
                            >
                                {sub.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}
