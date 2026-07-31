import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  TestTube, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Lock, 
  Fingerprint, 
  Globe2, 
  Sparkles,
  Terminal,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export function AuthTestingInspector() {
  const [activeTab, setActiveTab] = useState<'auth' | 'passkey' | 'tests'>('auth');

  // 2FA state
  const [totpCode, setTotpCode] = useState('123456');
  const [is2faVerified, setIs2faVerified] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  // Automated Tests Runner State
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState([
    {
      id: 'test_1',
      name: 'UrlShortenerTest :: it_can_generate_a_unique_6_character_alias',
      suite: 'Feature/UrlShortenerTest.php',
      status: 'passed',
      duration: '42ms',
      assertions: 2
    },
    {
      id: 'test_2',
      name: 'UrlShortenerTest :: it_can_create_short_link_with_custom_og_metadata',
      suite: 'Feature/UrlShortenerTest.php',
      status: 'passed',
      duration: '88ms',
      assertions: 3
    },
    {
      id: 'test_3',
      name: 'SocialCrawlerDetectionTest :: it_identifies_facebook_bot_as_crawler',
      suite: 'Feature/SocialCrawlerDetectionTest.php',
      status: 'passed',
      duration: '15ms',
      assertions: 1
    },
    {
      id: 'test_4',
      name: 'SocialCrawlerDetectionTest :: it_identifies_zalo_bot_as_crawler',
      suite: 'Feature/SocialCrawlerDetectionTest.php',
      status: 'passed',
      duration: '12ms',
      assertions: 1
    },
    {
      id: 'test_5',
      name: 'UserAuthorizationTest :: user_cannot_edit_another_users_short_link',
      suite: 'Feature/UserAuthorizationTest.php',
      status: 'passed',
      duration: '65ms',
      assertions: 2
    }
  ]);

  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
    }, 1200);
  };

  const handlePasskeyScan = () => {
    setPasskeyStatus('scanning');
    setTimeout(() => {
      setPasskeyStatus('success');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Bước 7: Security Auth (2FA Passkey, Socialite) & Feature Testing
          </div>
          <h2 className="text-xl font-bold">Bảo Mật Hệ Thống & Kiểm Thử Tự Động PHPUnit</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý đăng nhập 2FA, WebAuthn Passkey, Social Login (Google/Facebook) và Suite Test tự động.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'auth' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Socialite & 2FA
          </button>
          <button
            onClick={() => setActiveTab('passkey')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'passkey' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            WebAuthn Passkey
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'tests' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TestTube className="w-3.5 h-3.5" />
            PHPUnit Test Suite
          </button>
        </div>
      </div>

      {/* TAB 1: SOCIALITE & 2FA */}
      {activeTab === 'auth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Socialite Providers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              1. Đăng Nhập Mạng Xã Hội (Laravel Socialite)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tích hợp OAuth2 tự động tạo tài khoản và gán hạn ngạch mặc định (500 link/ngày).
            </p>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => alert('Chuyển hướng đến Google OAuth Flow: https://accounts.google.com/o/oauth2/v2/auth')}
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">G</span>
                  <span>Đăng nhập qua Google WorkSpace</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Redirecting</span>
              </button>

              <button 
                onClick={() => alert('Chuyển hướng đến Facebook OAuth Flow: https://www.facebook.com/v18.0/dialog/oauth')}
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">f</span>
                  <span>Đăng nhập qua Facebook App</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Redirecting</span>
              </button>
            </div>
          </div>

          {/* 2FA Verification Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              2. Xác Thực 2 Yếu Tố (TOTP Authenticator)
            </h3>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Nhập mã 6 chữ số từ ứng dụng Google Authenticator:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-amber-400"
                />
                <button
                  onClick={() => setIs2faVerified(true)}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 transition-all"
                >
                  Xác Nhận
                </button>
              </div>

              {is2faVerified && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Mã 2FA chính xác! Quyền truy cập quản trị đã mở khóa.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBAUTHN PASSKEY */}
      {activeTab === 'passkey' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-amber-400" />
                Mã Khóa Sinh Trắc Học (WebAuthn / TouchID / FaceID Passkey)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Đăng nhập không cần mật khẩu trực tiếp qua cảm biến vân tay hoặc thiết bị FIDO2 Hardware Key.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Fingerprint className={`w-8 h-8 ${passkeyStatus === 'scanning' ? 'animate-pulse text-amber-300' : ''}`} />
            </div>

            {passkeyStatus === 'idle' && (
              <div>
                <h4 className="text-sm font-bold text-white">Chưa Quét Passkey</h4>
                <p className="text-xs text-slate-400 mt-1">Nhấn bên dưới để khởi chạy quy trình xác thực sinh trắc học.</p>
                <button
                  onClick={handlePasskeyScan}
                  className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  🔑 Quét TouchID / FaceID
                </button>
              </div>
            )}

            {passkeyStatus === 'scanning' && (
              <div>
                <h4 className="text-sm font-bold text-amber-400 animate-pulse">Đang yêu cầu phần cứng quét vân tay...</h4>
                <p className="text-xs text-slate-400 mt-1">Vui lòng chạm vào cảm biến TouchID hoặc nhìn vào camera FaceID.</p>
              </div>
            )}

            {passkeyStatus === 'success' && (
              <div>
                <h4 className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Khóa Passkey Hợp Lệ!
                </h4>
                <p className="text-xs text-slate-400 mt-1">Xác thực FIDO2 thành công. Token đã cấp cho phiên làm việc.</p>
                <button
                  onClick={() => setPasskeyStatus('idle')}
                  className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
                >
                  Quét Lại
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PHPUNIT AUTOMATED TESTS */}
      {activeTab === 'tests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                PHPUnit Automated Feature Test Runner Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chạy kiểm thử tích hợp 100% logic rút gọn, nhận diện crawler Facebook/Zalo và phân quyền người dùng.
              </p>
            </div>

            <button
              onClick={handleRunAllTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              {isRunningTests ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang Chạy Suite Test...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Chạy Lại Tất Cả Test Cases</span>
                </>
              )}
            </button>
          </div>

          {/* Test Status Summary Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Tổng Test Case</span>
              <span className="text-lg font-bold text-white font-mono">{testResults.length}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Trạng Thái Pass</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">5 / 5 (100%)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Thời Gian Thực Thi</span>
              <span className="text-lg font-bold text-amber-400 font-mono">222 ms</span>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">File Suite</th>
                  <th className="p-3">Tên Test Method</th>
                  <th className="p-3 text-center">Assertions</th>
                  <th className="p-3 text-center">Thời Gian</th>
                  <th className="p-3 text-right">Kết Quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {testResults.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 text-amber-300 font-semibold">{t.suite}</td>
                    <td className="p-3 text-slate-200">{t.name.split('::')[1]}</td>
                    <td className="p-3 text-center text-slate-400">{t.assertions}</td>
                    <td className="p-3 text-center text-slate-400">{t.duration}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> PASSED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
