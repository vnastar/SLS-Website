import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  FileCheck, 
  Cpu, 
  Users, 
  Layers, 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Check, 
  Copy, 
  ArrowRight,
  Sparkles,
  Server,
  FileCode,
  Key,
  FolderTree
} from 'lucide-react';

export function ControllersRepositoriesInspector() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'requests' | 'policies' | 'repositories' | 'source'>('architecture');

  // Policy Simulator state
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'agency'>('user');
  const [isOwner, setIsOwner] = useState(true);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  // Form Request Tester State
  const [reqUrl, setReqUrl] = useState('https://sls.vnastar.com/digital-campaign');
  const [reqAlias, setReqAlias] = useState('summer-2026');
  const [reqTitle, setReqTitle] = useState('Chiến Dịch Hè VNaStar');
  const [reqExpires, setReqExpires] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);

  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleTestValidation = () => {
    const errors: Record<string, string> = {};

    if (!reqUrl) {
      errors.destination_url = 'Vui lòng nhập đường dẫn đích cần rút gọn.';
    } else if (!reqUrl.startsWith('http://') && !reqUrl.startsWith('https://')) {
      errors.destination_url = 'Đường dẫn đích phải là định dạng URL hợp lệ (http:// hoặc https://).';
    }

    if (reqAlias && !/^[a-zA-Z0-9_-]+$/.test(reqAlias)) {
      errors.alias = 'Alias chỉ được chứa chữ cái, chữ số, dấu gạch ngang (-) và gạch dưới (_).';
    }

    setValidationErrors(errors);
    setIsValidated(true);
  };

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
            <Cpu className="w-4 h-4" />
            Bước 5: Controllers, Form Requests, Policies & Repositories Layer
          </div>
          <h2 className="text-xl font-bold">Kiến Trúc Tách Lớp Chuẩn Enterprise Laravel 11</h2>
          <p className="text-xs text-slate-400 mt-1">
            Đảm bảo tính nguyên tử (Single Responsibility Principle), phân quyền Policy chặt chẽ, kiểm soát dữ liệu đầu vào qua Form Requests & Repository Pattern.
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            Kiến Trúc
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'requests' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Form Requests
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'policies' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Policies Matrix
          </button>
          <button
            onClick={() => setActiveTab('repositories')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'repositories' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Repositories
          </button>
        </div>
      </div>

      {/* TAB 1: ARCHITECTURE OVERVIEW */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-400" />
              Sơ Đồ Luồng Dữ Liệu Lớp Ứng Dụng (Data Flow Architecture)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  1. Form Request
                </div>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                  Validate dữ liệu URL, Alias, UTM parameters trước khi truy cập vào Controller.
                </p>
                <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                  CreateShortLinkRequest.php
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-purple-400 font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  2. Policy Authorization
                </div>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                  Kiểm tra quyền sở hữu link, giới hạn tạo link/ngày & vai trò Admin / User.
                </p>
                <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                  ShortLinkPolicy.php
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  3. Service & Controller
                </div>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                  Điều hướng logic, tích hợp UrlShortenerService & Redis Caching.
                </p>
                <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                  ShortLinkController.php
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-blue-400 font-bold flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  4. Repository & Database
                </div>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                  Truy vấn cơ sở dữ liệu qua Eloquent Abstraction & Redis Caching Layer.
                </p>
                <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                  ShortLinkRepository.php
                </div>
              </div>
            </div>

            {/* Service Provider Bindings */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Service Provider Bindings (AppServiceProvider.php)
              </span>
              <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto">
{`$this->app->bind(ShortLinkRepositoryInterface::class, ShortLinkRepository::class);
$this->app->bind(UserRepositoryInterface::class, UserRepository::class);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORM REQUEST TESTER */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              Thử Nghiệm Form Request Validation Sandbox (`CreateShortLinkRequest`)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination URL *</label>
                  <input
                    type="text"
                    value={reqUrl}
                    onChange={e => setReqUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
                  />
                  {validationErrors.destination_url && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{validationErrors.destination_url}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Alias</label>
                  <input
                    type="text"
                    value={reqAlias}
                    onChange={e => setReqAlias(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-amber-300"
                  />
                  {validationErrors.alias && (
                    <span className="text-[11px] text-rose-400 mt-1 block">{validationErrors.alias}</span>
                  )}
                </div>

                <button
                  onClick={handleTestValidation}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Chạy Kiểm Tra Validation
                </button>
              </div>

              {/* Result Box */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-300">Kết Quả Validation Response:</span>

                {isValidated ? (
                  Object.keys(validationErrors).length === 0 ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        VALIDATION PASSED (200 OK)
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        Tất cả trường dữ liệu đáp ứng hoàn toàn quy tắc của CreateShortLinkRequest.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        HTTP 422 UNPROCESSABLE ENTITY
                      </div>
                      <pre className="text-[11px] bg-slate-900 p-2 rounded border border-slate-800 text-rose-300 overflow-x-auto">
                        {JSON.stringify({ errors: validationErrors }, null, 2)}
                      </pre>
                    </div>
                  )
                ) : (
                  <p className="text-xs text-slate-500 font-mono">Bấm button "Chạy Kiểm Tra Validation" để xem phản hồi.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES MATRIX */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Mô Phỏng Phân Quyền Hợp Lệ Với `ShortLinkPolicy.php`
            </h3>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vai Trò Người Dùng (Role)</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold"
                >
                  <option value="user">User Thường</option>
                  <option value="agency">Agency Premium</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quyền Sở Hữu Link</label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isOwner}
                    onChange={e => setIsOwner(e.target.checked)}
                    className="accent-amber-500"
                  />
                  Chính chủ (Link do user tạo)
                </label>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Trạng Thái Giới Hạn Ngày</label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={dailyLimitReached}
                    onChange={e => setDailyLimitReached(e.target.checked)}
                    className="accent-amber-500"
                  />
                  Đã đạt giới hạn link/ngày
                </label>
              </div>
            </div>

            {/* Authorization Outcome Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Hành Động (Ability)</th>
                    <th className="p-3">Quy Tắc Authorization</th>
                    <th className="p-3 text-right">Kết Quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-3 font-bold text-amber-300">create ($user)</td>
                    <td className="p-3 font-sans text-slate-400">Không đạt giới hạn daily_limit_reached</td>
                    <td className="p-3 text-right">
                      {selectedRole === 'admin' || !dailyLimitReached ? (
                        <span className="text-emerald-400 font-bold">ALLOWED</span>
                      ) : (
                        <span className="text-rose-400 font-bold">DENIED (Limit)</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-amber-300">update ($user, $link)</td>
                    <td className="p-3 font-sans text-slate-400">Admin HOẶC là chủ sở hữu link ($user-&gt;id === $link-&gt;user_id)</td>
                    <td className="p-3 text-right">
                      {selectedRole === 'admin' || isOwner ? (
                        <span className="text-emerald-400 font-bold">ALLOWED</span>
                      ) : (
                        <span className="text-rose-400 font-bold">DENIED</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-amber-300">delete ($user, $link)</td>
                    <td className="p-3 font-sans text-slate-400">Admin HOẶC là chủ sở hữu link</td>
                    <td className="p-3 text-right">
                      {selectedRole === 'admin' || isOwner ? (
                        <span className="text-emerald-400 font-bold">ALLOWED</span>
                      ) : (
                        <span className="text-rose-400 font-bold">DENIED</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPOSITORIES */}
      {activeTab === 'repositories' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Các Hàm Chính Trong `ShortLinkRepository.php`
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold">findByAlias(string $alias)</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Tìm kiếm ShortLink cùng thông tin LinkMetadata bằng alias.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold">getUserLinks(int $userId, int $perPage)</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Lấy danh sách link của người dùng có phân trang 20 link/trang.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold">getAllPaginated(int $perPage, array $filters)</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Truy vấn toàn bộ link hệ thống hỗ trợ lọc từ khóa search và status cho Admin.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold">incrementClick(ShortLink $shortLink)</span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Tăng tổng số lượt click atomic trong MySQL Database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
