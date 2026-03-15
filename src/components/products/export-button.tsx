'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function ExportButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          className="h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
        >
          <Download className="w-5 h-5 mr-2" />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52" align="end">
        <div className="text-center py-1">
          <p className="text-sm font-semibold text-gray-900 mb-1">Coming Soon</p>
          <p className="text-xs text-gray-500">
            Export functionality will be available in a future update.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
