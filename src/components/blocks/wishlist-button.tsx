"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAtomValue } from "jotai"
import { current_user_auth_atom } from "@/jotai/store"
import AuthModal from "./modal/auth-modal"

const WishlistButton = () => {
    const [isAdded, setIsAdded] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const user = useAtomValue(current_user_auth_atom)

    const handleClick = () => {
        if (!user) {
            setShowAuthModal(true)
            return
        }
        setIsAdded(!isAdded)
    }

    return (
        <>
            <Button
                className={`${isAdded
                    ? "bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]"
                    : "bg-white border border-amber-600 hover:text-white"
                    } text-[#272727] absolute top-3 left-3`}
                onClick={handleClick}
            >
                <Heart
                    className={`!size-6 ${isAdded ? "stroke-white fill-amber-600" : ""}`}
                />
            </Button>

            <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        </>
    )
}

export default WishlistButton