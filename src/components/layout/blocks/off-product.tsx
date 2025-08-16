import { H3, H5, } from '@/components/typography/typography'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const OffProductBanner = () => {
    return (
        <div className='relative rounded-3xl overflow-hidden'>
            <Image alt='Shop Now' width={500} height={500} src={"https://images.pexels.com/photos/4889065/pexels-photo-4889065.jpeg"} className='w-full object-cover shadow-xl h-[32rem] object-center' />
            <div className="bg-black/60 absolute inset-0 flex flex-col justify-center items-center gap-1">
                <H5 className='text-white font-semibold leading-none w-fit text-center uppercase'>
                    Flat 30% OFF on
                </H5>
                <H3 className='text-white font-semibold leading-none w-fit text-center uppercase'>
                    Power Bits
                </H3>

                <Button className='bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727] mt-2'>
                    <ArrowRight size={32} className='-rotate-45' />
                </Button>
            </div>

        </div>
    )
}

export default OffProductBanner