import React from 'react';
import { 
  BookOpen, 
  Wrench, 
  Server, 
  Terminal, 
  Container, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  LogIn, 
  Sparkles,
  Link as LinkIcon,
  Bot,
  BarChart3,
  Globe
} from 'lucide-react';

interface ReadmeViewerProps {
  isInstalled: boolean;
  onGoToInstall: () => void;
  onGoToLogin: () => void;
}

export function ReadmeViewer({ isInstalled, onGoToInstall, onGoToLogin }: ReadmeViewerProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Welcome / Status Alert Banner */}
      {!isInstalled ? (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                Khởi Tạo Lần Đầu — Chưa Cài Đặt
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                Chào Mừng Bạn Đến Với VNaStar Smart Link Shortener!
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Hệ thống đang ở trạng thái ban đầu và chưa được cài đặt tài khoản Admin hay cấu hình CSDL. Bạn có thể xem tài liệu hướng dẫn bên dưới, hoặc truy cập ngay đường dẫn <code className="bg-slate-800 text-amber-300 font-mono px-2 py-0.5 rounded border border-slate-700">/install</code> để bắt đầu quy trình cài đặt tự động.
              </p>
            </div>

            <button
              onClick={onGoToInstall}
              className="w-full md:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-3 text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Wrench className="w-5 h-5" />
              Bắt Đầu Cài Đặt Ngay (/install)
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Hệ Thống Đã Được Cài Đặt
            </div>
            <h2 className="text-xl font-bold">VNaStar Smart Link Shortener Sẵn Sàng</h2>
            <p className="text-xs text-slate-300">
              Bạn có thể đăng nhập tài khoản Quản trị viên để quản lý liên kết, chỉnh sửa Open Graph Metadata và theo dõi báo cáo.
            </p>
          </div>

          <button
            onClick={onGoToLogin}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" />
            Đăng Nhập Ngay
          </button>
        </div>
      )}

      {/* Main README Documentation Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-amber-400 rounded-lg font-mono text-xs font-semibold">
              Express.js + React 19
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg font-mono text-xs font-semibold">
              Node.js LTS / TypeScript
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-blue-400 rounded-lg font-mono text-xs font-semibold">
              Tailwind CSS v4
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-purple-400 rounded-lg font-mono text-xs font-semibold">
              Hostinger / cPanel Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              HƯỚNG DẪN SỬ DỤNG & TÀI LIỆU HỆ THỐNG (README)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            VNaStar Smart Link Shortener là giải pháp doanh nghiệp rút gọn liên kết thông minh, tùy chỉnh Open Graph metadata linh hoạt và hỗ trợ bypass social crawler (Facebook, Zalo, Telegram, Googlebot) tối ưu hóa tỷ lệ chuyển đổi (CTR) cho các chiến dịch truyền thông.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            1. Các Tính Năng Nổi Bật Của Hệ Thống
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Zap className="w-4 h-4" />
                Tốc Độ Redirect Siêu Tốc
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tối ưu hoá bộ nhớ Redis In-Memory caching & File Persistence cho phép chuyển hướng liên kết cực nhanh, xử lý hàng chục nghìn request/giây mà không bị ngắt kết nối.
              </p>
            </div>

            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Bot className="w-4 h-4" />
                Bypass Social Crawler Thông Minh
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tự động phát hiện bot cào tin (Facebook External Hit, ZaloBot, TelegramBot) để trả về file HTML chứa thẻ Open Graph chuẩn mực mà không gây lỗi thumbnail khi chia sẻ.
              </p>
            </div>

            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Globe className="w-4 h-4" />
                Live Open Graph Preview
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Xem trước giao diện bài viết hiển thị trực tiếp trên Bảng tin Facebook và khung chat Zalo ngay trong lúc thiết lập tiêu đề, mô tả và hình ảnh xem trước.
              </p>
            </div>

            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <BarChart3 className="w-4 h-4" />
                Thống Kê Real-Time & UTM Tracker
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Phân tích lượt nhấp chi tiết theo thiết bị, trình duyệt, địa chỉ IP và tích hợp công cụ xây dựng tham số UTM Google Analytics chuẩn mực.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            2. Quy Trình Cài Đặt Hệ Thống (/install)
          </h3>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-amber-400 block text-sm mb-0.5">Truy Cập Trang Cài Đặt (/install)</strong>
                  Truy cập địa chỉ domain của bạn kèm hậu tố <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">/install</code> hoặc bấm nút "Bắt Đầu Cài Đặt Ngay".
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-amber-400 block text-sm mb-0.5">Kiểm Tra Môi Trường & Kết Nối CSDL</strong>
                  Wizard sẽ tự động kiểm tra tương thích PHP, Node.js runtime, quyền ghi thư mục storage và cho phép bạn cấu hình thông số kết nối Database.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-amber-400 block text-sm mb-0.5">Tạo Tài Khoản Quản Trị (Admin)</strong>
                  Nhập Email và Mật Khẩu tài khoản Admin để truy cập toàn bộ quyền quản trị hệ thống sau khi hoàn tất.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-amber-400 block text-sm mb-0.5">Đăng Nhập & Khai Thác Ứng Dụng</strong>
                  Sau khi bấm "Hoàn Tất Cài Đặt", bạn có thể đăng nhập bằng tài khoản vừa tạo để quản lý link, xem báo cáo và kiểm tra crawler.
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onGoToInstall}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                Đến Giao Diện Cài Đặt Ngay Bằng Link /install
              </button>
            </div>
          </div>
        </div>

        {/* Deploy & Framework Preset */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            3. Hướng Dẫn Deploy Lên Hostinger & cPanel App Selector
          </h3>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
            <p>
              Dự án đã tích hợp sẵn wrapper <code className="text-amber-300 font-mono">server.js</code> và kịch bản đóng gói tự động <code className="text-amber-300 font-mono">npm run build</code>. Khi deploy lên Hostinger, bạn thiết lập các thông số sau:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Entry Point File:</span>
                <span className="text-amber-300 font-bold">server.js</span> (hoặc dist/server.cjs)
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Start Command:</span>
                <span className="text-amber-300 font-bold">npm start</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Build Command:</span>
                <span className="text-amber-300 font-bold">npm run build</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Node.js Version:</span>
                <span className="text-amber-300 font-bold">Node.js 20.x / 22.x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            VNaStar Smart Link Shortener Engine v2.5 • Bản quyền © 2026 VNaStar Media
          </div>

          <div className="flex items-center gap-3">
            {!isInstalled ? (
              <button
                onClick={onGoToInstall}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                Truy Cập /install
              </button>
            ) : (
              <button
                onClick={onGoToLogin}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Đăng Nhập Quản Trị
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
