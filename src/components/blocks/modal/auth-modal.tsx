"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import AuthForm from "@/components/forms/auth-form"
import Link from "next/link"

interface AuthModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                        Please sign in to add items to your wishlist.
                    </DialogDescription>
                </DialogHeader>
                <AuthForm setAuthModalOpen={onOpenChange} />
                <DialogFooter>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/create-account" onClick={() => onOpenChange(false)} className="underline underline-offset-4">
                            click here
                        </Link>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AuthModal
