// Email templates for Resend

interface WelcomeEmailProps {
  userName: string
  userEmail: string
}

export const WelcomeEmailTemplate = ({ userName, userEmail }: WelcomeEmailProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to A.M. Hydraulics</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ff6b35 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to A.M. Hydraulics!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName}!</h2>
    
    <p style="font-size: 16px; color: #4b5563;">
      Thank you for creating an account with A.M. Hydraulics. We're excited to have you on board!
    </p>
    
    <p style="font-size: 16px; color: #4b5563;">
      Your account has been successfully created with the email: <strong>${userEmail}</strong>
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
      <h3 style="margin-top: 0; color: #1f2937;">What's Next?</h3>
      <ul style="color: #4b5563; padding-left: 20px;">
        <li>Browse our extensive product catalog</li>
        <li>Request quotes for products you're interested in</li>
        <li>Save products to your wishlist</li>
        <li>Get personalized recommendations</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
         style="background: linear-gradient(135deg, #ff6b35 0%, #8b5cf6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
        Start Shopping
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If you have any questions, feel free to reach out to our support team.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} MSI E-commerce. All rights reserved.
    </p>
  </div>
</body>
</html>
`

interface EnquiryEmailProps {
  userName: string
  userEmail: string
  userPhone: string
  companyName?: string
  city?: string
  products: Array<{ name: string; modelNumber?: string; quantity: number }>
  message?: string
  isBulk: boolean
}

export const EnquiryEmailTemplate = ({
  userName,
  userEmail,
  userPhone,
  companyName,
  city,
  products,
  message,
  isBulk
}: EnquiryEmailProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isBulk ? 'Bulk' : ''} Quote Request Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, ${isBulk ? '#f59e0b' : '#f97316'} 0%, ${isBulk ? '#f97316' : '#eab308'} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${isBulk ? 'Bulk ' : ''}Quote Request Received!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Thank you, ${userName}!</h2>
    
    <p style="font-size: 16px; color: #4b5563;">
      We've received your ${isBulk ? 'bulk ' : ''}quote request and our team will get back to you shortly with pricing and availability.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isBulk ? '#f59e0b' : '#f97316'};">
      <h3 style="margin-top: 0; color: #1f2937;">Request Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Name:</td>
          <td style="padding: 8px 0; color: #1f2937;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; color: #1f2937;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0; color: #1f2937;">${userPhone}</td>
        </tr>
        ${companyName ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Company:</td>
          <td style="padding: 8px 0; color: #1f2937;">${companyName}</td>
        </tr>
        ` : ''}
        ${city ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">City:</td>
          <td style="padding: 8px 0; color: #1f2937;">${city}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">Products Requested (${products.length})</h3>
      ${products.map((product, index) => `
        <div style="padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 10px;">
          <div style="font-weight: bold; color: #1f2937;">${index + 1}. ${product.name}</div>
          ${product.modelNumber ? `<div style="font-size: 14px; color: #6b7280;">Model: ${product.modelNumber}</div>` : ''}
          <div style="font-size: 14px; color: #f97316; font-weight: bold; margin-top: 4px;">Quantity: ${product.quantity}</div>
        </div>
      `).join('')}
    </div>
    
    ${message ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">Additional Message</h3>
      <p style="color: #4b5563; white-space: pre-wrap;">${message}</p>
    </div>
    ` : ''}
    
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>⏱️ What happens next?</strong><br>
        Our sales team will review your request and contact you within 24 hours with a detailed quote.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If you have any urgent questions, please don't hesitate to contact us directly.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} MSI E-commerce. All rights reserved.
    </p>
  </div>
</body>
</html>
`

interface AdminEnquiryNotificationProps {
  userName: string
  userEmail: string
  userPhone: string
  companyName?: string
  city?: string
  products: Array<{ name: string; modelNumber?: string; quantity: number }>
  message?: string
  isBulk: boolean
  enquiryId?: string
}

export const AdminEnquiryNotificationTemplate = ({
  userName,
  userEmail,
  userPhone,
  companyName,
  city,
  products,
  message,
  isBulk,
  enquiryId
}: AdminEnquiryNotificationProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New ${isBulk ? 'Bulk ' : ''}Quote Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #dc2626; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New ${isBulk ? 'Bulk ' : ''}Quote Request</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    ${enquiryId ? `<p style="font-size: 12px; color: #6b7280; margin-top: 0;">Enquiry ID: ${enquiryId}</p>` : ''}
    
    <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <p style="margin: 0; color: #991b1b; font-weight: bold;">⚡ Action Required</p>
      <p style="margin: 5px 0 0 0; color: #991b1b; font-size: 14px;">A customer has submitted a ${isBulk ? 'bulk ' : ''}quote request. Please respond within 24 hours.</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">Customer Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #1f2937;">${userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0; color: #1f2937;"><a href="mailto:${userEmail}" style="color: #2563eb;">${userEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0; color: #1f2937;"><a href="tel:${userPhone}" style="color: #2563eb;">${userPhone}</a></td>
        </tr>
        ${companyName ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Company:</td>
          <td style="padding: 8px 0; color: #1f2937;">${companyName}</td>
        </tr>
        ` : ''}
        ${city ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">City:</td>
          <td style="padding: 8px 0; color: #1f2937;">${city}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">Products Requested (${products.length})</h3>
      ${products.map((product, index) => `
        <div style="padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #f97316;">
          <div style="font-weight: bold; color: #1f2937; font-size: 15px;">${index + 1}. ${product.name}</div>
          ${product.modelNumber ? `<div style="font-size: 14px; color: #6b7280; margin-top: 2px;">Model: ${product.modelNumber}</div>` : ''}
          <div style="font-size: 14px; color: #dc2626; font-weight: bold; margin-top: 4px;">Quantity: ${product.quantity} units</div>
        </div>
      `).join('')}
      
      <div style="margin-top: 15px; padding: 12px; background: #fef3c7; border-radius: 6px;">
        <strong style="color: #92400e;">Total Items:</strong> <span style="color: #92400e;">${products.reduce((sum, p) => sum + p.quantity, 0)} units across ${products.length} product${products.length > 1 ? 's' : ''}</span>
      </div>
    </div>
    
    ${message ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">Customer Message</h3>
      <p style="color: #4b5563; white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 6px;">${message}</p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:${userEmail}?subject=Quote%20for%20your%20enquiry" 
         style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
        Reply to Customer
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      This is an automated notification from A.M. Hydraulics system.
    </p>
  </div>
</body>
</html>
`
