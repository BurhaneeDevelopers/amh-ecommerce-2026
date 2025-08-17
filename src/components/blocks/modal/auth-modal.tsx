"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import AuthForm from "@/components/forms/auth-form"

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
                <AuthForm setAuthModalOpen={onOpenChange}  />
            </DialogContent>
        </Dialog>
    )
}

export default AuthModal
