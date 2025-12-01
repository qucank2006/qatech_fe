# QATech Frontend

Ứng dụng web thương mại điện tử chuyên bán linh kiện máy tính, laptop, màn hình và các sản phẩm công nghệ cao cấp, được xây dựng với React và Vite.

## Mô Tả Dự Án

QATech Frontend là giao diện người dùng của hệ thống thương mại điện tử QATech, một nền tảng mua sắm trực tuyến chuyên về các sản phẩm công nghệ. Ứng dụng cung cấp trải nghiệm mua sắm hiện đại và trực quan cho khách hàng, đồng thời cung cấp hệ thống quản trị mạnh mẽ cho admin và nhân viên.

### Tính Năng Chính

- **Trang chủ**: Hero section với hiệu ứng gradient, giới thiệu dịch vụ, sản phẩm nổi bật, và logo các thương hiệu
- **Danh mục sản phẩm**: Hiển thị sản phẩm theo danh mục (Laptop, Màn hình, Linh kiện PC)
- **Chi tiết sản phẩm**: Thông tin chi tiết, thông số kỹ thuật, và hình ảnh sản phẩm
- **Công cụ Build PC**: Cho phép người dùng tự xây dựng cấu hình PC bằng cách chọn từng linh kiện
- **Giỏ hàng**: Quản lý sản phẩm trong giỏ hàng với tính năng cập nhật số lượng
- **Thanh toán**: Tích hợp VNPay để xử lý thanh toán trực tuyến
- **Xác thực người dùng**: Đăng ký, đăng nhập, quên mật khẩu với OTP
- **Quản lý đơn hàng**: Theo dõi đơn hàng và xem chi tiết đơn hàng
- **Trang quản trị**: Dashboard, quản lý sản phẩm, đơn hàng, người dùng và nhân viên

### Công Nghệ Sử Dụng

Dự án sử dụng các công nghệ hiện đại để đảm bảo hiệu suất và trải nghiệm người dùng tốt nhất:

- **React 18**: Thư viện JavaScript để xây dựng giao diện người dùng
- **Vite**: Công cụ build nhanh chóng với Hot Module Replacement (HMR)
- **Redux Toolkit**: Quản lý state tập trung cho authentication, giỏ hàng và sản phẩm
- **React Router DOM**: Điều hướng và quản lý routing
- **Tailwind CSS**: Framework CSS utility-first để thiết kế responsive
- **Axios**: Thư viện HTTP client để giao tiếp với API backend
- **React Hot Toast**: Thư viện hiển thị thông báo đẹp mắt
- **Swiper**: Carousel/slider component cho banner và sản phẩm
- **Recharts**: Thư viện biểu đồ cho trang dashboard admin

### Thách Thức và Giải Pháp

- **Quản lý state phức tạp**: Sử dụng Redux Toolkit để quản lý state tập trung, dễ dàng debug và maintain
- **Tối ưu hiệu suất**: Sử dụng Vite với HMR để phát triển nhanh, lazy loading cho routes
- **Xử lý ảnh sản phẩm**: Tích hợp với backend để upload và hiển thị ảnh, xử lý việc giữ nguyên ảnh khi cập nhật sản phẩm
- **Bảo mật**: Sử dụng JWT token, protected routes, và role-based access control
- **Responsive design**: Sử dụng Tailwind CSS để đảm bảo giao diện hoạt động tốt trên mọi thiết bị

### Tính Năng Dự Kiến

- [ ] Tìm kiếm và lọc sản phẩm nâng cao
- [ ] Đánh giá và bình luận sản phẩm
- [ ] So sánh sản phẩm
- [ ] Wishlist/Yêu thích
- [ ] Thông báo real-time
- [ ] Tích hợp chatbot hỗ trợ khách hàng
- [ ] Dark mode toggle
- [ ] Đa ngôn ngữ (i18n)

## Mục Lục

- [Cài Đặt và Chạy Dự Án](#cài-đặt-và-chạy-dự-án)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Tác Giả & Đóng Góp](#tác-giả--đóng-góp)

## Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Backend API đang chạy (mặc định: `http://localhost:5000/api`)

### Các Bước Cài Đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd qatech-frontend
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình biến môi trường**

Tạo file `.env` trong thư mục gốc của dự án:

```env
VITE_API_URL=http://localhost:5000/api
```

Thay đổi URL nếu backend API của bạn chạy ở port khác.

4. **Chạy ứng dụng ở chế độ development**

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

5. **Build cho production**

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`.

6. **Preview build production**

```bash
npm run preview
```

### Scripts Có Sẵn

- `npm run dev`: Chạy development server với Vite
- `npm run build`: Build ứng dụng cho production
- `npm run preview`: Preview build production
- `npm run lint`: Chạy ESLint để kiểm tra code

## Hướng Dẫn Sử Dụng

### Cho Người Dùng

1. **Xem sản phẩm**: Truy cập trang chủ hoặc trang "Sản phẩm" để xem danh sách sản phẩm
2. **Tìm kiếm sản phẩm**: Sử dụng thanh tìm kiếm hoặc lọc theo danh mục
3. **Xem chi tiết**: Click vào sản phẩm để xem thông tin chi tiết và thông số kỹ thuật
4. **Build PC**: Sử dụng công cụ "Build PC" để tự xây dựng cấu hình máy tính
5. **Thêm vào giỏ hàng**: Click "Thêm vào giỏ" trên trang chi tiết sản phẩm
6. **Thanh toán**: Vào giỏ hàng, kiểm tra đơn hàng và tiến hành thanh toán qua VNPay
7. **Theo dõi đơn hàng**: Đăng nhập và vào "Đơn hàng của tôi" để xem lịch sử đơn hàng

### Cho Admin/Nhân Viên

1. **Đăng nhập**: Truy cập `/admin/dashboard` và đăng nhập với tài khoản admin/employee
2. **Dashboard**: Xem tổng quan về doanh số, đơn hàng, sản phẩm
3. **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm tại `/admin/products`
4. **Quản lý đơn hàng**: Xem và cập nhật trạng thái đơn hàng tại `/admin/orders`
5. **Quản lý người dùng**: Xem danh sách người dùng tại `/admin/users` (chỉ admin)
6. **Quản lý nhân viên**: Thêm, sửa, xóa nhân viên tại `/admin/staff` (chỉ admin)

### Thông Tin Đăng Nhập Test

*Lưu ý: Thông tin này chỉ dùng cho môi trường development. Vui lòng liên hệ admin để có thông tin đăng nhập.*

- **Admin**: `admin@qatech.com` / `admin123`
- **Employee**: `employee@qatech.com` / `employee123`
- **User**: Đăng ký tài khoản mới hoặc sử dụng tài khoản đã có

### Cấu Trúc Dự Án

```
qatech-frontend/
├── public/                 # File tĩnh
├── src/
│   ├── assets/            # Hình ảnh, styles
│   │   ├── images/        # Hình ảnh sử dụng trong dự án
│   │   └── styles/        # File CSS global
│   ├── components/        # Các component tái sử dụng
│   │   ├── admin/         # Component dành cho admin
│   │   └── ...            # Các component khác
│   ├── data/              # Dữ liệu tĩnh (logos, images)
│   ├── layouts/           # Layout components
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/             # Các trang của ứng dụng
│   │   ├── admin/         # Trang admin
│   │   └── ...            # Trang người dùng
│   ├── redux/             # Redux store và slices
│   │   ├── slices/        # Redux slices (auth, cart, product)
│   │   └── store.js       # Redux store configuration
│   ├── router/            # React Router configuration
│   │   ├── index.jsx      # Route definitions
│   │   └── ProtectedRoute.jsx  # Protected route component
│   ├── services/          # API services
│   │   └── api.js         # Axios instance và interceptors
│   ├── utils/             # Utility functions
│   │   ├── formatters.js  # Format số, ngày tháng
│   │   └── imageUrl.js    # Xử lý URL hình ảnh
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global CSS
├── .env                   # Biến môi trường
├── .gitignore            # Git ignore rules
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Dependencies và scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── README.md             # File này
```


### Tài Liệu Tham Khảo

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

### Công Cụ và Thư Viện

- **React Icons**: Thư viện icon
- **React Hot Toast**: Thông báo toast
- **Swiper**: Carousel component
- **Recharts**: Biểu đồ và charts

## Lời Cảm Ơn

### Tác Giả

**Trần Lê Quốc Anh**

Dự án được phát triển và duy trì bởi Trần Lê Quốc Anh.


### Cảm Ơn

Dự án này sử dụng các công nghệ và công cụ mã nguồn mở tuyệt vời:

**Công Nghệ & Thư Viện:**
- React, Vite, Redux Toolkit, React Router DOM
- Tailwind CSS, Axios, React Hot Toast
- Swiper, Recharts, React Icons

**Công Cụ Hỗ Trợ Phát Triển:**
- ChatGPT, Claude, Gemini
- GitHub Copilot, Cursor
- ESLint, PostCSS, Autoprefixer

**Tài Liệu & Hướng Dẫn:**
- Tài liệu chính thức của các framework và thư viện được sử dụng
- Cộng đồng React và JavaScript trên các diễn đàn và Stack Overflow

---

**Lưu ý**: Đây là dự án frontend, cần có backend API đang chạy để ứng dụng hoạt động đầy đủ. Đảm bảo backend đã được cấu hình và chạy trước khi sử dụng frontend.
