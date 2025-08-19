import React from 'react'
import { Button } from '../ui/button'
import { ChevronDown, LayoutDashboard } from 'lucide-react'
import { H6 } from '../typography/typography'
import { useAtom } from 'jotai'
import { toggleAllCategoriesAtom } from '@/jotai/store'

const ToggleCategories = () => {
    const [toggleAllCategories, setToggleAllCategories] = useAtom(toggleAllCategoriesAtom)
    return (
        <Button className="bg-gradient-to-br from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-7 flex gap-2 justify-between items-center flex-grow lg:!w-80 max-w-80" onClick={() => setToggleAllCategories(!toggleAllCategories)}>
            <span className="flex gap-2 items-center">
                <LayoutDashboard className="!w-7 !h-7" />
                <H6>
                    All Categories
                </H6>
            </span>
            <ChevronDown className="!w-7 !h-7" />
        </Button>
    )
}

export default ToggleCategories