// components/layout/Container.tsx
import React, { ReactNode, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn("px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 xl:px-7 xl:py-7", className)}
            {...props}
        >
            {children}
        </div>
    )
}
