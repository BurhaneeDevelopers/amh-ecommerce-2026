/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Phone, ShoppingCart, User } from "lucide-react"
import { Container } from "../layout/container"
import { H4, P } from "../typography/typography"
import Image from "next/image"
import { useAtom } from "jotai"
import { current_user_auth_atom } from "@/jotai/store"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Use_logout } from "@/api/user.service"
import { toast } from "sonner"
import Link from "next/link"

export default function Topbar() {
    const [user, set_current_user] = useAtom(current_user_auth_atom)

    const { mutateAsync: logout, isPending: is_logging_out } =
        Use_logout();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged Out Successfully");
            set_current_user(null);
        } catch (error: any) {
            toast.error(error.message || "Error logging out");
        }
    };

    return (
        <Container className="bg-[#272727] text-white text-sm border-b border-gray-600">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                                <div className="bg-[var(--color-primary)] p-4 rounded-full">
                                    <User className="w-6 h-6 fill-white" />
                                </div>
                                {user ? (
                                    <div className="text-left">
                                        <H4 className="font-semibold">Hello</H4>
                                        <P>{user.full_name}</P>
                                    </div>
                                ) : (
                                    <div className="text-left">
                                        <H4 className="font-semibold">My Account</H4>
                                        <P>Register</P>
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-fit">
                            <DropdownMenuLabel className="px-2">
                                {user ? `${user.email}` : "Welcome!"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user ? (
                                <>
                                    <DropdownMenuItem disabled={is_logging_out} onClick={handleLogout}>
                                        Logout
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem
                                    onClick={() => {
                                        // redirect to login page
                                        console.log("Go to login page")
                                    }}
                                >
                                    Login / Register
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Cart */}
                    <Link href={"/wishlist"}>
                        <div className="flex items-center gap-2">
                            <div className="bg-[var(--color-primary)] p-4 rounded-full">
                                <ShoppingCart className="w-6 h-6 fill-white" />
                            </div>
                            <div>
                                <H4 className="font-semibold">My Wishlist</H4>
                                <P>Empty</P>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Container>
    )
}