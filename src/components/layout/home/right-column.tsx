import React from 'react'
import BestSellerShowcase from '../blocks/best-seller-showcase'
import OffProductBanner from '../blocks/off-product'
import FeaturedDeal from '../blocks/featured-deal'
import HomepageRightBanner from '../blocks/homepage-right-banner'
import HomepageRightBanner2 from '../blocks/homepage-right-banner-2'

export default function RightColumn() {
    return (
        <div className="space-y-6">
            <BestSellerShowcase />
            <HomepageRightBanner />
            <OffProductBanner />
            <FeaturedDeal />
            <HomepageRightBanner2 />
        </div>
    )
}
