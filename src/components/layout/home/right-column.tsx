import React from 'react'
import BestSellerShowcase from '../blocks/best-seller-showcase'
import OffProductBanner from '../blocks/off-product'
import DealOfTheDay from '../blocks/deal-of-the-day'
import HomepageRightBanner from '../blocks/homepage-right-banner'

export default function RightColumn() {
    return (
        <div className="space-y-6">
            <BestSellerShowcase />
            <OffProductBanner />
            <DealOfTheDay />
            <HomepageRightBanner />
        </div>
    )
}
