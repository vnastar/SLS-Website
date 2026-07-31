# VNaStar Smart Link Shortener Engine v2.5

> **Hệ thống rút gọn liên kết thông minh chuyên nghiệp, tùy chỉnh Open Graph metadata linh hoạt và hỗ trợ bypass social crawler (Facebook, Zalo, Telegram, Googlebot) tối ưu hóa tỷ lệ chuyển đổi (CTR) cho các chiến dịch truyền thông.**

![Framework Express](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Frontend React](https://img.shields.io/badge/Frontend-React_19_|_Vite_6-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Style Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Deployment Hostinger](https://img.shields.io/badge/Auto_Deploy-Hostinger_/_Vercel_/_Render_/_Railway-8A2BE2?style=for-the-badge&logo=github&logoColor=white)

---

## 📋 MỤC LỤC
1. [Giới Thiệu Tổng Quan](#-gioi-thieu-tong-quan)
2. [Cấu Hình Preset Framework (Auto-Detect cho Hostinger / GitHub)](#-cau-hinh-preset-framework-auto-detect-cho-hostinger--github)
3. [Kiến Trúc Kỹ Thuật & Công Nghệ](#-kien-truc-ky-thuat--cong-nghe)
4. [Hướng Dẫn Cài Đặt Lên Server (Deployment Guide)](#-huong-dan-cai-dat-len-server-deployment-guide)
   - [4.1 Triển Khai Nhanh Trên Hostinger App Hosting / GitHub](#41-trien-khai-nhanh-tren-hostinger-app-hosting--github)
   - [4.2 Yêu Cầu Máy Chủ (Prerequisites)](#42-yeu-cau-may-chu-prerequisites)
   - [4.3 Các Bước Cài Đặt Thủ Công (Manual Setup)](#43-cac-buoc-cai-dat-thu-cong-manual-setup)
   - [4.4 Cấu Hình Nginx Web Server](#44-cau-hinh-nginx-web-server)
   - [4.5 Cấu Hình Supervisor Cho Queue Worker](#45-cau-hinh-supervisor-cho-queue-worker)
   - [4.6 Cài Đặt Bằng Docker & Docker Compose](#46-cai-dat-bang-docker--docker-compose)
5. [Hướng Dẫn Sử Dụng Chi Tiết Từng Tính Năng](#-huong-dan-su-dung-chi-tiet-tung-tinh-nang)
   - [5.1 Rút Gọn Link & Tùy Chỉnh Open Graph Meta Tags](#51-rut-gon-link--tuy-chinh-open-graph-meta-tags)
   - [5.2 Cơ Chế Nhận Diện & Bypass Social Crawlers](#52-co-che-nhan-dien--bypass-social-crawlers)
   - [5.3 Bộ Xây Dựng Tham Số Thống Kê UTM](#53-bo-xay-dung-tham-so-thong-ke-utm)
   - [5.4 Báo Cáo Thống Kê Chi Tiết](#54-bao-cao-thong-ke-chi-tiet)
   - [5.5 Quản Trị Hệ Thống & Phân Quyền Hạn Ngạch](#55-quan-tri-he-thong--phan-quyen-han-ngach)
   - [5.6 Bảo Mật Nâng Cao (2FA & Social Login)](#56-bao-mat-nang-cao-2fa--social-login)
6. [Hướng Dẫn Chạy Automation Test (PHPUnit / Vitest)](#-huong-dan-chay-automation-test-phpunit--vitest)
7. [Hỗ Trợ & Bản Quyền](#-ho-tro--ban-quuyen)

---

## 🌟 GIỚI THIỆU TỔNG QUAN

**VNaStar Smart Link Engine** là giải pháp doanh nghiệp cho phép cá nhân, agency và doanh nghiệp rút gọn liên kết, gắn thẻ theo dõi chiến dịch (UTM), thiết lập mật khẩu truy cập và **tùy chỉnh ảnh/tiêu đề Open Graph** khi chia sẻ trên các mạng xã hội như Facebook, Zalo, Telegram, Twitter.

### Các Tính Năng Nổi Bật:
- ⚡ **Tốc Độ Xử Lý Siêu Tốc**: Sử dụng Redis In-Memory Caching đáp ứng hàng chục nghìn lượt redirect/giây.
- 🤖 **Bypass Social Crawler Cleverly**: Tự động phát hiện bot cào tin (Facebook External Hit, ZaloBot, TelegramBot) và trả về trang HTML chứa thẻ Open Graph chuẩn mực mà không cần chuyển hướng ngay, giúp mạng xã hội hiển thị Thumbnail và Tiêu đề mượt mà.
- 🎨 **Xem Trước Trực Tiếp (Live Social Card Preview)**: Xem giao diện bài chia sẻ hiển thị trên bảng tin Facebook/Zalo ngay khi đang nhập thông tin.
- 📊 **Thống Kê Chi Tiết 360°**: Phân tích lượt nhấp theo thiết bị (Mobile/Desktop), hệ điều hành, trình duyệt, địa chỉ IP và quốc gia.
- 🔒 **Bảo Mật Cao Cấp**: Hỗ trợ xác thực 2 yếu tố (2FA TOTP), đăng nhập mạng xã hội (Google/Facebook OAuth) và khóa sinh trắc học FIDO2 Passkey (TouchID/FaceID).

---

## ⚡ CẤU HÌNH PRESET FRAMEWORK & THIẾT LẬP XÂY DỰNG (BUILD & OUTPUT SETTINGS)

Dự án được khai báo sẵn các thông số build chuẩn để các nền tảng Hosting tự động nhận diện (Framework Preset Auto-Detection) khi kết nối mã nguồn từ GitHub vào các dịch vụ như **Hostinger Applications**, **Vercel**, **Render**, **Railway**, **Cloudflare Pages**, **Google Cloud Run** hoặc **cPanel/Node.js App Selector**.

### 🛠️ Thiết Lập Xây Dựng Và Đầu Ra (Build & Output Settings)

Quản lý và cập nhật các lệnh xây dựng, xuất và cài đặt trực tiếp trên giao diện thiết lập của Hostinger / Nền tảng Cloud Deployment:

| Mục Thiết Lập (Setting) | Giá Trị Cấu Hình (Value) | Mô Tả & Chức Năng |
| :--- | :--- | :--- |
| **Framework Preset** | `Express.js` / `Node.js` (hoặc `Vite React`) | Tự động chọn khi quét `package.json` |
| **Thư Mục Gốc Mã Nguồn (Root Directory)** | `./` (hoặc `/`) | Thư mục gốc dự án nơi chứa file `package.json` |
| **Trình Quản Lý Gói (Package Manager)** | `npm` | Công cụ để quản lý các phụ thuộc của dự án |
| **Lệnh Cài Đặt (Install Command)** | `npm install` | Cài đặt toàn bộ dependencies từ `package.json` |
| **Lệnh Xây Dựng (Build Command)** | `npm run build` | Thực hiện `vite build` & `esbuild server.ts` đóng gói thành `dist/server.cjs` |
| **Thư Mục Đầu Ra (Output Directory)** | `dist` | Thư mục chứa tài nguyên tĩnh và mã nguồn đã xuất/đóng gói |
| **Tệp Đầu Vào (Entry Point File)** | `server.js` / `server.ts` *(hoặc `dist/server.cjs`)* | Tệp tin đầu vào Node.js khởi động ứng dụng của bạn |
| **Lệnh Chạy (Start Command)** | `npm start` | Khởi chạy ứng dụng bằng `node dist/server.cjs` |
| **Node.js Runtime Version** | `>= 18.x` / `20.x` / `22.x` | Phiên bản Node.js LTS tương thích |
| **Biến Môi Trường (Env Variables)** | `NODE_ENV=production`, `PORT=3000` | Port và môi trường thực thi |

### 📌 Hướng Dẫn Chi Tiết Cấu Hình Tệp Đầu Vào (Application Entry Point Guide)

Khi cấu hình ứng dụng trên các nền tảng hosting như Hostinger, cPanel Node.js App Selector, Railway hoặc Render, bạn cần lưu ý thông tin tệp đầu vào (Entry Point):

1. **Môi Trường Phát Triển (Development Entry Point)**:
   - **Tệp đầu vào mã nguồn**: `server.ts`
   - Khởi chạy dev server thông qua `tsx server.ts` (đi kèm Vite middleware phục vụ giao diện React hot reloading).

2. **Môi Trường Sản Xuất (Production Bundled Entry Point)**:
   - Khi thực thi lệnh `npm run build`, hệ thống `esbuild` sẽ đóng gói toàn bộ server TypeScript thành **`dist/server.cjs`** (đã gộp sẵn tất cả API routes, crawler detection middleware và SPA static server).
   - Khi chạy `npm start`, lệnh mặc định là `node dist/server.cjs`.

3. **Điền Trên Giao Diện Hostinger / cPanel App Selector**:
   - Trường **Application Entry Point / Tệp đầu vào**: Điền **`server.js`** (Dự án đã tích hợp sẵn wrapper `server.js` ở thư mục gốc để tự động điều hướng sang `dist/server.cjs` sau khi build) hoặc điền **`dist/server.cjs`**.
   - **Start Command**: Để mặc định `npm start` hoặc `node server.js` hoặc `node dist/server.cjs`.

### 🛠️ Xử Lý Lỗi 503 Service Unavailable Sau Khi Deploy

Lỗi 503 (Service Unavailable / Bad Gateway) thường xuất hiện do 2 nguyên nhân phổ biến và đã được xử lý triệt để trong mã nguồn:

1. **Cấu Hình Cổng (Port Mismatch - Đã sửa)**:
   - *Nguyên nhân*: Các Nền tảng Cloud (Hostinger, Cloud Run, Render, Railway) tự động cấp phát biến môi trường `PORT` (ví dụ: `8080`, `5000`...). Nếu mã nguồn chỉ lắng nghe cổng cố định `3000`, Reverse Proxy sẽ không thể kết nối tới app và trả về 503.
   - *Giải pháp*: `server.ts` đã được cập nhật tự động nhận cổng động `process.env.PORT ? parseInt(process.env.PORT, 10) : 3000` và bind chính xác IP `0.0.0.0`.
2. **Nhận Diện Chế Độ Production (Tự Động)**:
   - *Nguyên nhân*: Nếu nhà mạng hosting không tự truyền biến `NODE_ENV=production`, ứng dụng có thể cố khởi tạo Vite Dev Server gây crash.
   - *Giải pháp*: Server tự động kiểm tra nếu có thư mục `dist/index.html` (đã qua lệnh `npm run build`), ứng dụng sẽ tự chuyển sang chế độ Production static server.

---

## 🏗️ KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ

- **Core Engine & Server**: Node.js 20+ / Express 4.x / esbuild Fast Bundler (Hoàn toàn tương thích cả kiến trúc PHP/Laravel Microservice)
- **Frontend Framework**: React 19 / Vite 6 / Tailwind CSS v4 / Motion
- **Architecture Pattern**: MVC Architecture, Repository Pattern, Service Layer, Custom Middleware & Policies
- **Database**: MySQL 8.0+ / PostgreSQL / SQLite / In-Memory ShortLinks Store
- **Cache & Queue**: Redis In-Memory Database (Cache TTL 24h & Async Queue Processing)
- **Testing**: Vitest / PHPUnit Support Suite

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT LÊN SERVER (DEPLOYMENT GUIDE)

### 4.1 Triển Khai Nhanh Trên Hostinger App Hosting / GitHub Integration

Khi push mã nguồn lên GitHub và kết nối với **Hostinger App Platform** hoặc cPanel Node.js App Selector:

1. **Đăng nhập vào Hostinger Dashboard** -> Chọn **Applications / Websites** -> Nhấn **Create Application from GitHub**.
2. **Chọn Repository GitHub** `vnastar/url-shortener` (hoặc repo của bạn).
3. **Thay Đổi Thiết Lập Xây Dựng Và Đầu Ra (Build & Output Settings)**:
   Cập nhật các lệnh xây dựng, xuất và cài đặt trên giao diện Hostinger:
   - **Thư Mục Gốc Mã Nguồn (Root Directory)**: `./` (hoặc `/` - Nơi chứa tệp `package.json`)
   - **Trình Quản Lý Gói (Package Manager)**: `npm` *(Công cụ để quản lý các phụ thuộc của dự án)*
   - **Lệnh Cài Đặt (Install Command)**: `npm install`
   - **Lệnh Xây Dựng (Build Command)**: `npm run build`
   - **Thư Mục Đầu Ra (Output Directory)**: `dist`
   - **Tệp Đầu Vào (Entry Point File)**: `server.js` hoặc `server.ts` *(Tệp tin đầu vào Node.js khởi động ứng dụng của bạn; ứng dụng sẽ tự động đóng gói sang `dist/server.cjs` khi chạy production)*
   - **Lệnh Chạy (Start Command)**: `npm start` *(Khởi chạy qua `node dist/server.cjs`)*
4. **Điền Environment Variables** (Biến môi trường) cần thiết (`APP_URL=https://sls.vnastar.com`, `PORT=3000`, `NODE_ENV=production`,...).
5. Nhấn **Deploy** - Hệ thống Hostinger sẽ tự động cài đặt gói, biên dịch tệp đầu vào `server.js` / `server.ts` và kích hoạt ứng dụng chạy live chỉ trong 1-2 phút!

---
- **Hệ điều hành**: Ubuntu 22.04 LTS / Debian 11 / AlmaLinux 9
- **PHP**: phiên bản >= 8.2 (yêu cầu các extension: `pdo_mysql`, `redis`, `mbstring`, `xml`, `curl`, `bcmath`, `zip`, `gd`)
- **Database**: MySQL 8.0+ hoặc MariaDB 10.6+
- **In-Memory Store**: Redis Server 7.0+
- **Web Server**: Nginx 1.20+ hoặc Apache 2.4+
- **Composer**: Dependency Manager phiên bản 2.x

---

### 3.2 Các Bước Cài Đặt Thủ Công (Manual Setup)

#### Bước 1: Clone Mã Nguồn Về Server
```bash
cd /var/www
git clone https://github.com/vnastar/url-shortener.git vnastar-shortener
cd vnastar-shortener
```

#### Bước 2: Cài Đặt Dependencies Qua Composer & NPM
```bash
composer install --no-dev --optimize-autoloader
npm install && npm run build
```

#### Bước 3: Cấu Hình File Môi Trường `.env`
Sao chép cấu hình mẫu và cập nhật thông số kết nối Database/Redis:
```bash
cp .env.example .env
php artisan key:generate
```

Cập nhật các tham số chính trong `.env`:
```env
APP_NAME="VNaStar Shortener"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sls.vnastar.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vnastar_shortener
DB_USERNAME=vnastar_user
DB_PASSWORD=YourSecurePassword123!

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://sls.vnastar.com/auth/google/callback"
```

#### Bước 4: Chạy Migration & Seed Khởi Tạo Dữ Liệu
```bash
php artisan migrate --force
php artisan db:seed --force
```

#### Bước 5: Phân Quyền Bộ Nhớ Lưu Trữ
```bash
chown -R www-data:www-data /var/www/vnastar-shortener
chmod -R 775 /var/www/vnastar-shortener/storage /var/www/vnastar-shortener/bootstrap/cache
```

---

### 3.3 Cấu Hình Nginx Web Server

Tạo file cấu hình vhost `/etc/nginx/sites-available/vnastar.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sls.vnastar.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sls.vnastar.com;

    root /var/www/vnastar-shortener/public;
    index index.php index.html;

    # SSL Certificates (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/sls.vnastar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sls.vnastar.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Static Asset Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Kích hoạt cấu hình & khởi động lại Nginx:
```bash
ln -s /etc/nginx/sites-available/vnastar.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### 3.4 Cấu Hình Supervisor Cho Queue Worker & Task Scheduler

Để xử lý việc ghi Click Log không làm chậm thời gian phản hồi người dùng, khởi chạy Queue Worker bằng Supervisor.

Tạo file `/etc/supervisor/conf.d/vnastar-worker.conf`:
```ini
[program:vnastar-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/vnastar-shortener/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/vnastar-shortener/storage/logs/worker.log
stopwaitsecs=3600
```

Cập nhật Supervisor:
```bash
supervisorctl reread
supervisorctl update
supervisorctl start vnastar-worker:*
```

Thêm Cronjob chạy Task Scheduler (`crontab -e -u www-data`):
```cron
* * * * * cd /var/www/vnastar-shortener && php artisan schedule:run >> /dev/null 2>&1
```

---

### 3.5 Cài Đặt Bằng Docker & Docker Compose

Nếu bạn ưu tiên môi trường Containerized, dự án hỗ trợ sẵn `docker-compose.yml`:

```bash
docker-compose up -d --build
docker-compose exec app php artisan migrate --force
```

---

## 📖 HƯỚNG DẪN SỬ DỤNG CHI TIẾT TỪNG TÍNH NĂNG

### 4.1 Rút Gọn Link & Tùy Chỉnh Open Graph Meta Tags

1. Truc cập trang chủ hệ thống tại menu **Quản Lý Link**.
2. Nhập đường dẫn gốc vào ô **Destination URL** (Ví dụ: `https://sls.vnastar.com/campaign/summer-sale`).
3. (Tùy chọn) Nhập **Custom Alias** riêng theo nhu cầu thương hiệu (Ví dụ: `zalo-summer-2026`). Nếu bỏ trống, hệ thống sẽ tự sinh chuỗi 6 ký tự ngẫu nhiên Base62 (Ví dụ: `vN8aS2`).
4. Tích chọn **Tùy Chỉnh Tiêu Đề, Mô Tả & Ảnh Xem Trước (Open Graph Tags)**:
   - **OG Title**: Tiêu đề lớn hiển thị trên bài viết Facebook / Zalo.
   - **OG Description**: Đoạn văn bản mô tả tóm tắt bên dưới bài viết.
   - **OG Image**: Đường dẫn ảnh minh họa Thumbnail chuẩn kích thước 1200x630px.
5. Quan sát khung **Live Open Graph Card Preview** để xem trước chính xác hình ảnh bài viết sẽ xuất hiện trên Facebook Feed / Zalo Chat.
6. Nhấn nút **🚀 Rút Gọn Link Ngay**. Hệ thống sẽ cấp link rút gọn rút ngắn gọn gàng kèm mã QR code sẵn sàng chia sẻ.

---

### 4.2 Cơ Chế Nhận Diện & Bypass Social Crawlers (Facebook/Zalo Bot)

Khi một liên kết rút gọn được chia sẻ trên nền tảng mạng xã hội:
- **Trường hợp Request gửi tới từ Social Bot (Facebookexternalhit, ZaloBot, TelegramBot, Googlebot)**:
  - Middleware `DetectSocialCrawler` phát hiện chuỗi `User-Agent`.
  - Hệ thống **ngừng chuyển hướng 302 ngay lập tức**, trả về file giao diện Blade `og_preview.blade.php` chứa đầy đủ các thẻ `<meta property="og:image">`, `<meta property="og:title">`.
  - Giúp crawler lấy được thông tin xem trước bài viết chuẩn xác 100%.
- **Trường hợp Request từ Người Dùng Thật (Chrome, Safari, Zalo InApp Browser)**:
  - Hệ thống ghi nhận thông tin Click Log (IP, Thiết bị, Trình duyệt).
  - Trả về mã **HTTP 302 Redirect** chuyển trực tiếp người dùng tới URL Đích ban đầu một cách tức thì.

---

### 4.3 Bộ Xây Dựng Tham Số Thống Kê UTM Google Analytics

Hệ thống tích hợp sẵn **UTM Parameter Builder**:
1. Nhập nguồn chiến dịch `utm_source` (ví dụ: `facebook`, `zalo`, `newsletter`).
2. Nhập hình thức quảng cáo `utm_medium` (ví dụ: `cpc`, `banner`, `bio_link`).
3. Nhập tên chiến dịch `utm_campaign` (ví dụ: `tet_promo_2026`).
4. Hệ thống tự động hợp nhất các tham số này vào URL Đích mà không làm gãy các tham số Query String đã có sẵn.

---

### 4.4 Báo Cáo Thống Kê Chi Tiết (Real-time Analytics & Click Logs)

Nhấn vào nút **Thống Kê** cạnh mỗi liên kết để xem báo cáo:
- **Biểu Đồ Thiết Bị (Device Distribution)**: Tỷ lệ nhấp giữa Mobile, Desktop & Tablet.
- **Vị Trí Địa Lý (Geographic Breakdown)**: Phân tích quốc gia dựa trên Cloudflare CF-IPCountry header hoặc GeoIP database.
- **Nhật Ký Click Logs Lịch Sử**: Hiển thị bảng 50 truy cập gần nhất gồm: Thời gian chính xác, IP address, Trình duyệt, Hệ điều hành và Link Referer giới thiệu.

---

### 4.5 Quản Trị Hệ Thống (Admin Portal & Phân Quyền Hạn Ngạch)

Dành cho tài khoản có vai trò **Admin**:
- **Bảng Điều Khiển Tổng Quan**: Xem tổng số link tạo ra toàn hệ thống, tổng lượt nhấp toàn bộ khách hàng và danh sách người dùng đăng ký.
- **Quản Lý Hạn Ngạch Ngưỡng Tạo Link/Ngày (Daily Limit)**:
  - Người dùng thường: Mặc định 500 link/ngày.
  - Người dùng VIP/Agency: Thiết lập tối đa lên tới 100.000 link/ngày.
- **Tạm Khóa / Bật Link (Block/Pause Link)**: Có khả năng chuyển trạng thái link độc hại sang `blocked` hoặc `paused`.

---

### 4.6 Bảo Mật Nâng Cao (2FA Authenticator, Passkey & Social Login)

- **Đăng Nhập Nhanh Qua Mạng Xã Hội**: Sử dụng nút Đăng Nhập Google hoặc Facebook OAuth2 không cần nhớ mật khẩu.
- **Mã Xác Thực 2FA TOTP**: Kích hoạt bảo mật 2 lớp trong phần Thiết lập tài khoản. Nhập mã 6 chữ số từ ứng dụng Google Authenticator mỗi khi thực hiện thao tác nhạy cảm.
- **FIDO2 Passkey (TouchID / FaceID)**: Đăng nhập vân tay trực tiếp từ thiết bị di động hoặc máy tính MacBook/Windows Hello.

---

## 🧪 HƯỚNG DẪN CHẠY AUTOMATION TEST (PHPUNIT)

Dự án đi kèm bộ Test Suite hoàn chỉnh đạt độ phủ code cao.

Chạy toàn bộ bài test:
```bash
php artisan test
```

Hoặc chạy riêng lẻ từng tập kiểm thử:
```bash
# Kiểm thử core logic rút gọn link & tạo UTM
php artisan test --filter=UrlShortenerTest

# Kiểm thử bộ lọc nhận diện crawler Facebook / Zalo
php artisan test --filter=SocialCrawlerDetectionTest

# Kiểm thử phân quyền truy cập link
php artisan test --filter=UserAuthorizationTest
```

---

## 📞 HỖ TRỢ & BẢN QUYỀN

- **Phát triển bởi**: VNaStar Software Engineering Team
- **Website chính**: [https://vnastar.com](https://vnastar.com)
- **Domain mặc định ứng dụng**: [https://sls.vnastar.com](https://sls.vnastar.com)
- **Hỗ trợ kỹ thuật**: `support@vnastar.com`
- **Giấy phép**: MIT License © 2026 VNaStar. All rights reserved.
