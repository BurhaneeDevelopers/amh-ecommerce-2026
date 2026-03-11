// Email utility functions

interface Product {
  id?: string
  product_name: string
  model_number?: string
  quantity?: number
}

interface SendWelcomeEmailParams {
  userName: string
  userEmail: string
}

interface SendEnquiryEmailParams {
  userName: string
  userEmail: string
  userPhone: string
  companyName?: string
  city?: string
  products: Product[]
  message?: string
  isBulk: boolean
  enquiryId?: string
}

export async function sendWelcomeEmail({ userName, userEmail }: SendWelcomeEmailParams) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        data: {
          userName,
          userEmail,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send welcome email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error to prevent blocking user registration
    return { success: false, error }
  }
}

export async function sendEnquiryEmail({
  userName,
  userEmail,
  userPhone,
  companyName,
  city,
  products,
  message,
  isBulk,
  enquiryId,
}: SendEnquiryEmailParams) {
  try {
    const formattedProducts = products.map((p) => ({
      name: p.product_name,
      modelNumber: p.model_number,
      quantity: p.quantity || 1,
    }))

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'enquiry',
        data: {
          userName,
          userEmail,
          userPhone,
          companyName,
          city,
          products: formattedProducts,
          message,
          isBulk,
          enquiryId,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send enquiry email')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending enquiry email:', error)
    // Don't throw error to prevent blocking enquiry submission
    return { success: false, error }
  }
}
