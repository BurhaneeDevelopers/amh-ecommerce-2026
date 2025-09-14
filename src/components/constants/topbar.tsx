"use client";

import { Phone, ShoppingCart } from "lucide-react"
import { Container } from "../layout/container"
import { H4, P } from "../typography/typography"
import Image from "next/image"
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
        <Container className="bg-[#272727] text-white text-sm border-b border-gray-600 !py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                {/* Customer Support */}
                <div className="flex items-center gap-2">
                    <div className="bg-[var(--color-primary)] p-4 rounded-full">
                        <Phone className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                        <H4 className="font-semibold">Customer Support</H4>
                        <P>123-456-7890</P>
                    </div>
                </div>

                {/* Logo */}
                <div className="bg-white p-2 w-fit rounded-lg">
                    <Image
                        alt="MSI"
                        src={"/logo.png"}
                        width={500}
                        height={500}
                        className="object-cover w-44 h-14"
                    />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* User/Profile */}
                    <AccountMenu />

                    {/* Wishlist */}
                    <Link href={"/wishlist"}>
                        <div className="flex items-center gap-2 relative">
                            <div className="bg-[var(--color-primary)] p-4 rounded-full relative">
                                <ShoppingCart className="w-6 h-6 fill-white" />
                                {wishlistCount > 0 && (
                                    <Badge 
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs font-bold bg-red-500 hover:bg-red-600 flex items-center justify-center rounded-full px-1"
                                    >
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <H4 className="font-semibold">My Wishlist</H4>
                                <P>{wishlistCount === 0 ? "Empty" : `${wishlistCount} item${wishlistCount > 1 ? 's' : ''}`}</P>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Container>
    )
}