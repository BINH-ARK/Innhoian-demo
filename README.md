# 🏡 INN HoiAn - Homestay Management System

> Hệ thống quản lý - vận hành - kinh doanh dịch vụ homestay tại Hội An

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Công Nghệ](#công-nghệ)
- [Cài Đặt](#cài-đặt)
- [Khởi Động](#khởi-động)
- [API Endpoints](#api-endpoints)
- [Admin Dashboard](#admin-dashboard)
- [CRUD Operations](#crud-operations)
- [Troubleshooting](#troubleshooting)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)

---

## 🎯 Giới Thiệu

INN HoiAn là một hệ thống quản lý homestay toàn diện với các tính năng:

- ✅ **Admin Dashboard** - Quản lý dự án, phòng, dịch vụ, blog posts
- ✅ **CRUD Operations** - Thêm, sửa, xóa dữ liệu với UI mượt mà
- ✅ **Real-time Stats** - Thống kê dashboard tự động cập nhật
- ✅ **Messages Management** - Quản lý tin nhắn khách hàng
- ✅ **Responsive Design** - Giao diện đẹp trên mọi thiết bị

---

## 🛠 Công Nghệ

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TanStack Query** - Data fetching & caching
- **Wouter** - Routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components

### Backend
- **Express.js** - Web framework
- **SQLite3** - Database
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Schema validation

---

## 📦 Cài Đặt

### Prerequisites
- Node.js >= 18
- npm hoặc yarn

### Install Dependencies
```bash
npm install
```

### Database Setup
Database sẽ tự động được tạo và seed data khi khởi động lần đầu.

---

## 🚀 Khởi Động

### Development Mode
```bash
npm run dev
```

Server sẽ chạy tại:
- **Frontend + Backend**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`

### Production Build
```bash
npm run build
npm start
```

### Dừng Server
```bash
# Tìm process đang chạy
lsof -ti:3000

# Kill process
kill $(lsof -ti:3000)
```

---

## 🔌 API Endpoints

### Public Routes
```
GET  /                          → Trang chủ
GET  /about                     → Giới thiệu
GET  /journey                   → Dự án
GET  /services                  → Dịch vụ
GET  /blog                      → Blog
POST /api/contact               → Gửi tin nhắn
```

### Admin Routes
```
GET    /api/admin/dashboard     → Thống kê tổng hợp
GET    /api/admin/projects      → Danh sách projects
POST   /api/admin/projects      → Tạo project mới
PUT    /api/admin/projects/:id  → Cập nhật project
DELETE /api/admin/projects/:id  → Xóa project

GET    /api/admin/posts         → Danh sách posts
POST   /api/admin/posts         → Tạo post mới
PUT    /api/admin/posts/:id     → Cập nhật post
DELETE /api/admin/posts/:id     → Xóa post

GET    /api/admin/services      → Danh sách services
POST   /api/admin/services      → Tạo service mới
PUT    /api/admin/services/:id  → Cập nhật service
DELETE /api/admin/services/:id  → Xóa service

GET    /api/admin/rooms         → Danh sách rooms
POST   /api/admin/rooms/save    → Tạo/cập nhật room
DELETE /api/admin/rooms/:id     → Xóa room

GET    /api/admin/messages      → Danh sách messages
```

### Test API
```bash
# Test GET
curl http://localhost:3000/api/admin/projects

# Test POST
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","slug":"test","description":"Test"}'

# Test PUT
curl -X PUT http://localhost:3000/api/admin/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Test DELETE
curl -X DELETE http://localhost:3000/api/admin/projects/1
```

---

## 👨‍💼 Admin Dashboard

### Truy Cập
```
http://localhost:3000/admin
```

### Các Tab Quản Lý

#### 1. **Dashboard**
- Tổng số projects, services, posts, messages
- Growth percentage
- Real-time statistics

#### 2. **Projects**
- Quản lý dự án homestay
- CRUD operations: Add, Edit, Delete
- Featured projects
- Airbnb integration

#### 3. **Rooms**
- Quản lý phòng
- Amenities management
- Image gallery
- Pricing

#### 4. **Services**
- Quản lý dịch vụ
- Icon selection
- Description

#### 5. **Posts**
- Quản lý blog posts
- Categories
- Author info
- Featured image

#### 6. **Messages**
- Xem tin nhắn từ khách hàng
- Contact information
- Message content

---

## ✏️ CRUD Operations

### Thêm Mới (Create)
1. Nhấn nút **"Add"** (Project/Post/Service/Room)
2. Điền thông tin vào form
3. Nhấn **"Create"**
4. ✅ Item mới xuất hiện ngay lập tức

### Chỉnh Sửa (Update)
1. Hover vào item cần sửa
2. Nhấn nút **"Edit"**
3. ✅ Form tự động điền dữ liệu cũ
4. Sửa thông tin
5. Nhấn **"Update"**
6. ✅ Thay đổi hiển thị ngay

### Xóa (Delete)
1. Hover vào item cần xóa
2. Nhấn nút **"Delete"**
3. ✅ Confirm dialog hiện ra
4. Nhấn OK
5. ✅ Item biến mất ngay lập tức

### Tính Năng
- ✅ **Auto-fill** - Form tự động điền dữ liệu khi edit
- ✅ **Optimistic Updates** - UI cập nhật ngay không cần reload
- ✅ **React Query Cache** - Tự động invalidate và refresh
- ✅ **Loading States** - Skeleton loading khi fetch data
- ✅ **Error Handling** - Hiển thị lỗi rõ ràng
- ✅ **Confirmation** - Xác nhận trước khi xóa

---

## 🐛 Troubleshooting

### Lỗi: "Unexpected token <"
**Nguyên nhân:** Server trả về HTML thay vì JSON

**Giải pháp:**
```bash
# Kiểm tra server log
# Đảm bảo Vite middleware skip API routes
# File: server/vite.ts
if (url.startsWith('/api')) {
  return next();
}
```

### Lỗi: "Failed to fetch"
**Nguyên nhân:** Server không chạy

**Giải pháp:**
```bash
# Kiểm tra server
lsof -ti:3000

# Khởi động lại
npm run dev
```

### Lỗi: Data không hiển thị
**Nguyên nhân:** Database chưa có dữ liệu

**Giải pháp:**
- Server tự động seed data khi khởi động lần đầu
- Hoặc thêm dữ liệu qua Admin UI

### Lỗi: CRUD không hoạt động
**Kiểm tra:**
1. Server log có lỗi không
2. Browser console có lỗi không
3. Network tab - Response status code
4. React Query DevTools

---

## 📁 Cấu Trúc Dự Án

```
inn-hoian/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                # Backend Express app
│   ├── routes.ts          # Main routes
│   ├── crud-routes.ts     # CRUD endpoints
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Vite middleware
├── shared/                # Shared code
│   ├── schema.ts          # Database schema
│   └── routes.ts          # API route definitions
├── db/                    # SQLite database
│   └── data.db
└── README.md
```

---

## 🔑 Key Features

### Backend
- ✅ RESTful API với Express
- ✅ SQLite3 database với Drizzle ORM
- ✅ Type-safe schema với Zod
- ✅ Detailed logging
- ✅ Error handling đầy đủ
- ✅ Vite middleware integration

### Frontend
- ✅ React Query cho data fetching
- ✅ Optimistic updates
- ✅ Loading skeletons
- ✅ Smooth animations (Framer Motion)
- ✅ Responsive design
- ✅ Type-safe với TypeScript
- ✅ shadcn/ui components

---

## 📊 Database Schema

### Projects
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- slug: TEXT UNIQUE
- description: TEXT
- type: TEXT
- slogan: TEXT
- airbnbUrl: TEXT
- isFeatured: BOOLEAN
- tags: TEXT (JSON array)
- images: TEXT (JSON array)
- createdAt: TIMESTAMP
```

### Posts
```sql
- id: INTEGER PRIMARY KEY
- title: TEXT
- slug: TEXT UNIQUE
- content: TEXT
- category: TEXT
- imageUrl: TEXT
- author: TEXT
- createdAt: TIMESTAMP
```

### Services
```sql
- id: INTEGER PRIMARY KEY
- title: TEXT
- description: TEXT
- icon: TEXT
```

### Rooms
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- description: TEXT
- price: INTEGER
- capacity: INTEGER
- amenities: TEXT (JSON array)
- images: TEXT (JSON array)
- isAvailable: BOOLEAN
```

### Messages
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- email: TEXT
- phone: TEXT
- message: TEXT
- createdAt: TIMESTAMP
```

---

## 🧪 Testing

### Manual Testing
```bash
# Test CRUD script
./test-crud.sh
```

### API Testing
```bash
# Test all endpoints
curl http://localhost:3000/api/admin/projects
curl http://localhost:3000/api/admin/posts
curl http://localhost:3000/api/admin/services
curl http://localhost:3000/api/admin/rooms
curl http://localhost:3000/api/admin/messages
curl http://localhost:3000/api/admin/dashboard
```

---

## 📝 Development Notes

### Important Files
- **`server/vite.ts`** - Vite middleware (skip API routes)
- **`server/routes.ts`** - Main API routes
- **`server/crud-routes.ts`** - CRUD operations
- **`server/storage.ts`** - Database queries
- **`shared/schema.ts`** - Database schema
- **`shared/routes.ts`** - API route definitions

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ Prettier formatting
- ✅ Type-safe database queries
- ✅ Zod validation

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

### Environment Variables
```env
PORT=3000
NODE_ENV=production
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra server log
2. Kiểm tra browser console (F12)
3. Test API với curl
4. Review code trong `server/` và `client/src/`

---

## 📄 License

Private Project - INN HoiAn

---

**Built with ❤️ by INN HoiAn Team**
