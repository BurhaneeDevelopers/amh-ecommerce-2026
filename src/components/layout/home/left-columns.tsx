import React from 'react'
import CategoryList from '../blocks/category-list'
import ShopNow from '../blocks/shop-now'
import NewsLetter from '../blocks/news-letter'

export default function LeftColumn() {
    return (
        <div className="space-y-6">
            <CategoryList />
            <ShopNow />
            <NewsLetter />
        </div>
    )
}
