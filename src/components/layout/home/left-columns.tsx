import React from 'react'
import CategoryList from '../blocks/category-list'
import ShopNowBanner from '../blocks/shop-now-banner'
import NewsLetter from '../blocks/news-letter'

export default function LeftColumn() {
    return (
        <div className="space-y-6">
            <CategoryList />
            <ShopNowBanner />
            <NewsLetter />
        </div>
    )
}
