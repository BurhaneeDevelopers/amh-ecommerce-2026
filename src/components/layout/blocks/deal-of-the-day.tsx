'use client'

// import WishlistButton from '@/components/blocks/wishlist-button'
import { H3, H5, P } from '@/components/typography/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useGetTopAdByPlacement } from '@/api/ads.service'

const DealOfTheDay: React.FC = () => {
    const { data: ad } = useGetTopAdByPlacement('deal_of_the_day')

    const imageSrc = ad?.media_url || "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
    const title = ad?.title || "Drilling Machine"
    const subtitle = ad?.description || "Model: N1857"
    const clickUrl = ad?.click_url || "#"

    return (
        <div className="rounded-xl border bg-white shadow-sm p-1">
            <H5 className="bg-gradient-to-br  from-[#272727] to-[#272727]/50  text-white font-semibold px-4 py-2 rounded-lg text-center decoration-double underline uppercase">
                Dealer&apos;s Choice
            </H5>
            <div className="flex flex-col justify-center items-center relative">
                <img
                    src={imageSrc}
                    alt={title}
                    className="w-64 h-full object-cover !rounded-lg"
                />
                <Badge className='bg-[var(--color-primary)] absolute top-3 right-3'>
                    SALE
                </Badge>
                {/* <WishlistButton /> */}
                <div className='flex flex-col gap-1'>
                    <H3 className="font-medium text-center">{title}</H3>
                    <P className="text-sm text-gray-500 text-center">{subtitle}</P>
                </div>

                <div className="p-2 w-full pb-4">
                    <a href={clickUrl} target="_blank" rel="noopener noreferrer">
                        <Button className='bg-gradient-to-r from-primary to-secondary font-bold text-gray-900 hover:opacity-90 w-full'>
                            <P>
                                Shop Now
                            </P>
                        </Button>
                    </a>
                </div>
            </div>
        </div >
    )
}

export default DealOfTheDay
