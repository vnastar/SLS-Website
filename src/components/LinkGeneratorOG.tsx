import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Link as LinkIcon, 
  Sparkles, 
  Share2, 
  Copy, 
  QrCode, 
  Download, 
  Eye, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Edit3,
  Trash2,
  Globe,
  Tag,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { ShortLink, OGMetadata } from '../types';

interface Props {
  onLinkCreated?: (link: ShortLink) => void;
}

export function LinkGeneratorOG({ onLinkCreated }: Props) {
  const [destinationUrl, setDestinationUrl] = useState('https://sls.vnastar.com/truyen-thong-so-2026');
  const [customSlug, setCustomSlug] = useState('vnastar-truyenthong');
  const [dailyLimit, setDailyLimit] = useState(50);
  const [createdToday, setCreatedToday] = useState(12);

  // Metadata states
  const [ogTitle, setOgTitle] = useState('🔥 VNaStar Media - Giải Pháp Rút Gọn Link & Tối Ưu Open Graph Meta Tags 2026');
  const [ogDescription, setOgDescription] = useState('Công cụ rút gọn link độc quyền từ VNaStar Media. Cho phép chỉnh sửa 100% thẻ Open Graph Metadata & Twitter Cards hiển thị chuẩn đẹp trên Facebook, Telegram, Discord, Zalo & Twitter.');
  const [ogImage, setOgImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [ogSiteName, setOgSiteName] = useState('VNaStar Media');
  const [twitterCard, setTwitterCard] = useState<'summary' | 'summary_large_image'>('summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [keywords, setKeywords] = useState('VNaStar Media, Link Shortener, Open Graph, Metadata Editor');
  const [author, setAuthor] = useState('VNaStar Media Engineering');
  const [metaRobots, setMetaRobots] = useState('index, follow');

  // Preview platform tab
  const [previewPlatform, setPreviewPlatform] = useState<'facebook' | 'telegram' | 'discord' | 'twitter' | 'zalo'>('facebook');
  
  // States for response
  const [createdLink, setCreatedLink] = useState<ShortLink | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample templates for quick auto-fill
  const sampleImages = [
    { label: 'Banner 1: Tech & Digital', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Banner 2: Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Banner 3: Marketing Growth', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Additional interactive states
  const [isScraping, setIsScraping] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState('');
  
  // Real-time link management state
  const [allLinks, setAllLinks] = useState<ShortLink[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchAllLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setAllLinks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAllLinks();
  }, []);

  // Auto-scrape Open Graph metadata from destination URL
  const handleScrapeMetadata = async () => {
    if (!destinationUrl) {
      setErrorMsg('Vui lòng nhập URL đích trước khi lấy thẻ Meta!');
      return;
    }
    setErrorMsg('');
    setScrapeMsg('');
    setIsScraping(true);

    try {
      const res = await fetch('/api/scrape-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: destinationUrl })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Lỗi khi tải thông tin từ URL!');
        return;
      }

      if (data.metadata) {
        if (data.metadata.og_title) setOgTitle(data.metadata.og_title);
        if (data.metadata.og_description) setOgDescription(data.metadata.og_description);
        if (data.metadata.og_image) setOgImage(data.metadata.og_image);
        if (data.metadata.og_site_name) setOgSiteName(data.metadata.og_site_name);
        if (data.metadata.keywords) setKeywords(data.metadata.keywords);
        if (data.metadata.author) setAuthor(data.metadata.author);
        setScrapeMsg('✅ Đã tự động trích xuất thành công thẻ Meta từ website gốc!');
        setTimeout(() => setScrapeMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ để trích xuất thẻ Meta!');
    } finally {
      setIsScraping(false);
    }
  };

  // AI Generate / Optimize Metadata with Gemini
  const handleAiEnhanceMetadata = async () => {
    if (!destinationUrl) {
      setErrorMsg('Vui lòng nhập URL đích!');
      return;
    }
    setErrorMsg('');
    setScrapeMsg('');
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/ai/enhance-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_url: destinationUrl,
          title: ogTitle,
          description: ogDescription
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Lỗi khi kết nối với AI Gemini!');
        return;
      }

      if (data.metadata) {
        if (data.metadata.og_title) setOgTitle(data.metadata.og_title);
        if (data.metadata.og_description) setOgDescription(data.metadata.og_description);
        if (data.metadata.keywords) setKeywords(data.metadata.keywords);
        if (data.metadata.twitter_title) setTwitterTitle(data.metadata.twitter_title);
        if (data.metadata.twitter_description) setTwitterDescription(data.metadata.twitter_description);
        setScrapeMsg('✨ AI Gemini đã tối ưu tiêu đề & mô tả thu hút lượt click cao!');
        setTimeout(() => setScrapeMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến Gemini AI!');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleDeleteLink = async (slug: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa link /r/${slug}?`)) return;
    try {
      const res = await fetch(`/api/links/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setAllLinks(prev => prev.filter(l => l.slug !== slug));
        if (createdLink?.slug === slug) setCreatedLink(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLink = async (slug: string) => {
    try {
      const res = await fetch(`/api/links/${slug}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setAllLinks(prev => prev.map(l => l.slug === slug ? data.link : l));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationUrl) {
      setErrorMsg('Vui lòng nhập URL đích!');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    const payload = {
      slug: customSlug.trim() || undefined,
      destination_url: destinationUrl,
      metadata: {
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        og_site_name: ogSiteName,
        twitter_card: twitterCard,
        twitter_title: twitterTitle || ogTitle,
        twitter_description: twitterDescription || ogDescription,
        twitter_image: twitterImage || ogImage,
        canonical_url: canonicalUrl || destinationUrl,
        keywords,
        author,
        meta_robots: metaRobots
      }
    };

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi tạo link');
        setIsLoading(false);
        return;
      }

      setCreatedLink(data);
      if (onLinkCreated) onLinkCreated(data);

      // Generate QR Code
      const shortUrl = `${window.location.origin}/r/${data.slug}`;
      const qrUrl = await QRCode.toDataURL(shortUrl, { width: 300, margin: 2 });
      setQrDataUrl(qrUrl);

      setCreatedToday(prev => prev + 1);
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối tới Server. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${createdLink?.slug || 'vnastar'}.png`;
    a.click();
  };

  const currentShortUrl = createdLink 
    ? `${window.location.origin}/r/${createdLink.slug}` 
    : `${window.location.origin}/r/${customSlug || 'vnastar-truyenthong'}`;

  return (
    <div className="space-y-8">
      {/* Top Banner & Daily Limit Indicator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Tạo Link Rút Gọn & Custom Metadata Open Graph
            </h2>
            <p className="text-xs text-slate-500">
              VNaStar Media Engine • Tối ưu chuyển đổi bài viết & chiến dịch Marketing
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-center justify-between sm:justify-end gap-4">
          <div>
            <div className="text-slate-500 text-[11px]">Giới hạn tạo link trong ngày</div>
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {createdToday} / {dailyLimit} link <span className="text-emerald-500 text-[10px] font-mono">(Reset 00:00)</span>
            </div>
          </div>
          <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all" 
              style={{ width: `${(createdToday / dailyLimit) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCreateLink} className="space-y-6">
            {/* Core Link Inputs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                1. Thông tin Link Gốc & Slug
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              {scrapeMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  {scrapeMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Đích (Destination URL) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://domain.com/bai-viet-chi-tiet"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeMetadata}
                    disabled={isScraping || !destinationUrl}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50 transition-colors"
                    title="Tự động trích xuất thẻ Meta từ đường dẫn gốc"
                  >
                    {isScraping ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        Đang lấy...
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        Lấy Meta Gốc
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Slug (Đường dẫn rút gọn tùy chỉnh)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-xs text-slate-500 font-mono">
                    {window.location.host}/r/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="vnastar-truyenthong"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-r-xl text-sm font-mono text-amber-600 dark:text-amber-400 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Để trống để hệ thống tự sinh ngẫu nhiên 6 ký tự.</p>
              </div>
            </div>

            {/* Metadata Editor */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  2. Open Graph & Twitter Cards Metadata Editor
                </h3>
                <button
                  type="button"
                  onClick={handleAiEnhanceMetadata}
                  disabled={isAiGenerating || !destinationUrl}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Sử dụng Gemini AI để tạo Tiêu đề & Mô tả Viral tăng tỷ lệ click (CTR)"
                >
                  {isAiGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      AI Đang viết...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Tối Ưu Với AI Gemini
                    </>
                  )}
                </button>
              </div>

              {/* OG Title */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    OG Title (Tiêu đề hiển thị chia sẻ)
                  </label>
                  <span className={`text-[10px] ${ogTitle.length > 60 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {ogTitle.length}/70 ký tự
                  </span>
                </div>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* OG Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    OG Description (Mô tả hiển thị)
                  </label>
                  <span className={`text-[10px] ${ogDescription.length > 150 ? 'text-amber-500' : 'text-slate-400'}`}>
                    {ogDescription.length}/200 ký tự
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OG Image URL (Ảnh Thumbnail)
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://domain.com/uploads/og-thumbnail.jpg"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
                />

                {/* Quick Sample Image Selectors */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400">Chọn mẫu nhanh:</span>
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOgImage(s.url)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[11px] text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced SEO Toggle & Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Site Name (og:site_name)
                  </label>
                  <input
                    type="text"
                    value={ogSiteName}
                    onChange={(e) => setOgSiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    value={twitterCard}
                    onChange={(e: any) => setTwitterCard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="summary_large_image">Summary Large Image (Ảnh Lớn)</option>
                    <option value="summary">Summary Small (Ảnh Nhỏ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Đang khởi tạo Smart Short Link...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  TẠO LINK RÚT GỌN & LƯU OPEN GRAPH METADATA
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Social Media Preview Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                <Eye className="w-4 h-4 text-amber-400" />
                Live Social Media Share Preview
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/30">
                VNaStar Bot Rendering Simulator
              </span>
            </div>

            {/* Platform Selector Buttons */}
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setPreviewPlatform('facebook')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewPlatform === 'facebook' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Facebook
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('telegram')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewPlatform === 'telegram' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Telegram
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('discord')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewPlatform === 'discord' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Discord
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('twitter')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewPlatform === 'twitter' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                X/Twitter
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('zalo')}
                className={`py-1.5 rounded-lg transition-all ${
                  previewPlatform === 'zalo' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Zalo
              </button>
            </div>

            {/* Simulated Share Card Display */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              {previewPlatform === 'facebook' && (
                <div className="bg-[#242526] rounded-lg border border-[#393a3b] overflow-hidden text-slate-100 font-sans shadow-md">
                  <div className="p-3 text-xs flex items-center gap-2 border-b border-[#393a3b]">
                    <div className="w-8 h-8 rounded-full bg-amber-500 font-bold text-slate-950 flex items-center justify-center text-xs">
                      VN
                    </div>
                    <div>
                      <div className="font-bold">VNaStar Media Official</div>
                      <div className="text-[10px] text-slate-400">Vừa xong • 🌐 Facebook Share</div>
                    </div>
                  </div>
                  <div className="p-3 text-xs text-slate-200">
                    Hãy truy cập bài viết truyền thông chính thức qua đường link bên dưới:
                    <span className="text-blue-400 underline block mt-1">{currentShortUrl}</span>
                  </div>
                  <div className="bg-[#1c1e21]">
                    <img 
                      src={ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'} 
                      alt="OG Preview" 
                      className="w-full h-48 object-cover"
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'; }}
                    />
                    <div className="p-3 bg-[#242526] border-t border-[#393a3b]">
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                        {ogSiteName || 'VNASTAR.MEDIA'}
                      </div>
                      <div className="font-bold text-sm text-slate-100 line-clamp-2 mt-0.5">
                        {ogTitle || 'Chưa nhập tiêu đề OG Title'}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {ogDescription || 'Chưa nhập mô tả OG Description'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewPlatform === 'telegram' && (
                <div className="bg-[#17212b] rounded-xl p-3 border border-[#2b5278]/40 space-y-2 text-xs">
                  <div className="text-slate-400 text-[10px]">📱 Telegram Web Page Preview</div>
                  <div className="border-l-2 border-sky-400 pl-3 space-y-1.5">
                    <div className="font-bold text-sky-400">{ogSiteName || 'VNaStar Media'}</div>
                    <div className="font-bold text-slate-100 text-sm">{ogTitle}</div>
                    <p className="text-slate-300 text-xs line-clamp-3">{ogDescription}</p>
                    <img 
                      src={ogImage} 
                      alt="Telegram preview" 
                      className="w-full h-40 object-cover rounded-lg mt-2"
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'; }}
                    />
                  </div>
                </div>
              )}

              {previewPlatform === 'discord' && (
                <div className="bg-[#2f3136] rounded-lg p-3 border-l-4 border-indigo-500 text-xs space-y-2">
                  <div className="font-bold text-indigo-400 text-[11px]">{ogSiteName || 'VNaStar Media Bot'}</div>
                  <div className="font-bold text-slate-100 text-sm">{ogTitle}</div>
                  <p className="text-slate-300 text-xs line-clamp-2">{ogDescription}</p>
                  <img 
                    src={ogImage} 
                    alt="Discord embed" 
                    className="w-full h-44 object-cover rounded-md"
                    onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'; }}
                  />
                </div>
              )}

              {previewPlatform === 'twitter' && (
                <div className="bg-black border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <img 
                    src={twitterImage || ogImage} 
                    alt="Twitter Card" 
                    className="w-full h-44 object-cover"
                    onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'; }}
                  />
                  <div className="p-3 bg-slate-900 border-t border-slate-800">
                    <div className="text-[10px] text-slate-400 font-mono">{ogSiteName || 'sls.vnastar.com'}</div>
                    <div className="font-bold text-slate-100 mt-0.5">{twitterTitle || ogTitle}</div>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-1">{twitterDescription || ogDescription}</p>
                  </div>
                </div>
              )}

              {previewPlatform === 'zalo' && (
                <div className="bg-[#0068ff]/10 border border-[#0068ff]/30 rounded-xl p-3 text-xs space-y-2">
                  <div className="text-[#0068ff] font-bold text-[11px] flex items-center justify-between">
                    <span>Zalo Official Link Preview</span>
                    <span className="text-[10px]">VNaStar Media</span>
                  </div>
                  <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    <img src={ogImage} alt="Zalo Preview" className="w-full h-36 object-cover" />
                    <div className="p-2.5">
                      <div className="font-bold text-slate-100">{ogTitle}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{ogDescription}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Short Link & QR Box */}
            {createdLink && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Link Rút Gọn Tạo Thành Công!
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Slug: {createdLink.slug}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input 
                    type="text" 
                    readOnly 
                    value={currentShortUrl}
                    className="w-full bg-transparent text-amber-300 font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(currentShortUrl)}
                    className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded flex items-center gap-1 text-[11px] shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã sao chép' : 'Sao chép'}
                  </button>
                </div>

                {qrDataUrl && (
                  <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <img src={qrDataUrl} alt="QR Code" className="w-16 h-16 bg-white p-1 rounded-lg shadow" />
                      <div>
                        <div className="font-bold text-slate-200 text-xs">Mã QR Code Short Link</div>
                        <div className="text-[10px] text-slate-400">Tải xuống file PNG để in ấn hoặc quét nhanh</div>
                      </div>
                    </div>
                    <button
                      onClick={downloadQR}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-semibold rounded-lg flex items-center gap-1.5 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải PNG
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Link Management Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-amber-500" />
              Danh Sách Link Đã Tạo Trong Hệ Thống ({allLinks.length})
            </h3>
            <p className="text-xs text-slate-500">
              Quản lý trực tiếp, bật/tắt kích hoạt, test redirect hoặc xóa link
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm slug, tiêu đề..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64"
            />
            <button
              onClick={fetchAllLinks}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              title="Tải lại danh sách"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-mono">
              <tr>
                <th className="p-3">Short Link</th>
                <th className="p-3">URL Đích</th>
                <th className="p-3">Tiêu Đề OG</th>
                <th className="p-3 text-center">Clicks / Bots</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allLinks
                .filter(l => 
                  !searchFilter || 
                  l.slug.toLowerCase().includes(searchFilter.toLowerCase()) || 
                  l.destination_url.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  (l.metadata && l.metadata.og_title && l.metadata.og_title.toLowerCase().includes(searchFilter.toLowerCase()))
                )
                .map((link) => {
                  const fullUrl = `${window.location.origin}/r/${link.slug}`;
                  return (
                    <tr key={link.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-500 whitespace-nowrap">
                        /r/{link.slug}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-xs truncate">
                        {link.destination_url}
                      </td>
                      <td className="p-3 text-slate-900 dark:text-slate-100 font-medium max-w-xs truncate">
                        {link.metadata?.og_title || 'N/A'}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap font-mono">
                        <span className="text-emerald-400 font-bold">{link.clicks_count}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-sky-400 font-bold">{link.bot_views_count}</span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleLink(link.slug)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                            link.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {link.is_active ? '● Hoạt động' : '○ Tắt'}
                        </button>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => copyToClipboard(fullUrl)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs cursor-pointer"
                          title="Sao chép link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 inline-block bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 rounded-lg text-xs"
                          title="Mở dùng thử link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setDestinationUrl(link.destination_url);
                            setCustomSlug(link.slug);
                            if (link.metadata) {
                              setOgTitle(link.metadata.og_title || '');
                              setOgDescription(link.metadata.og_description || '');
                              setOgImage(link.metadata.og_image || '');
                              setOgSiteName(link.metadata.og_site_name || '');
                            }
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-400 rounded-lg text-xs cursor-pointer"
                          title="Chỉnh sửa link"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.slug)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs cursor-pointer"
                          title="Xóa link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {allLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Chưa có link nào trong hệ thống. Hãy điền form phía trên để tạo short link đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
