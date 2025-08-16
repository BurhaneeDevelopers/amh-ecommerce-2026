// components/layout/Container.tsx
import React, { ReactNode, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn("px-4 py-5 lg:p-7", className)}
            {...props}
        >
            {children}
        </div>
    )
}
