'use client'

import React, { HTMLAttributes, ReactNode } from 'react'
import { Container } from './container'
import LeftColumn from './home/left-columns'
import RightColumn from './home/right-column'
import FloatingButtons from './floating-buttons'

interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <>
            <Container className="flex flex-col lg:grid lg:grid-cols-[1fr_3fr_2fr] xl:grid-cols-[1fr_3.5fr_1.5fr] 2xl:grid-cols-[1fr_3.7fr_1.3fr] gap-6 !px-0 h-full">
                {/* Left sidebar - shown on desktop, mobile version below main content */}
                <aside className="hidden lg:block px-5 border-e border-gray-200">
                    <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {/* Scroll indicator */}
                        <div className="absolute top-0 left-0 right-0 h-8  pointer-events-none z-10" />
                        <LeftColumn />
                        {/* Bottom scroll indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    </div>
                </aside>
                
                {/* Main content */}
                <main className="px-3 sm:px-5 order-1 lg:order-none">
                    {children}
                </main>
                
                {/* Right sidebar - shown on desktop, mobile version below main content */}
                <aside className="hidden lg:block px-5 border-s border-gray-200">
                    <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {/* Scroll indicator */}
                        <div className="absolute top-0 left-0 right-0 h-8  pointer-events-none z-10" />
                        <RightColumn />
                        {/* Bottom scroll indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    </div>
                </aside>
                
                {/* Mobile-only sections - maintain same order as desktop */}
                <div className="lg:hidden px-3 sm:px-5 space-y-6 order-2">
                    {/* Left Column Content for Mobile */}
                    <div className="space-y-6">
                        <LeftColumn />
                    </div>
                    
                    {/* Right Column Content for Mobile */}
                    <div className="space-y-6">
                        <RightColumn />
                    </div>
                </div>
            </Container>
            
            {/* Floating Buttons - WhatsApp and Scroll to Top */}
            <FloatingButtons />
        </>
    )
}