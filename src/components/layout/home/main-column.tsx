import React from 'react'
import BannerSlider from '../blocks/banner-slider'
import LatestProducts from '../blocks/latest-products'
import TestimonialsSection from '../blocks/testimonials-section'
import BlogsSection from '../blocks/blogs-section'


export default function MainColumn() {
    return (
        <div>
            {/* <ProductGrid /> */}
            <BannerSlider />
            <LatestProducts />
            <TestimonialsSection />
            <BlogsSection />
        </div>
    )
}
