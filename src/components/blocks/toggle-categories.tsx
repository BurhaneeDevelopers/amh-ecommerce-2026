"use client"

import React from "react"
import { LayoutDashboard } from "lucide-react"
import { H6 } from "../typography/typography"
import {
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { categories } from "../constants/globals"
import { ListItem } from "./nav/list-item"

export default function ToggleCategories() {
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
                <ul className="grid grid-cols-5 w-[94vw] z-10 gap-5">
                    {categories.map((item, i) => (
                        <ListItem
                            key={i}
                            title={item.name}
                            href={item.href ?? ""}
                            subcategories={item.subcategories}
                        />
                    ))}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}