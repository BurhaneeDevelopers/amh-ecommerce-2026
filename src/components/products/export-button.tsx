'use client'

import { useState, useEffect } from 'react'
import { Download, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/supabase/schema/schema.type'

interface ExportButtonProps {
  dealerCode?: string
  dealerName?: string
  products: (Product & { price?: number | null })[]
}

type ExportState = 'idle' | 'loading' | 'error'

export default function ExportButton({ dealerCode, dealerName, products }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle')

  // Reset error state after 3 seconds
  useEffect(() => {
    if (state !== 'error') return
    const timer = setTimeout(() => setState('idle'), 3000)
    return () => clearTimeout(timer)
  }, [state])

  const handleExport = async () => {
    if (state === 'loading') return
    setState('loading')

    try {
      const code = dealerCode ?? 'DEALER'
      const name = dealerName ?? code
      
      const res = await fetch('/api/reports/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products,
          dealerCode: code,
          dealerName: name,
        }),
      })

      if (!res.ok) throw new Error(`Server responded ${res.status}`)

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      a.download = match ? match[1] : `product-report-${code}.pdf`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)

      setState('idle')
    } catch {
      setState('error')
    }
  }

  if (state === 'error') {
    return (
      <Button
        size="lg"
        onClick={handleExport}
        className="h-12 px-6 font-semibold shadow-md whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
      >
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed — try again
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      onClick={handleExport}
      disabled={state === 'loading'}
      className="h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
    >
      {state === 'loading' ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" />
          Export
        </>
      )}
    </Button>
  )
}
