/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Use_logout } from '@/api/user.service'
import AuthModal from '@/components/blocks/modal/auth-modal'
import { H4, P } from '@/components/typography/typography'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { current_user_auth_atom } from '@/jotai/store'
import { useAtom } from 'jotai'
import { User } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AccountMenu = () => {
    const [user, set_current_user] = useAtom(current_user_auth_atom)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

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
        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
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
                            setShowAuthModal(true)
                            setShowDropdown(false)
                        }}
                    >
                        Login / Register
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>

            <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        </DropdownMenu>
    )
}

export default AccountMenu