import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MousePointerClick, 
  Bot, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldAlert, 
  Key, 
  Smartphone, 
  Crown, 
  Edit3, 
  Trash2, 
  Lock, 
  PlusCircle, 
  Sparkles,
  Server,
  Activity
} from 'lucide-react';
import { ShortLink, User } from '../types';

export function DashboardOverview({ links }: { links: ShortLink[] }) {
  const [activeTab, setActiveTab] = useState<'links' | 'users' | 'security'>('links');

  // Stats calculation
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks_count, 0);
  const totalBotViews = links.reduce((sum, l) => sum + l.bot_views_count, 0);

  // Mock User List for Admin
  const [users, setUsers] = useState<User[]>([
    { id: 'usr_1', name: 'VNaStar Admin', email: 'admin@sls.vnastar.com', role: 'admin', daily_limit: 500, created_links_today: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 'usr_2', name: 'Marketing Staff', email: 'marketing@sls.vnastar.com', role: 'user', daily_limit: 50, created_links_today: 8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 'usr_3', name: 'SEO Specialist', email: 'seo@sls.vnastar.com', role: 'user', daily_limit: 100, created_links_today: 35, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
  ]);

  return (
    <div className="space-y-8">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tổng Short Links</span>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalLinks}</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Active URLs System-wide
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Lượt Click Người Dùng</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalClicks}</div>
          <div className="text-[11px] text-slate-400">HTTP 302 Direct Redirects</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Crawler Bot Previews</span>
            <div className="p-2 bg-sky-500/10 text-sky-500 rounded-lg">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalBotViews}</div>
          <div className="text-[11px] text-sky-500 font-medium">Facebook, Zalo, Discord, Telegram</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Server Infrastructure</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Redis Horizon Active
          </div>
          <div className="text-[11px] text-slate-400">PHP 8.3 / Laravel 12 Queue Worker</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'links'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Quản Lý Links ({links.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Quản Lý Thành Viên ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Bảo Mật 2FA Passkey & Sessions
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'links' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-3.5">Short URL / Slug</th>
                  <th className="p-3.5">Destination URL</th>
                  <th className="p-3.5">Open Graph Title</th>
                  <th className="p-3.5">Clicks (User)</th>
                  <th className="p-3.5">Views (Bot)</th>
                  <th className="p-3.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                      /r/{link.slug}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-xs truncate">
                      {link.destination_url}
                    </td>
                    <td className="p-3.5 text-slate-900 dark:text-slate-100 font-medium max-w-xs truncate">
                      {link.metadata.og_title}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {link.clicks_count}
                    </td>
                    <td className="p-3.5 font-bold text-sky-500 font-mono">
                      {link.bot_views_count}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-3.5">User Info</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Daily Limit</th>
                  <th className="p-3.5">Created Today</th>
                  <th className="p-3.5">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] flex items-center gap-1 w-max">
                          <Crown className="w-3 h-3" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px]">
                          USER
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {u.daily_limit} links/ngày
                    </td>
                    <td className="p-3.5 font-mono text-emerald-500 font-bold">
                      {u.created_links_today} links
                    </td>
                    <td className="p-3.5">
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Bảo Mật 2FA Passkey (WebAuthn)
            </h3>
            <p className="text-xs text-slate-500">
              Passkey cho phép đăng nhập không dùng mật khẩu thông qua vân tay (TouchID), khuôn mặt (FaceID) hoặc khóa bảo mật phần cứng YubiKey.
            </p>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Đăng Ký Passkey Mới
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Quản Lý Active Sessions
            </h3>
            <div className="text-xs space-y-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Chrome / macOS (Thiết bị này)</div>
                  <div className="text-[10px] text-slate-400 font-mono">118.0.2.1 • TP. Hồ Chí Minh</div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded">
                  Active Now
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold rounded-xl text-xs">
              Đăng Xuất Khỏi Tất Cả Thiết Bị Khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
