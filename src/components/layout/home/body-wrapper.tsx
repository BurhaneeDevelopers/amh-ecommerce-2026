'use client'

import React from 'react'
import LeftColumn from './left-columns'
import MainColumn from './main-column'
import RightColumn from './right-column'
import { Container } from '../container'

export default function ThreeColumnLayout() {
    return (
        <Container className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_2fr] xl:lg:grid-cols-[1fr_3.5fr_1.5fr] 2xl:lg:grid-cols-[1fr_3.7fr_1.3fr] -6 gap-6 !px-0 h-full">
            <aside className="px-5 border-e border-gray-400">
                <LeftColumn />
            </aside>
            <main className="px-5">
                <MainColumn />
            </main>
            <aside className="px-5 border-s border-gray-400">
                <RightColumn />
            </aside>
        </Container>
    )
}