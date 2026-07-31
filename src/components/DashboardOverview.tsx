import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MousePointerClick, 
  Bot, 
  ArrowUpRight, 
  Key, 
  Smartphone, 
  Lock, 
  Server
} from 'lucide-react';
import { ShortLink } from '../types';
import { UserManager } from './UserManager';

export function DashboardOverview({ links }: { links: ShortLink[] }) {
  const [activeTab, setActiveTab] = useState<'links' | 'users' | 'security'>('links');

  // Stats calculation
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks_count, 0);
  const totalBotViews = links.reduce((sum, l) => sum + l.bot_views_count, 0);

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Tổng Short Links</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalLinks}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Active URLs System-wide
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lượt Click Người Dùng</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalClicks}</div>
          <div className="text-[11px] text-slate-400 font-mono">HTTP 302 Direct Redirects</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Crawler Bot Previews</span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalBotViews}</div>
          <div className="text-[11px] text-sky-400 font-medium">Facebook, Zalo, Telegram, Googlebot</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Server Infrastructure</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Redis Horizon Active
          </div>
          <div className="text-[11px] text-slate-400 font-mono">PHP 8.3 / Express Node.js</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'links'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Quản Lý Links ({links.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Quản Lý Thành Viên & Duyệt User
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          Bảo Mật 2FA Passkey & Sessions
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'links' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Short URL / Slug</th>
                  <th className="p-3.5">Destination URL</th>
                  <th className="p-3.5">Open Graph Title</th>
                  <th className="p-3.5">Clicks (User)</th>
                  <th className="p-3.5">Views (Bot)</th>
                  <th className="p-3.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                      Chưa có short link nào được tạo trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono font-bold text-amber-400">
                        /r/{link.slug}
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono text-[11px] max-w-xs truncate">
                        {link.destination_url}
                      </td>
                      <td className="p-3.5 text-slate-100 font-medium max-w-xs truncate">
                        {link.metadata.og_title}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400 font-mono">
                        {link.clicks_count}
                      </td>
                      <td className="p-3.5 font-bold text-sky-400 font-mono">
                        {link.bot_views_count}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quản lý thành viên tích hợp trực tiếp */}
      {activeTab === 'users' && (
        <UserManager />
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Bảo Mật 2FA Passkey (WebAuthn)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Passkey cho phép đăng nhập không dùng mật khẩu thông qua vân tay (TouchID), khuôn mặt (FaceID) hoặc khóa bảo mật phần cứng YubiKey.
            </p>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
              <Smartphone className="w-4 h-4" />
              Đăng Ký Passkey Mới
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Quản Lý Active Sessions
            </h3>
            <div className="text-xs space-y-2">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100">Chrome / macOS (Thiết bị này)</div>
                  <div className="text-[10px] text-slate-400 font-mono">118.0.2.1 • TP. Hồ Chí Minh</div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded">
                  Active Now
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs cursor-pointer">
              Đăng Xuất Khỏi Tất Cả Thiết Bị Khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

