'use client'

import { useState } from 'react'
import { X, Package, User, Mail, Phone, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAtomValue, useAtom } from 'jotai'
import { current_user_auth_atom, productQuantityAtom } from '@/jotai/store'
import { useCreateNewEnquiry } from '@/api/enquiry.service'
import { Enquiry } from '@/supabase/schema/schema.type'

interface GetQuoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: {
        id?: string | null | undefined
        product_name: string
        model_number?: string
        photos: string[]
    }
    onSuccess?: () => void
}

export default function GetQuoteModal({ open, onOpenChange, product, onSuccess }: GetQuoteModalProps) {
    const user = useAtomValue(current_user_auth_atom)
    const [quantity, setQuantity] = useAtom(productQuantityAtom)
    const createEnquiryMutation = useCreateNewEnquiry()
    
    const [formData, setFormData] = useState({
        name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: '',
        city: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        // Phone validation
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid phone number (minimum 10 digits)')
            return
        }

        if (quantity < 1) {
            toast.error('Quantity must be at least 1')
            return
        }

        if (!user?.id) {
            toast.error('Please login to submit an enquiry')
            return
        }

        if (!product.id) {
            toast.error('Product information is missing')
            return
        }

        // Prepare enquiry payload
        const enquiryPayload: Enquiry = {
            user_id: user.id,
            products: [product.id],
            full_name: formData.name,
            email: formData.email,
            phone_number: formData.phone,
            quantity: quantity.toString(),
            city: formData.city,
            company_name: formData.company,
            message: `Quantity: ${quantity}${
                formData.message ? `\n\nAdditional Message: ${formData.message}` : ''
            }`,
        }

        try {
            await createEnquiryMutation.mutateAsync(enquiryPayload)
            toast.success('Quote request sent successfully!')
            onOpenChange(false)

            // Reset form
            setFormData({
                name: user?.full_name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                company: '',
                city: '',
                message: ''
            })
            
            // Reset quantity to 1
            setQuantity(1)

            // Call success callback
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send quote request. Please try again.'
            toast.error(errorMessage)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Request Quote</h2>
                            <p className="text-sm text-gray-500">Get pricing for {product.product_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-gray-50 border-b">
                    <div className="flex gap-4">
                        <Image
                            src={product.photos[0] || '/placeholder-product.jpg'}
                            alt={product.product_name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">{product.product_name}</h3>
                            {product.model_number && (
                                <p className="text-sm text-gray-500">Model: {product.model_number}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                Full Name *
                            </label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-1" />
                                Email Address *
                            </label>
                            <Input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-1" />
                                Phone Number
                            </label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <Input
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                                placeholder="Enter company name (optional)"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            placeholder="Enter quantity needed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Additional Message
                        </label>
                        <Textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Any specific requirements or questions..."
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={createEnquiryMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                            disabled={createEnquiryMutation.isPending}
                        >
                            {createEnquiryMutation.isPending ? 'Submitting...' : 'Request Quote'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
