'use client'

import { useState, useEffect } from 'react'
import { X, Package, User, Mail, Phone, MessageSquare, ShoppingCart, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toast } from 'sonner'
import { useCreateNewEnquiry } from '@/api/enquiry.service'
import { Use_auth } from '@/api/user.service'
import { Enquiry } from '@/supabase/schema/schema.type'
import { sendEnquiryEmail } from '@/lib/email'
import { Formik, Form, Field } from 'formik'
import Image from 'next/image'

interface BulkQuoteProduct {
    id: string
    product_name: string
    model_number?: string
    photos: string[]
    quantity?: number
}

interface BulkQuoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    products: BulkQuoteProduct[]
    onSuccess?: () => void
    onRemoveProduct?: (productId: string) => void
}

interface FormValues {
    name: string
    email: string
    phone: string
    company: string
    city: string
    message: string
}

export default function BulkQuoteModal({ open, onOpenChange, products, onSuccess, onRemoveProduct }: BulkQuoteModalProps) {
    const { data: user } = Use_auth()
    const createEnquiryMutation = useCreateNewEnquiry()
    const [isProductListOpen, setIsProductListOpen] = useState(false)
    const [localProducts, setLocalProducts] = useState<BulkQuoteProduct[]>(products)

    const PREVIEW_COUNT = 3

    const initialValues: FormValues = {
        name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.company_name || '',
        city: user?.city || '',
        message: ''
    }

    // Update local products when props change or modal opens
    useEffect(() => {
        if (open) {
            setLocalProducts(products.map(p => ({
                ...p,
                quantity: p.quantity || 1
            })))
        }
    }, [open, products])

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        setLocalProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, quantity: newQuantity } : p)
        )
    }

    const handleRemoveProduct = (productId: string) => {
        if (localProducts.length <= 1) {
            toast.error('At least one product must remain in the quote request')
            return
        }

        const updatedProducts = localProducts.filter(p => p.id !== productId)
        setLocalProducts(updatedProducts)

        if (onRemoveProduct) {
            onRemoveProduct(productId)
        }

        toast.success('Product removed from quote request')
    }

    const handleSubmit = async (values: FormValues) => {
        // Validation
        if (!values.name || !values.email || !values.phone) {
            toast.error('Please fill in all required fields')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(values.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        // Phone validation
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/
        if (!phoneRegex.test(values.phone)) {
            toast.error('Please enter a valid phone number (minimum 10 digits)')
            return
        }

        if (!user?.id) {
            toast.error('Please login to submit an enquiry')
            return
        }

        if (localProducts.length === 0) {
            toast.error('No products selected')
            return
        }

        // Prepare product list for message
        const productList = localProducts.map((p, idx) =>
            `${idx + 1}. ${p.product_name}${p.model_number ? ` (${p.model_number})` : ''} - Quantity: ${p.quantity || 1}`
        ).join('\n')

        const totalQuantity = localProducts.reduce((sum, p) => sum + (p.quantity || 1), 0)

        // Prepare enquiry payload
        const enquiryPayload: Enquiry = {
            user_id: user.id,
            products: localProducts.map(p => p.id),
            full_name: values.name,
            email: values.email,
            phone_number: values.phone,
            quantity: totalQuantity.toString(),
            city: values.city,
            company_name: values.company,
            message: `Bulk Quote Request for ${localProducts.length} products:\n\n${productList}${values.message ? `\n\nAdditional Message: ${values.message}` : ''
                }`,
        }

        try {
            const result = await createEnquiryMutation.mutateAsync(enquiryPayload)

            // Send email notification (non-blocking)
            sendEnquiryEmail({
                userName: values.name,
                userEmail: values.email,
                userPhone: values.phone,
                companyName: values.company,
                city: values.city,
                products: localProducts.map(p => ({
                    product_name: p.product_name,
                    model_number: p.model_number,
                    quantity: p.quantity || 1,
                })),
                message: values.message,
                isBulk: true,
                enquiryId: result?.id,
            }).catch(err => {
                console.error('Failed to send bulk enquiry email:', err)
            })

            toast.success('Bulk quote request sent successfully!', {
                description: 'Check your email for confirmation.',
            })
            onOpenChange(false)

            if (onSuccess) {
                onSuccess()
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send bulk quote request. Please try again.'
            toast.error(errorMessage)
        }
    }

    // Safety check for products
    const safeProducts = localProducts || []
    const previewProducts = safeProducts.slice(0, PREVIEW_COUNT)
    const remainingProducts = safeProducts.slice(PREVIEW_COUNT)
    const hasMoreProducts = remainingProducts.length > 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Bulk Quote Request</h2>
                            <p className="text-sm text-gray-500">Get pricing for {localProducts.length} selected {localProducts.length === 1 ? 'product' : 'products'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Products Summary - Collapsible */}
                <div className="border-b bg-gradient-to-br from-gray-50 to-amber-50/30">
                    <Collapsible open={isProductListOpen} onOpenChange={setIsProductListOpen}>
                        <div className="p-6 pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Selected Products
                                </h3>
                                <Badge variant="secondary" className="bg-amber-600 text-white">
                                    {localProducts.length} {localProducts.length === 1 ? 'item' : 'items'}
                                </Badge>
                            </div>

                            {/* Preview - Always visible */}
                            <div className="space-y-2">
                                {previewProducts.map((product, index) => (
                                    <div key={product.id} className="flex gap-3 bg-white p-2.5 rounded-lg border shadow-sm">
                                        <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 text-xs shrink-0">
                                            {index + 1}
                                        </Badge>
                                        <Image
                                            width={500}
                                            height={500}
                                            src={product.photos[0] || '/placeholder-product.jpg'}
                                            alt={product.product_name}
                                            className="w-10 h-10 object-cover rounded border shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm truncate">{product.product_name}</h4>
                                            {product.model_number && (
                                                <p className="text-xs text-gray-500 truncate">Model: {product.model_number}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={product.quantity === 0 ? '' : product.quantity || 1}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '') {
                                                        handleQuantityChange(product.id, 0);
                                                    } else {
                                                        const numValue = parseInt(value);
                                                        if (!isNaN(numValue) && numValue >= 0) {
                                                            handleQuantityChange(product.id, numValue);
                                                        }
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if ((product.quantity || 0) < 1) {
                                                        handleQuantityChange(product.id, 1);
                                                    }
                                                }}
                                                className="w-16 h-8 text-center text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(product.id)}
                                                disabled={localProducts.length <= 1}
                                                className="shrink-0 p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={localProducts.length <= 1 ? "At least one product must remain" : "Remove product"}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Collapsible Content - Remaining products */}
                            {hasMoreProducts && (
                                <>
                                    <CollapsibleContent className="space-y-2 mt-2">
                                        {remainingProducts.map((product, index) => (
                                            <div key={product.id} className="flex gap-3 bg-white p-2.5 rounded-lg border shadow-sm">
                                                <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 text-xs shrink-0">
                                                    {PREVIEW_COUNT + index + 1}
                                                </Badge>
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    src={product.photos[0] || '/placeholder-product.jpg'}
                                                    alt={product.product_name}
                                                    className="w-10 h-10 object-cover rounded border shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-sm truncate">{product.product_name}</h4>
                                                    {product.model_number && (
                                                        <p className="text-xs text-gray-500 truncate">Model: {product.model_number}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={product.quantity === 0 ? '' : product.quantity || 1}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '') {
                                                                handleQuantityChange(product.id, 0);
                                                            } else {
                                                                const numValue = parseInt(value);
                                                                if (!isNaN(numValue) && numValue >= 0) {
                                                                    handleQuantityChange(product.id, numValue);
                                                                }
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if ((product.quantity || 0) < 1) {
                                                                handleQuantityChange(product.id, 1);
                                                            }
                                                        }}
                                                        className="w-16 h-8 text-center text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProduct(product.id)}
                                                        disabled={localProducts.length <= 1}
                                                        className="shrink-0 p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title={localProducts.length <= 1 ? "At least one product must remain" : "Remove product"}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </CollapsibleContent>

                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full mt-2 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                                        >
                                            {isProductListOpen ? (
                                                <>
                                                    <ChevronUp className="w-4 h-4 mr-1" />
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4 mr-1" />
                                                    Show {remainingProducts.length} More {remainingProducts.length === 1 ? 'Product' : 'Products'}
                                                </>
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </>
                            )}
                        </div>
                    </Collapsible>
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Full Name *
                                    </label>
                                    <Field
                                        as={Input}
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email Address *
                                    </label>
                                    <Field
                                        as={Input}
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone Number *
                                    </label>
                                    <Field
                                        as={Input}
                                        name="phone"
                                        required
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <Field
                                        as={Input}
                                        name="company"
                                        placeholder="Enter company name (optional)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <Field
                                    as={Input}
                                    name="city"
                                    placeholder="Enter your city (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MessageSquare className="w-4 h-4 inline mr-1" />
                                    Additional Message
                                </label>
                                <Field
                                    as={Textarea}
                                    name="message"
                                    placeholder="Any specific requirements, quantities, or questions..."
                                    rows={4}
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
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                    disabled={createEnquiryMutation.isPending}
                                >
                                    {createEnquiryMutation.isPending ? 'Submitting...' : 'Send Bulk Quote Request'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
