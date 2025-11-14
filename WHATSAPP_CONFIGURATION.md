# WhatsApp Button Configuration Guide

## Quick Setup

The WhatsApp floating button is located in: `src/components/layout/floating-buttons.tsx`

### Step 1: Update Phone Number

Find this line in the file (around line 20):
```typescript
const phoneNumber = '919876543210' // Example: India +91 9876543210
```

Replace with your WhatsApp Business number in international format:
- **Remove** the `+` sign
- **Remove** all spaces and dashes
- **Include** country code

### Examples:

**India:**
```typescript
const phoneNumber = '919876543210' // +91 9876543210
```

**USA:**
```typescript
const phoneNumber = '14155552671' // +1 415-555-2671
```

**UK:**
```typescript
const phoneNumber = '447911123456' // +44 7911 123456
```

**UAE:**
```typescript
const phoneNumber = '971501234567' // +971 50 123 4567
```

### Step 2: Customize Default Message (Optional)

Find this line (around line 21):
```typescript
const message = encodeURIComponent('Hello! I would like to inquire about your products.')
```

Change the message text to your preference:
```typescript
const message = encodeURIComponent('Hi! I need help with...')
```

**Note:** Keep the `encodeURIComponent()` wrapper - it's required for URL encoding.

### Step 3: Test the Button

1. Save the file
2. Refresh your website
3. Click the green WhatsApp button in the bottom-right corner
4. It should open WhatsApp Web/App with your number and message

## Troubleshooting

### Button not appearing?
- Check if the component is imported in `src/components/layout/wrapper.tsx`
- Verify the file has no syntax errors
- Clear browser cache and refresh

### Wrong number opens?
- Double-check the phone number format (no +, spaces, or dashes)
- Ensure country code is included
- Test with WhatsApp Web: `https://wa.me/YOUR_NUMBER`

### Message not pre-filled?
- Verify the message is wrapped in `encodeURIComponent()`
- Check for special characters that might break the URL

## Advanced Customization

### Change Button Color:
```typescript
className="bg-[#25D366] hover:bg-[#20BA5A]" // Current green
// Change to:
className="bg-blue-600 hover:bg-blue-700" // Blue
className="bg-purple-600 hover:bg-purple-700" // Purple
```

### Change Button Position:
```typescript
className="fixed bottom-6 right-6" // Current position
// Change to:
className="fixed bottom-6 left-6" // Bottom-left
className="fixed top-6 right-6" // Top-right
```

### Change Button Size:
```typescript
className="p-4" // Current size
// Change to:
className="p-3" // Smaller
className="p-5" // Larger
```

### Change Icon Size:
```typescript
<MessageCircle className="w-6 h-6" /> // Current size
// Change to:
<MessageCircle className="w-5 h-5" /> // Smaller
<MessageCircle className="w-8 h-8" /> // Larger
```

## Multiple WhatsApp Numbers

If you need different numbers for different departments:

```typescript
const handleWhatsApp = (department?: string) => {
    let phoneNumber = '919876543210'; // Default/Sales
    let message = 'Hello! I would like to inquire about your products.';
    
    if (department === 'support') {
        phoneNumber = '919876543211'; // Support number
        message = 'Hi! I need technical support.';
    } else if (department === 'orders') {
        phoneNumber = '919876543212'; // Orders number
        message = 'Hello! I have a question about my order.';
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
```

Then create multiple buttons or a dropdown menu.

## Business Hours Message (Optional)

Add time-based messages:

```typescript
const handleWhatsApp = () => {
    const hour = new Date().getHours();
    const isBusinessHours = hour >= 9 && hour < 18; // 9 AM - 6 PM
    
    const phoneNumber = '919876543210';
    const message = isBusinessHours 
        ? 'Hello! I would like to inquire about your products.'
        : 'Hello! I am contacting outside business hours. Please respond when available.';
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
```

## Important Notes

1. **WhatsApp Business:** For business use, consider getting a WhatsApp Business account
2. **Privacy:** Ensure your privacy policy mentions WhatsApp communication
3. **Response Time:** Set customer expectations for response times
4. **Testing:** Always test with your actual WhatsApp number before going live
5. **Mobile:** The button works on both mobile and desktop devices

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify phone number format at: https://wa.me/YOUR_NUMBER
3. Test WhatsApp Web connectivity
4. Ensure WhatsApp is installed on mobile devices

---

**Last Updated:** 2025
**Component Location:** `src/components/layout/floating-buttons.tsx`
