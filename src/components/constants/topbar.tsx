"use client";

import { Phone, ShoppingCart } from "lucide-react"
import { Container } from "../layout/container"
import { H4, P } from "../typography/typography"
import Link from "next/link"
import AccountMenu from "../layout/blocks/account-menu"
import { Badge } from "@/components/ui/badge"
import { useAtomValue } from "jotai"
import { current_user_auth_atom } from "@/jotai/store"
import { useGetWishlistByUser } from "@/api/wishlist.service"

export default function Topbar() {
    const user = useAtomValue(current_user_auth_atom);
    const { data: wishlistData } = useGetWishlistByUser(user?.id ?? "");
    const wishlistCount = wishlistData?.length || 0;

    return (
        <Container className="bg-white text-[#2d2d2d] text-sm border-b border-[#e0d4f7] !py-2 md:!py-4">
            <div className="flex items-center justify-between gap-2">
                {/* Company Name */}
                <div className="bg-[#ff6b35] p-1.5 md:p-3 w-fit rounded-lg order-2 md:order-2 shadow-md">
                    <h2 className="text-white font-bold text-base md:text-xl px-2">
                        A.M. Hydraulics
                    </h2>
                </div>

                {/* Customer Support - Hidden on mobile, shown on desktop */}
                <div className="hidden md:flex items-center gap-2 order-1">
                    <div className="bg-[#ff6b35] p-3 rounded-full">
                        <Phone className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                        <H4 className="font-semibold text-sm">Customer Support</H4>
                        <P className="text-xs">+91 98843 69751</P>
                        <P className="text-xs">044 42161198</P>
                    </div>
                </div>

                {/* Right Section - Compact on mobile */}
                <div className="flex items-center gap-2 md:gap-6 order-3">
                    {/* User/Profile */}
                    <AccountMenu />

                    {/* Wishlist - Icon only on mobile */}
                    <Link href={"/wishlist"}>
                        <div className="flex items-center gap-2 relative">
                            <div className="bg-[#ff6b35] p-2 md:p-3 rounded-full relative">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                                {wishlistCount > 0 && (
                                    <Badge 
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 hover:bg-red-600 flex items-center justify-center rounded-full px-1"
                                    >
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </Badge>
                                )}
                            </div>
                            <div className="hidden md:block">
                                <H4 className="font-semibold text-sm">My Wishlist</H4>
                                <P className="text-xs">{wishlistCount === 0 ? "Empty" : `${wishlistCount} item${wishlistCount > 1 ? 's' : ''}`}</P>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Container>
    )
}