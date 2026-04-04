'use client'

import { X, Package, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { productQuantityAtom } from '@/jotai/store'
import { useCreateNewEnquiry } from '@/api/enquiry.service'
import { Use_auth } from '@/api/user.service'
import { Enquiry } from '@/supabase/schema/schema.type'
import { sendEnquiryEmail } from '@/lib/email'
import { Formik, Form, Field } from 'formik'
import Image from 'next/image'

interface GetQuoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: {
        id?: string | null | undefined
        name?: string
        sku?: string
        // Legacy support
        product_name?: string
        model_number?: string
        photos?: string[]
    }
    onSuccess?: () => void
}

interface FormValues {
    name: string
    email: string
    phone: string
    company: string
    city: string
    message: string
}

export default function GetQuoteModal({ open, onOpenChange, product, onSuccess }: GetQuoteModalProps) {
    const { data: user } = Use_auth()
    const [quantity, setQuantity] = useAtom(productQuantityAtom)
    const createEnquiryMutation = useCreateNewEnquiry()

    // Support both old and new schema
    const productName = product.name || product.product_name || 'Product'
    const productSku = product.sku || product.model_number || ''
    const productImage = product.photos?.[0] || '/placeholder-product.jpg'

    const initialValues: FormValues = {
        name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.company_name || '',
        city: user?.city || '',
        message: ''
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
            full_name: values.name,
            email: values.email,
            phone_number: values.phone,
            quantity: quantity.toString(),
            city: values.city,
            company_name: values.company,
            message: `Quantity: ${quantity}${values.message ? `\n\nAdditional Message: ${values.message}` : ''
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
                products: [{
                    product_name: productName,
                    model_number: productSku,
                    quantity: quantity,
                }],
                message: values.message,
                isBulk: false,
                enquiryId: result?.id,
            }).catch(err => {
                console.error('Failed to send enquiry email:', err)
            })

            toast.success('Quote request sent successfully!', {
                description: 'Check your email for confirmation.',
            })
            onOpenChange(false)
            setQuantity(1)

            if (onSuccess) {
                onSuccess()
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send quote request. Please try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" showCloseButton={false}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#ff6b35]/10 rounded-lg">
                            <Package className="w-5 h-5 text-[#ff6b35]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Request Quote</h2>
                            <p className="text-sm text-gray-500">Get pricing for {productName}</p>
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
                            width={500}
                            height={500}
                            src={productImage}
                            alt={productName}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                            <h3 className="font-medium text-gray-900">{productName}</h3>
                            {productSku && (
                                <p className="text-sm text-gray-500">SKU: {productSku}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur }) => (
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
                                    Quantity *
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantity === 0 ? '' : quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            setQuantity(0);
                                        } else {
                                            const numValue = parseInt(value);
                                            if (!isNaN(numValue) && numValue >= 0) {
                                                setQuantity(numValue);
                                            }
                                        }
                                    }}
                                    onBlur={() => {
                                        if (quantity < 1) {
                                            setQuantity(1);
                                        }
                                    }}
                                    placeholder="Enter quantity needed"
                                    className={quantity < 1 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                                />
                                {quantity < 1 && (
                                    <p className="text-xs text-red-600 mt-1">Quantity must be at least 1</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MessageSquare className="w-4 h-4 inline mr-1" />
                                    Additional Message
                                </label>
                                <Field
                                    as={Textarea}
                                    name="message"
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
                                    className="flex-1 bg-gradient-to-r from-[#ff6b35] to-[#8b5cf6] hover:from-[#e55a25] hover:to-[#7c3aed]"
                                    disabled={createEnquiryMutation.isPending}
                                >
                                    {createEnquiryMutation.isPending ? 'Submitting...' : 'Request Quote'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
