'use client'

import { H4, H5, P } from '@/components/typography/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Newspaper } from 'lucide-react'
import React from 'react'

const NewsLetter: React.FC = () => {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-1">
            <H5 className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold px-4 py-2 rounded-lg text-center">
                Newsletter
            </H5>


            <div className="flex justify-center items-center py-5">
                <Newspaper color="#000" size={96} />
            </div>

            <div className="text-center p-2 flex flex-col justify-center items-center gap-2">

                <H4 className='bg-gradient-to-br from-[#272727] to-[#272727]/50 bg-clip-text text-transparent uppercase text-center'>
                    Stay Updated!
                </H4>

                <P className='text-[#272727] text-center'>
                    Subscribe to our newsletters now and stay up to date with new collections and exclusive offers.
                </P>

                <Input placeholder='Enter email here' className='text-center mx-auto border rounded-lg border-[#272727]/30 mt-2' />

                <Button className='bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]' disabled>
                    <P>
                        Subscribe
                    </P>
                </Button>
            </div>
        </div >
    )
}

export default NewsLetter
