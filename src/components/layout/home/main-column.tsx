import React from 'react'
import ProductGrid from '../blocks/product-grid'
import BannerSlider from '../blocks/banner-slider'
import LatestProducts from '../blocks/latest-products'


export default function MainColumn() {
    return (
        <div>
            {/* <ProductGrid /> */}
            <BannerSlider />
            <LatestProducts />
        </div>
    )
}
