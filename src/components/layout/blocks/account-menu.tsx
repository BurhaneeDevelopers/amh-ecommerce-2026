/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Use_logout } from '@/api/user.service'
import AuthModal from '@/components/blocks/modal/auth-modal'
import { Button } from '@/components/ui/button'
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
                <Button
                    variant="ghost"
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl 
                             hover:bg-gradient-to-br hover:from-[#f38b00]/10 hover:to-[#ffed05]/10 
                             transition-all duration-300 border-2 border-transparent hover:border-[#f38b00]/20"
                >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50">
                        <User className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-xs text-gray-500 font-medium">Hello,</p>
                        <p className="text-sm font-bold text-gray-900">
                            {user ? user.full_name?.split(' ')[0] : 'Sign In'}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-xl shadow-xl border-2" align="end">
                <DropdownMenuLabel className="px-3 py-2">
                    {user ? (
                        <div className="space-y-1">
                            <p className="font-bold text-base text-gray-900">Hello, {user.full_name}</p>
                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-bold text-base text-gray-900">Welcome!</p>
                            <p className="text-xs text-gray-500">Sign in to access your account</p>
                        </div>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                {user ? (
                    <>
                        <DropdownMenuItem 
                            disabled={is_logging_out} 
                            onClick={handleLogout}
                            className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600 font-medium"
                        >
                            {is_logging_out ? 'Logging out...' : 'Logout'}
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem
                        onClick={() => {
                            setShowAuthModal(true)
                            setShowDropdown(false)
                        }}
                        className="px-3 py-2.5 rounded-lg cursor-pointer bg-gradient-to-r from-[#f38b00] to-[#ffed05] 
                                 text-white font-bold hover:from-[#e07a00] hover:to-[#ffd700]"
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