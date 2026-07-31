import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Bot, 
  FolderTree, 
  BarChart3, 
  Wrench, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Layers,
  Zap,
  Server,
  Database,
  BookOpen,
  LogIn,
  LogOut,
  UserCheck,
  Users
} from 'lucide-react';
import { Step1Blueprint } from './components/Step1Blueprint';
import { LinkGeneratorOG } from './components/LinkGeneratorOG';
import { CrawlerSimulator } from './components/CrawlerSimulator';
import { DashboardOverview } from './components/DashboardOverview';
import { InstallerWizard } from './components/InstallerWizard';
import { DatabaseSchemaInspector } from './components/DatabaseSchemaInspector';
import { CoreServiceInspector } from './components/CoreServiceInspector';
import { ControllersRepositoriesInspector } from './components/ControllersRepositoriesInspector';
import { FrontendBladeInspector } from './components/FrontendBladeInspector';
import { AuthTestingInspector } from './components/AuthTestingInspector';
import { ReadmeViewer } from './components/ReadmeViewer';
import { LoginForm } from './components/LoginForm';
import { UserManager } from './components/UserManager';
import { ShortLink } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'dashboard' | 'crawler' | 'installer' | 'readme' | 'login' | 'users' | 'blueprint' | 'schema' | 'coreservice' | 'controllers' | 'frontend' | 'authtesting'>('readme');
  const [showSpecsMenu, setShowSpecsMenu] = useState(false);
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [siteName, setSiteName] = useState('VNaStar Smart Link Shortener');
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; username?: string; role?: string } | null>(null);

  // Check installation status & current user
  const checkSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setIsInstalled(data.installed);
        if (data.siteName) setSiteName(data.siteName);

        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath.includes('install')) {
          if (data.installed) {
            // Đã cài đặt thành công -> Tự động chuyển hướng về trang chủ
            window.history.replaceState({}, '', '/');
            setActiveTab('shortener');
          } else {
            setActiveTab('installer');
          }
        } else if (currentPath.includes('login')) {
          setActiveTab('login');
        } else if (!data.installed) {
          setActiveTab('readme');
        } else {
          setActiveTab('shortener');
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
      if (path.includes('install')) {
        if (isInstalled) {
          window.history.replaceState({}, '', '/');
          setActiveTab('shortener');
        } else {
          setActiveTab('installer');
        }
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
    setActiveTab('shortener');
  };

  const isSpecTab = ['blueprint', 'schema', 'coreservice', 'controllers', 'frontend', 'authtesting'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(isInstalled ? 'shortener' : 'readme')}>
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
                  <span className={`font-mono text-[10px] ${isInstalled ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isInstalled ? '● System Active' : '○ Not Installed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('readme')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'readme'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Hướng Dẫn (README)
              </button>

              <button
                onClick={() => {
                  if (isInstalled) {
                    window.history.replaceState({}, '', '/');
                    setActiveTab('shortener');
                  } else {
                    if (window.location.pathname !== '/install') {
                      window.history.pushState({}, '', '/install');
                    }
                    setActiveTab('installer');
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'installer'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                Cài Đặt (/install)
              </button>

              <button
                onClick={() => setActiveTab('shortener')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'shortener'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Rút Gọn Link & OG
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard Thống Kê
              </button>

              <button
                onClick={() => setActiveTab('crawler')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'crawler'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bot className="w-4 h-4" />
                Giả Lập Crawler
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Duyệt Users
              </button>

              {/* Specs & Architecture Dropdown */}
              <div className="relative ml-2 border-l border-slate-800 pl-2">
                <button
                  onClick={() => setShowSpecsMenu(!showSpecsMenu)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSpecTab
                      ? 'bg-slate-800 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  Specs Kiến Trúc
                  <ChevronRight className={`w-3 h-3 transition-transform ${showSpecsMenu ? 'rotate-90' : ''}`} />
                </button>

                {showSpecsMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                    <button
                      onClick={() => { setActiveTab('blueprint'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                      Step 1: System Blueprint
                    </button>
                    <button
                      onClick={() => { setActiveTab('schema'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'schema' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      Step 3: CSDL & Models
                    </button>
                    <button
                      onClick={() => { setActiveTab('coreservice'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'coreservice' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Step 4: Core Service
                    </button>
                    <button
                      onClick={() => { setActiveTab('controllers'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'controllers' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Step 5: Controllers
                    </button>
                    <button
                      onClick={() => { setActiveTab('frontend'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'frontend' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Step 6: Blade & Frontend
                    </button>
                    <button
                      onClick={() => { setActiveTab('authtesting'); setShowSpecsMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'authtesting' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Step 7: Auth & Testing
                    </button>
                  </div>
                )}
              </div>
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
                    onClick={() => setCurrentUser(null)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
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
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'readme' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              README Hướng Dẫn
            </button>
            <button
              onClick={() => {
                if (isInstalled) {
                  window.history.replaceState({}, '', '/');
                  setActiveTab('shortener');
                } else {
                  if (window.location.pathname !== '/install') {
                    window.history.pushState({}, '', '/install');
                  }
                  setActiveTab('installer');
                }
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'installer' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Cài Đặt (/install)
            </button>
            <button
              onClick={() => setActiveTab('shortener')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'shortener' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Rút Gọn Link
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('crawler')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'crawler' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Giả Lập Crawler
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Duyệt Users
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'readme' && (
          <ReadmeViewer
            isInstalled={isInstalled}
            onGoToInstall={() => {
              if (window.location.pathname !== '/install') {
                window.history.pushState({}, '', '/install');
              }
              setActiveTab('installer');
            }}
            onGoToLogin={() => setActiveTab('login')}
          />
        )}

        {activeTab === 'login' && (
          <LoginForm
            siteName={siteName}
            onSuccessLogin={handleSuccessLogin}
          />
        )}

        {activeTab === 'users' && (
          <UserManager />
        )}

        {activeTab === 'installer' && (
          <InstallerWizard
            onInstallationComplete={() => {
              setIsInstalled(true);
            }}
          />
        )}

        {activeTab === 'blueprint' && (
          <Step1Blueprint onNextStep={() => setActiveTab('shortener')} />
        )}

        {activeTab === 'schema' && (
          <DatabaseSchemaInspector />
        )}

        {activeTab === 'coreservice' && (
          <CoreServiceInspector />
        )}

        {activeTab === 'controllers' && (
          <ControllersRepositoriesInspector />
        )}

        {activeTab === 'frontend' && (
          <FrontendBladeInspector />
        )}

        {activeTab === 'authtesting' && (
          <AuthTestingInspector />
        )}

        {activeTab === 'shortener' && (
          <LinkGeneratorOG onLinkCreated={handleLinkCreated} />
        )}

        {activeTab === 'crawler' && (
          <CrawlerSimulator />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview links={links} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong className="text-slate-300">Smart Link Shortener</strong> • Bản quyền chủ sở hữu <strong className="text-amber-400">VNaStar Media</strong>.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>PHP 8.3 / Laravel 12</span>
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
