import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Heart } from 'lucide-react'

const WishlistButton = () => {
    const [isAdded, setIsAdded] = useState(false)
    return (
        <Button className={`${isAdded ? "bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]" : "bg-white border border-amber-600"} text-[#272727] absolute top-3 left-3`} onClick={() => setIsAdded(!isAdded)}>
            <Heart className={`!size-6 ${isAdded ? "stroke-white fill-amber-600" : ""}`} />
        </Button>
    )
}

export default WishlistButton