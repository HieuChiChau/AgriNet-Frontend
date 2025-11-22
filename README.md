# AgriNet - Trí tuệ Nhân tạo Kết nối Mạch nông sản Việt

AgriNet giải bài toán "được mùa mất giá" bằng một nền tảng kết nối thông minh. Chúng tôi sử dụng AI để dự báo thị trường, đề xuất kết nối tối ưu giữa người trồng, nhà thu mua và đơn vị logistics dựa trên vị trí, nhu cầu và lịch trình thực tế. AgriNet không chỉ giúp nông dân bán được giá cao hơn, mà còn giúp doanh nghiệp tìm được nguồn cung chất lượng và giảm thiểu 30% chi phí vận chuyển, từ đó nâng cao sức cạnh tranh cho nông sản Việt trên bản đồ toàn cầu.

## 🚀 Tính năng chính

### 🌐 Landing Page

- Trang chủ với hero section, features, statistics
- Hiệu ứng số đếm tăng dần khi scroll
- Header sticky với hiệu ứng blur khi scroll
- Responsive design cho mọi thiết bị

### 👤 Xác thực người dùng

- Đăng ký tài khoản mới
- Đăng nhập với phân quyền theo role
- Quản lý profile với upload avatar
- Cập nhật thông tin cá nhân (tên, số điện thoại, địa chỉ)
- Tích hợp Google Maps API cho autocomplete địa chỉ

### 👨‍🌾 Nông dân (Farmer)

- **Bảng điều khiển**: Xem tổng quan và thống kê
- **Đăng bài**: Tạo bài đăng với tiêu đề, nội dung, hình ảnh, địa điểm
- **Quản lý bài đăng**: Xem danh sách, chỉnh sửa, xóa bài đăng của mình
- **Danh sách người dùng**: Tìm kiếm và xem danh sách người dùng với filter theo role
- **Diễn đàn**: Tham gia thảo luận, xem và tạo bài viết

### 🛒 Người mua (Customer)

- **Bảng điều khiển**: Xem tổng quan
- **Tìm kiếm**: Tìm kiếm sản phẩm/nông sản
- **Gợi ý**: Xem các sản phẩm được AI gợi ý phù hợp
- **Diễn đàn**: Tham gia thảo luận

### 👨‍💼 Quản trị viên (Admin)

- **Bảng điều khiển**: Quản lý toàn bộ hệ thống
- **Quản lý người dùng**: Xem và quản lý tất cả người dùng
- **Quản lý bài đăng**: Kiểm duyệt và quản lý bài đăng

### 💬 Diễn đàn

- **Xem bài viết**: Duyệt các bài đăng trong diễn đàn
- **Tìm kiếm & Lọc**: Tìm kiếm theo từ khóa, lọc theo danh mục
- **Chi tiết bài viết**: Xem đầy đủ thông tin, hình ảnh (TikTok-style slider)
- **Bình luận**: Tạo bình luận và trả lời (hỗ trợ 2 cấp)
- **Phân trang**: Phân trang cho danh sách bài viết và bình luận
- **Bài nổi bật**: Xem các bài viết trending

### 🤖 AI Trợ lý

- Chat box floating ở góc màn hình
- Hỗ trợ trả lời câu hỏi về nông sản, giá cả, kết nối
- UI hiện đại với typing indicator

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React, Tailwind CSS
- **State Management**: Zustand, React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React
- **Maps**: Google Maps Places API
- **HTTP Client**: Axios

## 📦 Cài đặt

### Yêu cầu

- Node.js 18+
- npm, yarn, pnpm hoặc bun

### Các bước cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd agrinet-forum
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.thuexeonline.site
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Chạy development server:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

5. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 🔑 Tài khoản đăng nhập

### Tài khoản Customer (Người mua)

```
Email: huynh.duc.son928@example.com
Password: 123qwe!@#
```

### Tài khoản Farmer (Nông dân)

```
Email: pham.duc.phuong610@example.com
Password: 123qwe!@#
```

## 📱 Cấu trúc dự án

```
agrinet-forum/
├── app/                    # Next.js App Router pages
│   ├── (main-flow)/        # Public routes (login, signup)
│   ├── farmer/            # Farmer dashboard routes
│   ├── customer/          # Customer dashboard routes
│   ├── manage/            # Admin dashboard routes
│   ├── forum/             # Forum pages
│   ├── posts/             # Post detail pages
│   └── profile/           # User profile page
├── components/
│   ├── atoms/             # Basic UI components
│   ├── molecules/          # Composite components
│   ├── organisms/          # Complex components
│   ├── templates/          # Page templates
│   └── pages/              # Page components
├── hooks/                  # Custom React hooks
│   ├── mutations/         # React Query mutations
│   └── query/              # React Query queries
├── lib/                    # Utilities & services
│   ├── services/           # API services
│   ├── validations/        # Zod schemas
│   └── apis/               # HTTP client
├── constants/              # Constants & configs
└── types/                  # TypeScript types
```

## 🎨 Tính năng UI/UX

- **Atomic Design**: Cấu trúc component theo nguyên tắc Atomic Design
- **Responsive Design**: Tối ưu cho mobile, tablet, desktop
- **Animations**: Smooth animations với CSS keyframes
- **Loading States**: Skeleton loaders cho better UX
- **Error Handling**: Toast notifications cho feedback
- **Accessibility**: Semantic HTML và ARIA labels

## 🔄 Quy trình làm việc

1. **Authentication**: Đăng nhập/Đăng ký → Lưu token vào localStorage
2. **Authorization**: Middleware kiểm tra quyền truy cập
3. **Data Fetching**: React Query quản lý API calls và caching
4. **State Management**: Zustand cho global state (user, menu)
5. **Form Handling**: React Hook Form + Zod validation

## 📝 Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 🌟 Tính năng nổi bật

- ✅ Real-time data với React Query
- ✅ Image upload với preview
- ✅ Google Maps integration
- ✅ Comment system với pagination
- ✅ Search & Filter functionality
- ✅ Role-based access control
- ✅ Responsive mobile menu
- ✅ Sticky header với scroll effects
- ✅ Count-up animations
- ✅ TikTok-style image slider

## 📄 License

MIT

## 👥 Contributors

AgriNet Team
