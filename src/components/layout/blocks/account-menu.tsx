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
                    className="group flex items-center gap-2.5 px-4 rounded-2xl 
                             border border-slate-200 hover:border-[#ff6b35]/30
                             hover:bg-slate-50 transition-all duration-300 h-12"
                >
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-[#ff6b35]/10 group-hover:text-[#ff6b35] transition-all duration-300">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-0.5">Hello,</p>
                        <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-[#ff6b35] transition-colors duration-300">
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
                        className="px-3 py-2.5 rounded-lg cursor-pointer bg-gradient-to-r from-[#ff6b35] to-[#8b5cf6] 
                                 text-white font-bold hover:from-[#e55a25] hover:to-[#7c3aed]"
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