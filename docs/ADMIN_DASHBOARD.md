# Admin Dashboard - Documentation

## Overview
A comprehensive admin dashboard page has been created at `/admin` for managing your INN HoiAn homestay business.

## Features

### 📊 Dashboard Statistics
- **Total Projects**: Displays the count of all homestay projects
- **Services**: Shows the number of services offered
- **Blog Posts**: Counts all published blog posts
- **Messages**: Displays contact form submissions
- Each stat card includes:
  - Icon with color-coded background
  - Current value
  - Trend indicator (percentage change)
  - Hover effects with smooth transitions

### 🏠 Projects Management
- View all homestay projects in a list format
- Each project card displays:
  - Project thumbnail image
  - Project name and type badge
  - Featured status (star icon)
  - Description
  - Tags (e.g., "Rice Fields", "Rustic", "Peaceful")
  - Action buttons (View, Edit, Delete) - visible on hover
- "Add Project" button for creating new projects

### ⚙️ Services Management
- Grid layout displaying all services
- Each service card shows:
  - Service icon
  - Title and description
  - Edit and Delete buttons (visible on hover)
  - Decorative background elements
- "Add Service" button for creating new services

### 📝 Blog Posts Management
- List view of all blog posts
- Each post displays:
  - Featured image
  - Post title and category badge
  - Content preview (truncated)
  - Author name
  - Publication date
  - Action buttons (View, Edit, Delete) - visible on hover
- "Add Post" button for creating new posts

### 💬 Contact Messages
- Dedicated tab for viewing customer inquiries
- Currently shows empty state with placeholder
- Ready for integration with message data
- Analytics button for future insights

## Design Features

### 🎨 Visual Design
- **Modern gradient background**: Subtle gradient from background to secondary colors
- **Premium card designs**: Elevated cards with hover effects and shadows
- **Smooth animations**: Framer Motion animations for page load and interactions
- **Color-coded sections**: Each stat has its own color theme (blue, green, purple, orange)
- **Responsive layout**: Works on mobile, tablet, and desktop
- **Glassmorphism effects**: Modern blur and transparency effects

### 🔄 Interactive Elements
- **Hover states**: All cards and buttons have smooth hover transitions
- **Tab navigation**: Easy switching between different management sections
- **Loading states**: Skeleton loaders while data is being fetched
- **Badge indicators**: Visual tags for categories, types, and features

## Technical Implementation

### Components Used
- `Navbar` - Top navigation bar
- `Footer` - Bottom footer
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` - Card components
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` - Tab navigation
- `Button` - Action buttons
- `Badge` - Status and category indicators
- Lucide React icons for visual elements

### Data Hooks
- `useProjects()` - Fetches all projects
- `useServices()` - Fetches all services
- `usePosts()` - Fetches all blog posts

### Routing
- Route added to `/admin` in `App.tsx`
- Accessible via: `http://localhost:3000/admin`

## Usage

1. **Access the admin page**: Navigate to `http://localhost:3000/admin`
2. **View statistics**: See overview of your business data at the top
3. **Manage content**: Use the tabs to switch between different sections
4. **Add new items**: Click the "Add" buttons to create new content (functionality to be implemented)
5. **Edit/Delete**: Hover over items to see action buttons (functionality to be implemented)

## Next Steps (Future Enhancements)

1. **Authentication**: Add login/logout functionality
2. **CRUD Operations**: Implement actual create, update, and delete functionality
3. **Form Modals**: Create forms for adding/editing projects, services, and posts
4. **Message Integration**: Connect to backend API for contact messages
5. **Analytics**: Add charts and graphs for business insights
6. **Search & Filter**: Add search and filtering capabilities
7. **Pagination**: Implement pagination for large datasets
8. **Image Upload**: Add image upload functionality for projects and posts
9. **Rich Text Editor**: Integrate a WYSIWYG editor for blog posts
10. **Notifications**: Add toast notifications for actions

## File Structure
```
client/src/pages/Admin.tsx - Main admin dashboard component
client/src/App.tsx - Updated with /admin route
```

## Color Scheme
- Blue (#3B82F6) - Projects
- Green (#10B981) - Services
- Purple (#8B5CF6) - Posts
- Orange (#F59E0B) - Messages
- Primary - Main brand color
- Secondary - Supporting colors
- Muted - Text and backgrounds

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
