import React, { useState } from 'react';
import { 
  Zap, 
  Bot, 
  Link as LinkIcon, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Globe, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  Layers, 
  RotateCw, 
  Eye, 
  ExternalLink,
  Share2,
  Lock,
  Clock
} from 'lucide-react';

export function CoreServiceInspector() {
  const [subTab, setSubTab] = useState<'crawler' | 'alias' | 'utm' | 'source'>('crawler');

  // Crawler Simulation State
  const [selectedUaPreset, setSelectedUaPreset] = useState<'facebook' | 'zalo' | 'telegram' | 'google' | 'chrome'>('facebook');
  const [customUa, setCustomUa] = useState('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');

  // Alias Generator State
  const [inputAlias, setInputAlias] = useState('vnastar-2026');
  const [generatedAlias, setGeneratedAlias] = useState('vN8aS2');
  const [isAliasChecking, setIsAliasChecking] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<'available' | 'taken'>('available');

  // UTM Parameters State
  const [destUrl, setDestUrl] = useState('https://sls.vnastar.com/campaign/summer-promo');
  const [utmSource, setUtmSource] = useState('facebook');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('summer_sale_2026');

  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const presets = {
    facebook: {
      name: 'Facebook External Hit Bot',
      ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      isCrawler: true
    },
    zalo: {
      name: 'Zalo Crawler Bot',
      ua: 'ZaloBot/1.0 (+http://zalo.me/zalobot)',
      isCrawler: true
    },
    telegram: {
      name: 'Telegram Messenger Bot',
      ua: 'TelegramBot (like TwitterBot)',
      isCrawler: true
    },
    google: {
      name: 'Googlebot Search Crawler',
      ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      isCrawler: true
    },
    chrome: {
      name: 'User Real Chrome Browser (macOS)',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      isCrawler: false
    }
  };

  const handleSelectPreset = (key: 'facebook' | 'zalo' | 'telegram' | 'google' | 'chrome') => {
    setSelectedUaPreset(key);
    setCustomUa(presets[key].ua);
  };

  const handleGenerateAlias = () => {
    setIsAliasChecking(true);
    setTimeout(() => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedAlias(result);
      setAliasStatus('available');
      setIsAliasChecking(false);
    }, 400);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const currentPresetData = presets[selectedUaPreset];

  const fullUtmUrl = `${destUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            Bước 4: Core Service (URL Shortener, Crawler Detection & Redirection)
          </div>
          <h2 className="text-xl font-bold">Xử Lý Chuyển Hướng & Bypass Facebook/Zalo Crawler</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tự động phát hiện Social Bot, trả về HTML Open Graph xem trước mượt mà mà không chuyển hướng, đồng thời định tuyến 302 cho người dùng thật.
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSubTab('crawler')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'crawler' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Crawler Simulator
          </button>
          <button
            onClick={() => setSubTab('alias')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'alias' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Alias Generator
          </button>
          <button
            onClick={() => setSubTab('utm')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'utm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            UTM Builder
          </button>
          <button
            onClick={() => setSubTab('source')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'source' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            PHP Code
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CRAWLER DETECTION SIMULATOR */}
      {subTab === 'crawler' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              Mô Phỏng Trình Duyệt / Crawler Bot Truy Cập (User-Agent Detection Test)
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(Object.keys(presets) as Array<keyof typeof presets>).map(key => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedUaPreset === key
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    {presets[key].isCrawler ? 'Crawler Bot' : 'Real Human'}
                  </div>
                  <div className="text-xs font-bold mt-1 truncate">{presets[key].name}</div>
                </button>
              ))}
            </div>

            {/* User-Agent Input Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chuỗi User-Agent Header Được Gửi Đến Server
              </label>
              <textarea
                rows={2}
                value={customUa}
                onChange={e => setCustomUa(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300"
              />
            </div>

            {/* Middleware Result Panel */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Kết Quả Phân Tích Middleware `DetectSocialCrawler`:
                </span>

                {currentPresetData.isCrawler ? (
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    IS_CRAWLER = TRUE (SERVE OPEN GRAPH HTML)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    IS_CRAWLER = FALSE (HTTP 302 REDIRECT)
                  </span>
                )}
              </div>

              {currentPresetData.isCrawler ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Server trả về mã HTTP 200 OK cùng thẻ <span className="font-mono text-amber-300">&lt;head&gt; Open Graph</span> giúp Facebook / Zalo cào bài và hiển thị Thumbnail mượt mà:
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-purple-300 leading-relaxed overflow-x-auto">
{`HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
  <meta property="og:type" content="website">
  <meta property="og:title" content="Chiến Dịch Truyền Thông VNaStar Summer 2026">
  <meta property="og:description" content="Bùng nổ doanh số với giải pháp rút gọn link thông minh VNaStar Media.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1557804506-669a67965ba0">
  <meta property="fb:app_id" content="1029384756">
</head>
<body>...</body>
</html>`}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Server ghi nhận Log Lượt Click (ClickLog) và lập tức thực hiện chuyển hướng 302 Redirect đến URL Đích:
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto">
{`HTTP/1.1 302 Found
Location: https://sls.vnastar.com/campaign/summer-promo?utm_source=facebook&utm_medium=cpc
Cache-Control: no-cache, private
X-Redirect-By: VNaStar-Smart-Shortener

[Log Recorded] IP: 113.161.22.84 | Country: VN | Device: desktop | Browser: Chrome`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: ALIAS GENERATOR */}
      {subTab === 'alias' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              Bộ Sinh Alias Tự Động & Kiểm Tra Trùng Lặp (Collision Check)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Random Generation Box */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-300">1. Sinh Alias Ngẫu Nhiên 6 Ký Tự (Base62)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedAlias}
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono font-bold text-amber-400"
                  />
                  <button
                    onClick={handleGenerateAlias}
                    disabled={isAliasChecking}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isAliasChecking ? 'animate-spin' : ''}`} />
                    Tạo Mới
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Thuật toán sinh chuỗi 6 ký tự ngẫu nhiên bao gồm <span className="font-mono text-slate-400">[a-z, A-Z, 0-9]</span> tạo ra 62^6 = 56.8 tỷ khả năng khác nhau.
                </p>
              </div>

              {/* Custom Alias Check */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-300">2. Kiểm Tra Alias Tự Đặt (Custom Alias)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputAlias}
                    onChange={e => setInputAlias(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-emerald-300"
                  />
                  <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Khả Dụng
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Kiểm tra tức thì trong Redis Cache & MySQL Index trước khi tạo record mới.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: UTM BUILDER */}
      {subTab === 'utm' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Trình Ghép Thẻ Thống Kê UTM Google Analytics
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Đích Ban Đầu</label>
                <input
                  type="text"
                  value={destUrl}
                  onChange={e => setDestUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UTM Source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={e => setUtmSource(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UTM Medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={e => setUtmMedium(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UTM Campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={e => setUtmCampaign(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL Hoàn Chỉnh Sau Khi Ghép UTM</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-between gap-2 overflow-x-auto">
                  <span>{fullUtmUrl}</span>
                  <button
                    onClick={() => handleCopy(fullUtmUrl, 'utm')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-mono shrink-0 flex items-center gap-1"
                  >
                    {copyStatus === 'utm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: CODE VIEW */}
      {subTab === 'source' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Mã Nguồn PHP Middleware `DetectSocialCrawler.php`
            </h3>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
{`namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class DetectSocialCrawler
{
    protected array $crawlerUserAgents = [
        'facebookexternalhit', 'Facebot', 'ZaloBot', 'Zalo',
        'TelegramBot', 'Twitterbot', 'LinkedInBot', 'WhatsApp', 'Googlebot'
    ];

    public function handle(Request $request, Closure $next)
    {
        $userAgent = $request->header('User-Agent', '');
        $isCrawler = false;

        foreach ($this->crawlerUserAgents as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                $isCrawler = true;
                break;
            }
        }

        $request->attributes->set('is_crawler', $isCrawler);
        return $next($request);
    }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
