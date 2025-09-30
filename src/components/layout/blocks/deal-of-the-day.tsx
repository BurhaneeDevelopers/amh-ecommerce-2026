'use client'

// import WishlistButton from '@/components/blocks/wishlist-button'
import { H3, H5, P } from '@/components/typography/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const DealOfTheDay: React.FC = () => {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-1">
            <H5 className="bg-gradient-to-br  from-[#272727] to-[#272727]/50  text-white font-semibold px-4 py-2 rounded-lg text-center decoration-double underline uppercase">
                Dealer&apos;s Choice
            </H5>
            <div className="flex flex-col justify-center items-center relative">
                <Image
                    width={500}
                    height={500}
                    src={"https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"}
                    alt={""}
                    className="w-64 h-full object-cover !rounded-lg"
                />
                <Badge className='bg-[var(--color-primary)] absolute top-3 right-3'>
                    SALE
                </Badge>
                {/* <WishlistButton /> */}
                <div className='flex flex-col gap-1'>
                    <H3 className="font-medium text-center">Drilling Machine</H3>
                    <P className="text-sm text-gray-500 text-center">Model: N1857</P>
                </div>


                <div className="p-2 w-full pb-4">
                    <Button className='bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80 w-full'>
                        <P>
                            Shop Now
                        </P>
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default DealOfTheDay
