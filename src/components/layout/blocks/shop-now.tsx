import { H5, } from '@/components/typography/typography'
import { Button } from '@/components/ui/button'
import React from 'react'
import { P } from '../../typography/typography';
import Image from 'next/image';

const ShopNow = () => {
    return (
        <div className='relative rounded-3xl overflow-hidden'>
            <Image
                width={500}
                height={500} alt='Shop Now' src={"https://images.pexels.com/photos/4312860/pexels-photo-4312860.jpeg"} className='w-full object-cover shadow-xl h-80 object-center' />
            <div className="bg-black/60 absolute inset-0 flex flex-col justify-center items-center">
                <H5 className='text-white font-semibold w-32 text-center uppercase'>
                    Power Bits 30% OFF
                </H5>

                <Button className='bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]'>
                    <P>
                        Shop Now
                    </P>
                </Button>
            </div>
        </div>
    )
}

export default ShopNow