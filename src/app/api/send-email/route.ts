import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  WelcomeEmailTemplate,
  EnquiryEmailTemplate,
  AdminEnquiryNotificationTemplate,
} from '@/lib/email-templates'

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null
const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    const resendClient = getResend()
    
    if (!resendClient || !process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev'
    const adminEmail = process.env.EMAIL_ADMIN || 'admin@yourdomain.com'

    switch (type) {
      case 'welcome': {
        const { userName, userEmail } = data

        const { data: emailData, error } = await resendClient.emails.send({
          from: emailFrom,
          to: userEmail,
          subject: 'Welcome to A.M. Hydraulics!',
          html: WelcomeEmailTemplate({ userName, userEmail }),
        })

        if (error) {
          console.error('Error sending welcome email:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data: emailData })
      }

      case 'enquiry': {
        const {
          userName,
          userEmail,
          userPhone,
          companyName,
          city,
          products,
          message,
          isBulk,
          enquiryId,
        } = data

        console.log('📧 Sending enquiry emails...')
        console.log('Customer email:', userEmail)
        console.log('Admin email:', adminEmail)
        console.log('From email:', emailFrom)

        // Send confirmation email to customer
        const customerEmailResult = await resendClient.emails.send({
          from: emailFrom,
          to: userEmail,
          subject: `${isBulk ? 'Bulk ' : ''}Quote Request Received - A.M. Hydraulics`,
          html: EnquiryEmailTemplate({
            userName,
            userEmail,
            userPhone,
            companyName,
            city,
            products,
            message,
            isBulk,
          }),
        })

        if (customerEmailResult.error) {
          console.error('❌ Error sending customer enquiry email:', customerEmailResult.error)
        } else {
          console.log('✅ Customer email sent successfully:', customerEmailResult.data)
        }

        // Send notification email to admin
        const adminEmailResult = await resendClient.emails.send({
          from: emailFrom,
          to: adminEmail,
          subject: `🔔 New ${isBulk ? 'Bulk ' : ''}Quote Request from ${userName}`,
          html: AdminEnquiryNotificationTemplate({
            userName,
            userEmail,
            userPhone,
            companyName,
            city,
            products,
            message,
            isBulk,
            enquiryId,
          }),
        })

        if (adminEmailResult.error) {
          console.error('❌ Error sending admin notification email:', adminEmailResult.error)
        } else {
          console.log('✅ Admin email sent successfully:', adminEmailResult.data)
        }

        // Return success even if one email fails
        return NextResponse.json({
          success: true,
          customerEmailSent: !customerEmailResult.error,
          adminEmailSent: !adminEmailResult.error,
          customerError: customerEmailResult.error?.message,
          adminError: adminEmailResult.error?.message,
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in send-email API:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
