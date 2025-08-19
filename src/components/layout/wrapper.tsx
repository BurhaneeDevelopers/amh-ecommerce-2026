'use client'

import React, { HTMLAttributes, ReactNode } from 'react'
import { Container } from './container'
import LeftColumn from './home/left-columns'
import RightColumn from './home/right-column'

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}


export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <Container className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_2fr] xl:lg:grid-cols-[1fr_3.5fr_1.5fr] 2xl:lg:grid-cols-[1fr_3.7fr_1.3fr] -6 gap-6 !px-0 h-full">
            <aside className="px-5 border-e border-gray-200">
                <LeftColumn />
            </aside>
            <main className="px-5">
                {children}
            </main>
            <aside className="px-5 border-s border-gray-200">
                <RightColumn />
            </aside>
        </Container>
    )
}