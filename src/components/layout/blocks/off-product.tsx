import { H3, H5, } from '@/components/typography/typography'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useGetTopAdByPlacement } from '@/api/ads.service'

const OffProductBanner = () => {
    const { data: ad } = useGetTopAdByPlacement('off_product');

    // Use ad data if available, otherwise use fallback
    const imageSrc = ad?.media_url || "https://images.pexels.com/photos/4889065/pexels-photo-4889065.jpeg";
    const title = ad?.title || "Power Bits";
    const description = ad?.description || "Flat 30% OFF on";
    const clickUrl = ad?.click_url;

    const content = (
        <div className='relative rounded-3xl overflow-hidden'>
            <Image alt='Shop Now' width={500} height={500} src={imageSrc} className='w-full object-cover shadow-xl h-[32rem] object-center' />
            <div className="bg-black/60 absolute inset-0 flex flex-col justify-center items-center gap-1">
                <H5 className='text-white font-semibold leading-none w-fit text-center uppercase'>
                    {description}
                </H5>
                <H3 className='text-white font-semibold leading-none w-fit text-center uppercase'>
                    {title}
                </H3>

                <Button className='bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727] mt-2'>
                    <ArrowRight size={32} className='-rotate-45' />
                </Button>
            </div>
        </div>
    );

    // If ad has click URL, make it clickable
    if (clickUrl) {
        return (
            <a href={clickUrl} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
}

export default OffProductBanner