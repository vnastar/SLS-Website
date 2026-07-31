import React, { useState } from 'react';
import { 
  Layout, 
  Code2, 
  Sparkles, 
  Check, 
  Copy, 
  Eye, 
  Monitor, 
  Smartphone, 
  Share2, 
  Bot, 
  Zap, 
  Layers, 
  Terminal,
  FileCode,
  Palette
} from 'lucide-react';

export function FrontendBladeInspector() {
  const [activeTab, setActiveTab] = useState<'blade' | 'alpine' | 'preview' | 'css'>('preview');

  // Preview State
  const [previewOgTitle, setPreviewOgTitle] = useState('Chiến Dịch Truyền Thông Hè VNaStar 2026');
  const [previewOgDesc, setPreviewOgDesc] = useState('Bùng nổ doanh số với hệ thống rút gọn link thông minh tối ưu Facebook / Zalo.');
  const [previewOgImage, setPreviewOgImage] = useState('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80');
  const [previewAlias, setPreviewAlias] = useState('vnastar-summer');

  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layout className="w-4 h-4" />
            Bước 6: Frontend Layer (Blade Templates, Tailwind CSS & AlpineJS Reactivity)
          </div>
          <h2 className="text-xl font-bold">Giao Diện Người Dùng & Phản Hồi Trực Tiếp</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kết hợp Blade View, Tailwind CSS v3 & AlpineJS v3 tạo trải nghiệm mượt mà không cần full SPA reload.
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'preview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('blade')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'blade' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Blade Layouts
          </button>
          <button
            onClick={() => setActiveTab('alpine')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'alpine' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            AlpineJS Logic
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'css' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Tailwind Theme
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE INTERACTIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Xem Trước Trực Tiếp Thẻ Thẻ Open Graph Xem Trước Trên Bảng Tin Social Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Controls */}
              <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">OG Title (Tiêu Đề Thẻ)</label>
                  <input
                    type="text"
                    value={previewOgTitle}
                    onChange={e => setPreviewOgTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">OG Description (Mô Tả Thẻ)</label>
                  <textarea
                    rows={2}
                    value={previewOgDesc}
                    onChange={e => setPreviewOgDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">OG Image URL (Ảnh Thumbnail)</label>
                  <input
                    type="url"
                    value={previewOgImage}
                    onChange={e => setPreviewOgImage(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-300 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Link Alias</label>
                  <input
                    type="text"
                    value={previewAlias}
                    onChange={e => setPreviewAlias(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Social Feed Card Simulator */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Mô Phỏng Thẻ Hiển Thị Khi Khách Hàng Bật Bảng Tin Facebook / Zalo:
                </span>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                  <div className="h-44 bg-slate-800 overflow-hidden relative">
                    <img src={previewOgImage} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">VNASTAR.MEDIA</span>
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{previewOgTitle}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{previewOgDesc}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>/{previewAlias}</span>
                      <span className="text-emerald-400">Bypass Crawler: 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLADE LAYOUTS CODE */}
      {activeTab === 'blade' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Mã Nguồn Base Layout `/resources/views/layouts/app.blade.php`
            </h3>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
{`<!DOCTYPE html>
<html lang="vi" class="h-full bg-slate-950 font-sans antialiased text-slate-100">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Smart Link Shortener - VNaStar Media')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="h-full bg-slate-950 text-slate-100 flex flex-col">
    <!-- Top Navigation -->
    <header class="bg-slate-900 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="font-bold text-amber-400 text-lg">VNaStar Shortener</a>
            <span class="text-xs text-slate-400">{{ auth()->user()->name }}</span>
        </div>
    </header>

    <!-- Main Content Yield -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-6">
        @yield('content')
    </main>
</body>
</html>`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: ALPINEJS LOGIC */}
      {activeTab === 'alpine' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Kịch Bản Reactivity Bằng Alpine.js (`shortenerApp()`)
            </h3>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`function shortenerApp() {
    return {
        loading: false,
        showOgSettings: false,
        form: {
            destination_url: '',
            alias: '',
            og_title: '',
            og_description: '',
            og_image: '',
        },
        async submitCreateLink() {
            this.loading = true;
            // Gọi API POST /api/short-links
            const res = await fetch('/api/short-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.form)
            });
            this.loading = false;
        }
    }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: TAILWIND CSS CONFIG */}
      {activeTab === 'css' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Tailwind CSS Config Theme Extensions
            </h3>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
{`tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fffbe1',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    950: '#0f172a',
                }
            }
        }
    }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
