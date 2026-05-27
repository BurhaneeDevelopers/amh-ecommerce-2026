import React from 'react'
import BannerSlider from '../blocks/banner-slider'
import LatestProducts from '../blocks/latest-products'
import CategoriesSection from '../blocks/categories-section'
import FeaturedCategoriesProducts from '../blocks/featured-categories-products'
import TestimonialsSection from '../blocks/testimonials-section'
import BlogsSection from '../blocks/blogs-section'
import GoogleReviewsSection from '../blocks/google-reviews-section'
import LinkedInPostsSection from '../blocks/linkedin-posts-section'
import { Container } from '../container'


export default function MainColumn() {
    return (
        <div className="w-full">
            {/* Banner slider with padding */}
            <BannerSlider />
            
            <Container >
                {/* Content sections with container */}
                <LatestProducts />
                <CategoriesSection />
                <FeaturedCategoriesProducts />
                <TestimonialsSection />
                <BlogsSection />
            </Container>

            {/* LinkedIn Posts Section */}
            <LinkedInPostsSection />

            {/* Google Reviews Section at the very bottom of the page */}
            <GoogleReviewsSection />
        </div>
    )
}

