/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Use_logout } from '@/api/user.service'
import AuthModal from '@/components/blocks/modal/auth-modal'
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
                <button className="relative bg-white/10 hover:bg-white/20 p-2 md:p-2.5 rounded-md focus:outline-none cursor-pointer transition-colors">
                    <User className="w-5 h-5 md:w-5 md:h-5 text-white" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="px-2">
                    {user ? (
                        <div>
                            <p className="font-semibold text-sm">Hello, {user.full_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                    ) : (
                        <p className="text-sm">Welcome!</p>
                    )}
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