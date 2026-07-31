import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  UserCheck, 
  Search, 
  ExternalLink, 
  ShieldAlert, 
  Globe, 
  Smartphone, 
  Monitor, 
  Clock, 
  RefreshCw, 
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { ClickLog, ShortLink } from '../types';

export function CrawlerSimulator() {
  const [testSlug, setTestSlug] = useState('vnastar-promo');
  const [selectedUserAgent, setSelectedUserAgent] = useState('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)');
  const [customUA, setCustomUA] = useState('');
  const [renderedHtml, setRenderedHtml] = useState('');
  const [isBotResponse, setIsBotResponse] = useState<boolean | null>(null);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<ClickLog[]>([]);

  const botPresetUAs = [
    { label: 'Facebook Crawler (facebookexternalhit)', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
    { label: 'Telegram Preview Bot (TelegramBot)', ua: 'TelegramBot (like TwitterBot)' },
    { label: 'Discord Link Preview (Discordbot)', ua: 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)' },
    { label: 'Zalo Link Crawler (ZaloBot)', ua: 'Mozilla/5.0 (compatible; ZaloBot/1.0; +https://zalo.me)' },
    { label: 'Twitter / X Card Bot', ua: 'Twitterbot/1.0' },
    { label: 'Google Search Crawler', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    { label: 'Trình duyệt Người dùng thật (Chrome Windows)', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' },
    { label: 'Trình duyệt Người dùng thật (iPhone Safari)', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' }
  ];

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleTestRequest = async () => {
    setIsLoading(true);
    setRenderedHtml('');
    setRedirectUrl('');
    setIsBotResponse(null);

    const uaToSend = customUA || selectedUserAgent;

    try {
      // Send request with custom User-Agent header
      const res = await fetch(`/r/${testSlug}?ua=${encodeURIComponent(uaToSend)}`, {
        headers: {
          'User-Agent': uaToSend
        }
      });

      if (res.redirected) {
        // Real user redirect response
        setIsBotResponse(false);
        setRedirectUrl(res.url);
      } else {
        const html = await res.text();
        if (html.includes('<!-- Rendered specifically for Crawler Bot')) {
          setIsBotResponse(true);
          setRenderedHtml(html);
        } else {
          setIsBotResponse(false);
          setRedirectUrl(res.url || '302 HTTP Location Redirect Success');
        }
      }

      await fetchLogs();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            Core Logic Test: CrawlerDetect Middleware & Redirection Engine
          </div>
          <h2 className="text-xl font-bold">Giả Lập Request Crawler Bot vs Người Dùng Thật</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kiểm tra phản hồi của hệ thống khi nhận HTTP Request dựa trên User-Agent. Phân biệt trả về HTML Head Metadata (cho Bot) hoặc HTTP 302 Redirect (cho User).
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm Mới Audit Logs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Test Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Cấu Hình Request Giả Lập
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Link Slug cần Test
              </label>
              <input
                type="text"
                value={testSlug}
                onChange={(e) => setTestSlug(e.target.value)}
                placeholder="vnastar-promo"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chọn User-Agent Mẫu
              </label>
              <select
                value={selectedUserAgent}
                onChange={(e) => {
                  setSelectedUserAgent(e.target.value);
                  setCustomUA('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100"
              >
                {botPresetUAs.map((item, idx) => (
                  <option key={idx} value={item.ua}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tùy Chỉnh User-Agent Chuỗi (Hoặc để trống dùng mẫu chọn trên)
              </label>
              <textarea
                rows={2}
                value={customUA}
                onChange={(e) => setCustomUA(e.target.value)}
                placeholder="Nhập User-Agent riêng nếu muốn test..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100"
              ></textarea>
            </div>

            <button
              onClick={handleTestRequest}
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              GỬI REQUEST TEST ROUTING
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                HTTP Response Inspection Output
              </span>
              {isBotResponse !== null && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  isBotResponse 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isBotResponse ? (
                    <>
                      <Bot className="w-3.5 h-3.5" />
                      PHÁT HIỆN CRAWLER BOT (HTTP 200 OG RENDER)
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      NGƯỜI DÙNG THẬT (HTTP 302 DIRECT REDIRECT)
                    </>
                  )}
                </span>
              )}
            </div>

            {isBotResponse === null && !isLoading && (
              <div className="py-12 text-center text-slate-500 text-xs">
                Nhấn nút "GỬI REQUEST TEST ROUTING" ở bên trái để chạy thử Crawler Middleware.
              </div>
            )}

            {isLoading && (
              <div className="py-12 text-center text-amber-400 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                <p>Đang phân tích User-Agent & chạy Middleware Routing...</p>
              </div>
            )}

            {/* Display for Crawler Bot HTML Response */}
            {isBotResponse === true && renderedHtml && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl flex items-center justify-between">
                  <span>
                    ✅ <strong>Core Logic Hoạt Động Đúng:</strong> Trả về HTML Source chỉ chứa thẻ &lt;head&gt; với đầy đủ Open Graph Meta cho Bot. KHÔNG JavaScript Redirect!
                  </span>
                  <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">HTTP 200 OK</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                  <pre>{renderedHtml}</pre>
                </div>
              </div>
            )}

            {/* Display for Real User Redirect */}
            {isBotResponse === false && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
                  <span>
                    🚀 <strong>Core Logic Hoạt Động Đúng:</strong> Người dùng thật lập tức nhận HTTP 302 Redirect tới URL đích nguyên bản.
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">HTTP 302 FOUND</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="text-slate-400">Target Redirect Destination:</div>
                  <div className="text-amber-400 font-bold break-all">{redirectUrl}</div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Click & Crawl Logs Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Lịch Sử Clicks & Crawler Logs (Queue Processing)
              </span>
              <span className="text-xs font-normal text-slate-500">{logs.length} Bản ghi gần nhất</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Thời Gian</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Slug</th>
                    <th className="p-2.5">IP / Location</th>
                    <th className="p-2.5">User-Agent Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400 text-xs">
                        Chưa có lịch sử click. Hãy bấm gửi request ở trên để tạo log.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 text-slate-400 text-[10px] whitespace-nowrap">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </td>
                        <td className="p-2.5">
                          {log.is_bot ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                              BOT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              USER
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">{log.slug}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {log.ip_address} <span className="text-slate-400">({log.country})</span>
                        </td>
                        <td className="p-2.5 text-slate-500 text-[11px] max-w-xs truncate" title={log.user_agent}>
                          {log.user_agent}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
