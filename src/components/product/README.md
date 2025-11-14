# Product Comments System

A comprehensive review and feedback system for products with the following features:

## Components

### 1. CommentsSection
Main component that combines all comment functionality using tabs.

```tsx
import CommentsSection from '@/components/product/comments-section'

<CommentsSection productId="product-id" />
```

### 2. StarRating
Reusable star rating component for both display and input.

```tsx
import StarRating from '@/components/product/star-rating'

// Read-only display
<StarRating rating={4.5} readonly />

// Interactive rating
<StarRating 
  rating={rating} 
  onRatingChange={setRating} 
  size="lg" 
  showValue 
/>
```

### 3. CommentForm
Form for users to submit new reviews with:
- Star rating (required)
- Review title (required)
- Detailed comment (required)
- Pros and cons (optional)
- Character limits and validation

### 4. CommentsList
Displays approved comments with:
- User information and avatars
- Star ratings and timestamps
- Pros/cons lists
- Admin replies
- Helpful/not helpful voting
- Sorting options

### 5. CommentStats
Shows review statistics including:
- Average rating
- Total review count
- Rating distribution chart
- Visual progress bars

## Features

### User Features
- ⭐ Submit reviews with 1-5 star ratings
- 📝 Write detailed feedback with title and description
- ✅ Add pros and cons lists
- 👍 Mark reviews as helpful/not helpful
- 🔍 Sort reviews by date or rating
- 👤 User authentication integration
- 📱 Responsive design

### Admin Features
- ✅ Approve/reject reviews before publication
- 💬 Reply to customer reviews
- ⭐ Feature exceptional reviews
- 📊 View review statistics
- 🔒 Moderation controls

### Technical Features
- 🔄 Real-time updates with React Query
- 🎨 Consistent UI with shadcn/ui components
- 📱 Mobile-responsive design
- ♿ Accessibility compliant
- 🔐 Secure with user authentication
- 📈 Performance optimized

## Database Schema

The system uses the following tables:
- `product_comments` - Main reviews table
- `comment_helpful` - Helpful votes tracking
- `comment_replies` - Admin responses

## Integration

The comments section is automatically integrated into product detail pages. Reviews go through an approval process:

1. User submits review → Status: "pending"
2. Admin approves → Status: "approved" → Visible on website
3. Admin rejects → Status: "rejected" → Not visible

## Styling

All components use Tailwind CSS and shadcn/ui for consistent styling that matches your existing design system.

## Dependencies

- `@radix-ui/react-progress` - Progress bars for rating distribution
- `date-fns` - Date formatting
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `jotai` - State management for user authentication