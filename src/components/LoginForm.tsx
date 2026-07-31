import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, Info } from 'lucide-react';

interface LoginFormProps {
  onSuccessLogin: (user: { id?: string; name: string; email: string; username?: string; role?: string }) => void;
  siteName?: string;
}

export function LoginForm({ onSuccessLogin, siteName = 'VNaStar Smart Link Shortener' }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginInput, setLoginInput] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('VNaStar@2026!');
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, password: loginPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccessLogin(data.user || { name: 'Admin', email: loginInput, role: 'admin' });
      } else {
        setError(data.message || 'Tên đăng nhập hoặc Mật khẩu không đúng!');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Frontend validation for username format
    const cleanUsername = regUsername.toLowerCase().trim();
    if (!/^[a-z0-9.]+$/.test(cleanUsername)) {
      setError('Tên user chỉ được gồm chữ cái viết thường (a-z), số (0-9) và dấu chấm (.). Ví dụ: xuan.manh');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          name: regName,
          email: regEmail,
          password: regPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        // Reset form
        setRegUsername('');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
      } else {
        setError(data.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin!');
      }
    } catch (err) {
      setError('Lỗi máy chủ khi đăng ký. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">{siteName}</h2>
        <p className="text-xs text-slate-400">
          Cổng đăng nhập & Đăng ký tài khoản người dùng
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
          className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LogIn className="w-4 h-4" />
          Đăng Nhập
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
          className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Đăng Ký Mới
        </button>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            Đăng Ký Thành Công!
          </div>
          <p className="text-slate-300 leading-relaxed">{successMsg}</p>
          <div className="p-2 bg-slate-900/80 rounded-lg border border-emerald-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Chờ Admin phê duyệt để bắt đầu đăng nhập.</span>
          </div>
        </div>
      )}

      {/* Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Tên User hoặc Email
            </label>
            <input
              type="text"
              value={loginInput}
              onChange={e => setLoginInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="xuan.manh hoặc admin@sls.vnastar.com"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Bạn có thể nhập tên user (ví dụ: <code className="text-amber-400">xuan.manh</code>) hoặc email.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Mật Khẩu
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Đăng Nhập
          </button>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
            <div className="font-semibold text-slate-300">Tài khoản Admin mặc định:</div>
            <div className="font-mono text-amber-300">User: admin | Email: admin@sls.vnastar.com</div>
            <div className="font-mono text-amber-300">Mật khẩu: VNaStar@2026!</div>
          </div>
        </form>
      )}

      {/* Register Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Tên User Đăng Nhập
            </label>
            <input
              type="text"
              value={regUsername}
              onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, ''))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs font-mono text-amber-300 outline-none transition-colors"
              placeholder="xuan.manh"
            />
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Chữ thường, số, có thể có dấu chấm (<code>.</code>). VD: <span className="text-amber-400">xuan.manh</span></span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Họ Và Tên Hiển Thị
            </label>
            <input
              type="text"
              value={regName}
              onChange={e => setRegName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="Nguyễn Xuân Mạnh"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Địa Chỉ Email
            </label>
            <input
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="xuanmanh@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Mật Khẩu
            </label>
            <input
              type="password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Lưu ý:</strong> Tài khoản mới tạo bắt buộc phải được Quản trị viên (Admin) phê duyệt trước khi có thể đăng nhập.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Đăng Ký Tài Khoản
          </button>
        </form>
      )}
    </div>
  );
}

