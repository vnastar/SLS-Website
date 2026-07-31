import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Bot, 
  BarChart3, 
  Wrench, 
  BookOpen,
  LogIn,
  LogOut,
  UserCheck,
  Users,
  Lock,
  Sparkles
} from 'lucide-react';
import { LinkGeneratorOG } from './components/LinkGeneratorOG';
import { CrawlerSimulator } from './components/CrawlerSimulator';
import { DashboardOverview } from './components/DashboardOverview';
import { InstallerWizard } from './components/InstallerWizard';
import { ReadmeViewer } from './components/ReadmeViewer';
import { LoginForm } from './components/LoginForm';
import { UserManager } from './components/UserManager';
import { ShortLink } from './types';

export default function App() {
  const getInitialTab = () => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/install' || path.startsWith('/install')) {
      return 'installer';
    }
    if (path.includes('login')) {
      return 'login';
    }
    return 'readme';
  };

  const [activeTab, setActiveTab] = useState<'shortener' | 'dashboard' | 'crawler' | 'installer' | 'readme' | 'login' | 'users'>(getInitialTab);
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);
  const [siteName, setSiteName] = useState('VNaStar Smart Link Shortener');
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; username?: string; role?: string } | null>(null);
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  // Check installation status & current user
  const checkSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setIsInstalled(data.installed);
        if (data.siteName) setSiteName(data.siteName);

        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath === '/install' || currentPath.startsWith('/install')) {
          setActiveTab('installer');
        } else if (currentPath.includes('login')) {
          setActiveTab('login');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch initial links from Express server
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkSystemStatus();
    fetchLinks();

    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/install' || path.startsWith('/install')) {
        setActiveTab('installer');
      } else if (path.includes('login')) {
        setActiveTab('login');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLinkCreated = (newLink: ShortLink) => {
    setLinks(prev => [newLink, ...prev]);
  };

  const handleSuccessLogin = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    setLoginNotice(null);
    setActiveTab('shortener');
  };

  const handleTabClick = (tab: 'shortener' | 'dashboard' | 'crawler' | 'installer' | 'readme' | 'login' | 'users', label: string) => {
    if (tab === 'readme') {
      setActiveTab('readme');
      setLoginNotice(null);
      return;
    }
    if (tab === 'login') {
      setActiveTab('login');
      setLoginNotice(null);
      return;
    }

    // Các tính năng yêu cầu đăng nhập mới được phép truy cập
    if (!currentUser) {
      setLoginNotice(`🔒 Yêu cầu đăng nhập: Bạn cần đăng nhập tài khoản để truy cập tính năng "${label}".`);
      setActiveTab('login');
    } else {
      setActiveTab(tab);
      setLoginNotice(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('readme', 'Trang Chủ')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 font-extrabold text-slate-950 flex items-center justify-center text-lg shadow-lg shadow-amber-500/20">
                VN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">{siteName}</span>
                  <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded">
                    VNaStar Media
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Open Graph Metadata Engine</span>
                  <span className="text-slate-600">•</span>
                  <span className={`font-mono text-[10px] ${currentUser ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentUser ? '● Đã Đăng Nhập' : '○ Chưa Đăng Nhập'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => handleTabClick('readme', 'Trang Chủ - Mô Tả Chức Năng')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'readme'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Trang Chủ (Mô Tả Chức Năng)
              </button>

              <button
                onClick={() => handleTabClick('shortener', 'Rút Gọn Link & OG')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'shortener'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Rút Gọn Link & OG
                {!currentUser && <Lock className="w-3 h-3 text-amber-400/70" />}
              </button>

              <button
                onClick={() => handleTabClick('dashboard', 'Dashboard Thống Kê')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard Thống Kê
                {!currentUser && <Lock className="w-3 h-3 text-amber-400/70" />}
              </button>

              <button
                onClick={() => handleTabClick('crawler', 'Giả Lập Crawler')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'crawler'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bot className="w-4 h-4" />
                Giả Lập Crawler
                {!currentUser && <Lock className="w-3 h-3 text-amber-400/70" />}
              </button>
            </nav>

            {/* Auth / Login Button */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold">
                    <UserCheck className="w-3.5 h-3.5" />
                    {currentUser.name}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setActiveTab('readme');
                      setLoginNotice(null);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleTabClick('login', 'Đăng Nhập')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Đăng Nhập
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden flex border-t border-slate-800 py-2 gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => handleTabClick('readme', 'Trang Chủ')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'readme' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => handleTabClick('shortener', 'Rút Gọn Link')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'shortener' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Rút Gọn Link {!currentUser && '🔒'}
            </button>
            <button
              onClick={() => handleTabClick('dashboard', 'Dashboard')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Dashboard {!currentUser && '🔒'}
            </button>
            <button
              onClick={() => handleTabClick('crawler', 'Giả Lập Crawler')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'crawler' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Giả Lập Crawler {!currentUser && '🔒'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trang chủ hiển thị mô tả đầy đủ các chức năng dự án */}
        {activeTab === 'readme' && (
          <ReadmeViewer
            isInstalled={isInstalled}
            isLoggedIn={!!currentUser}
            onGoToInstall={() => {
              window.history.pushState({}, '', '/install');
              setActiveTab('installer');
            }}
            onGoToLogin={() => handleTabClick('login', 'Đăng Nhập')}
            onGoToShortener={() => handleTabClick('shortener', 'Rút Gọn Link & OG')}
          />
        )}

        {/* Cổng đăng nhập / đăng ký */}
        {activeTab === 'login' && (
          <LoginForm
            siteName={siteName}
            noticeMessage={loginNotice || undefined}
            onSuccessLogin={handleSuccessLogin}
          />
        )}

        {activeTab === 'installer' && (
          <InstallerWizard
            onInstallationComplete={() => {
              setIsInstalled(true);
              window.history.pushState({}, '', '/');
              setActiveTab('readme');
            }}
          />
        )}

        {activeTab === 'shortener' && (
          currentUser ? (
            <LinkGeneratorOG onLinkCreated={handleLinkCreated} />
          ) : (
            <RequireLoginCard tabName="Rút Gọn Link & Tùy Chỉnh OG Metadata" onLogin={() => handleTabClick('login', 'Rút Gọn Link')} />
          )
        )}

        {activeTab === 'crawler' && (
          currentUser ? (
            <CrawlerSimulator />
          ) : (
            <RequireLoginCard tabName="Trình Giả Lập Crawler (Facebook, Zalo, Googlebot)" onLogin={() => handleTabClick('login', 'Giả Lập Crawler')} />
          )
        )}

        {activeTab === 'dashboard' && (
          currentUser ? (
            <DashboardOverview links={links} />
          ) : (
            <RequireLoginCard tabName="Báo Cáo Thống Kê Analytics Dashboard" onLogin={() => handleTabClick('login', 'Dashboard Thống Kê')} />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong className="text-slate-300">Smart Link Shortener</strong> • Bản quyền chủ sở hữu <strong className="text-amber-400">VNaStar Media</strong>.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>PHP 8.3 / Express Node.js</span>
            <span>•</span>
            <span>Redis horizon</span>
            <span>•</span>
            <span>Open Graph Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RequireLoginCard({ tabName, onLogin }: { tabName: string; onLogin: () => void }) {
  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
      <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">Yêu Cầu Đăng Nhập</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tính năng <strong className="text-amber-400">{tabName}</strong> bảo mật và yêu cầu tài khoản người dùng đã đăng nhập để thao tác.
        </p>
      </div>
      <button
        onClick={onLogin}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105"
      >
        <LogIn className="w-4 h-4" />
        Đăng Nhập Để Tiếp Tục
      </button>
    </div>
  );
}
