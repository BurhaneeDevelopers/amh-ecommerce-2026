# Certifications Folder

This folder is for storing ISO certifications and other quality standard certificates.

## How to Add Certificates

### Step 1: Upload Certificate Files
Upload your certificate files to this folder (`public/certifications/`):

**For Images:**
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
- Recommended size: 1200x1600px or similar aspect ratio
- Example filenames:
  - `iso-9001.jpg`
  - `iso-14001.png`
  - `iso-45001.jpg`

**For PDFs:**
- Format: `.pdf`
- Example filenames:
  - `iso-9001.pdf`
  - `iso-14001.pdf`
  - `iso-45001.pdf`

### Step 2: Update the Certifications Data

Edit the file: `src/components/layout/blocks/certifications-section.tsx`

Find the `certifications` array (around line 20) and update it with your certificate details:

```typescript
const certifications: Certification[] = [
    {
        id: "iso-9001",
        title: "ISO 9001:2015",
        description: "Quality Management System Certification",
        imageUrl: "/certifications/iso-9001.jpg", // Your uploaded image
        pdfUrl: "/certifications/iso-9001.pdf",   // Your uploaded PDF
        issueDate: "2024",
        expiryDate: "2027", // Optional
    },
    {
        id: "iso-14001",
        title: "ISO 14001:2015",
        description: "Environmental Management System Certification",
        imageUrl: "/certifications/iso-14001.jpg",
        pdfUrl: "/certifications/iso-14001.pdf",
        issueDate: "2024",
    },
    // Add more certifications here
];
```

### Step 3: Certificate Properties

Each certificate object can have:
- `id`: Unique identifier (required)
- `title`: Certificate name (required)
- `description`: Brief description (required)
- `imageUrl`: Path to certificate image (optional)
- `pdfUrl`: Path to certificate PDF (optional)
- `issueDate`: Year or date issued (optional)
- `expiryDate`: Year or date of expiry (optional)

### Example Certificates to Add

Common ISO certifications you might want to add:
- ISO 9001 - Quality Management
- ISO 14001 - Environmental Management
- ISO 45001 - Occupational Health & Safety
- ISO 27001 - Information Security
- Any industry-specific certifications

## Features

✅ Displays certificates in a beautiful grid layout
✅ Click to view full certificate (opens PDF in new tab or shows image in modal)
✅ Responsive design for mobile and desktop
✅ Hover effects and smooth transitions
✅ Fallback display if images are not yet uploaded

## Notes

- If you only have PDFs, you can omit the `imageUrl` field
- If you only have images, you can omit the `pdfUrl` field
- The section will show a placeholder if no certificates are configured
- All paths should start with `/certifications/` (relative to the public folder)
