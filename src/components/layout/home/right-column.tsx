import React from 'react'
import BestSellerShowcase from '../blocks/best-seller-showcase'
import OffProductBanner from '../blocks/off-product'
import DealOfTheDay from '../blocks/deal-of-the-day'

export default function RightColumn() {
    return (
        <div className="space-y-6">
            <BestSellerShowcase />
            <OffProductBanner />
            <DealOfTheDay />
            <OffProductBanner />
        </div>
    )
}
