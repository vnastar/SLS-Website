import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Trash2, Search, Clock, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Edit3, X, Save, Key, User, PlusCircle, Gauge, LinkIcon } from 'lucide-react';

interface UserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  daily_limit?: number;
  max_links?: number;
  created_at: string;
}

export function UserManager() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editStatus, setEditStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [editPassword, setEditPassword] = useState('');
  const [editDailyLimit, setEditDailyLimit] = useState<number>(50);
  const [editMaxLinks, setEditMaxLinks] = useState<number>(500);
  const [isSaving, setIsSaving] = useState(false);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<'admin' | 'user'>('user');
  const [createStatus, setCreateStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [createDailyLimit, setCreateDailyLimit] = useState<number>(50);
  const [createMaxLinks, setCreateMaxLinks] = useState<number>(500);
  const [isCreating, setIsCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditPassword('');
    setEditDailyLimit(user.daily_limit !== undefined ? user.daily_limit : (user.role === 'admin' ? 10000 : 50));
    setEditMaxLinks(user.max_links !== undefined ? user.max_links : (user.role === 'admin' ? 100000 : 500));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editName,
          username: editUsername,
          email: editEmail,
          role: editRole,
          status: editStatus,
          password: editPassword.trim() || undefined,
          daily_limit: editDailyLimit,
          max_links: editMaxLinks
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Đã cập nhật thành công thông tin & giới hạn sử dụng cho "${editUsername}"!` });
        setEditingUser(null);
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Cập nhật thất bại.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Lỗi máy chủ khi cập nhật thông tin thành viên.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUsername || !createEmail || !createPassword) {
      setActionMessage({ type: 'error', text: 'Vui lòng điền đầy đủ username, email và mật khẩu!' });
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName || createUsername,
          username: createUsername,
          email: createEmail,
          password: createPassword,
          role: createRole,
          status: createStatus,
          daily_limit: createDailyLimit,
          max_links: createMaxLinks
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Đã tạo tài khoản thành công cho user "@${createUsername}"!` });
        setIsCreateOpen(false);
        // Reset Form
        setCreateName('');
        setCreateUsername('');
        setCreateEmail('');
        setCreatePassword('');
        setCreateRole('user');
        setCreateStatus('approved');
        setCreateDailyLimit(50);
        setCreateMaxLinks(500);
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Tạo tài khoản thất bại.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Lỗi máy chủ khi tạo tài khoản mới.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleApprove = async (userId: string, username: string) => {
    try {
      const res = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Đã kích hoạt thành công tài khoản user "${username}"!` });
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Thao tác thất bại.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Lỗi máy chủ khi duyệt user.' });
    }
  };

  const handleReject = async (userId: string, username: string) => {
    try {
      const res = await fetch('/api/admin/users/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Đã từ chối/khóa tài khoản "${username}".` });
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Thao tác thất bại.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Lỗi máy chủ khi khoá user.' });
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn user "${username}" khỏi hệ thống?`)) return;

    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Đã xóa tài khoản "${username}".` });
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Xóa thất bại.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Lỗi máy chủ khi xóa user.' });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ? true : user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pendingUsers = users.filter(u => u.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Quản Lý Thành Viên & Duyệt User</h2>
          </div>
          <p className="text-xs text-slate-400">
            Duyệt tài khoản mới đăng ký, phân quyền Admin/User, điều chỉnh giới hạn tạo link và cấp tài khoản trực tiếp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            Tạo Tài Khoản User
          </button>

          <button
            onClick={fetchUsers}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            Làm Mới
          </button>
        </div>
      </div>

      {/* Action Notice */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-lg ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border-red-500/50 text-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Pending Banner Alert */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Có {pendingUsers.length} tài khoản mới đăng ký đang chờ Admin phê duyệt!</span>
          </div>
          <div className="grid gap-2">
            {pendingUsers.map(u => (
              <div
                key={u.id}
                className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      @{u.username}
                    </span>
                    <span className="text-white font-semibold">{u.name}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">{u.email} • Tạo lúc: {new Date(u.created_at).toLocaleString('vi-VN')}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(u.id, u.username)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleOpenEdit(u)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleReject(u.id, u.username)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/60 text-red-300 border border-slate-700 hover:border-red-500/50 font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Từ Chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo username, email, tên..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-center overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${filterStatus === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Tất Cả ({users.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${filterStatus === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Chờ Duyệt ({pendingUsers.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${filterStatus === 'approved' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Đã Duyệt ({users.filter(u => u.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${filterStatus === 'rejected' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Từ Chối / Khóa ({users.filter(u => u.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Họ Và Tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai Trò</th>
                <th className="px-4 py-3">Giới Hạn Link</th>
                <th className="px-4 py-3">Trạng Thái</th>
                <th className="px-4 py-3">Ngày Tạo</th>
                <th className="px-4 py-3 text-right">Thao Tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-amber-300">
                      @{u.username}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" /> ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          USER
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <div className="text-amber-400 font-bold flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-amber-500" />
                          {u.daily_limit !== undefined ? u.daily_limit : (u.role === 'admin' ? '10,000' : '50')} link/ngày
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1">
                          <LinkIcon className="w-2.5 h-2.5 text-slate-500" />
                          Tối đa {u.max_links !== undefined ? u.max_links : (u.role === 'admin' ? '100,000' : '500')} link
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã Duyệt
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 border border-amber-500/50 text-amber-300 flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3 h-3 text-amber-400" /> Chờ Duyệt
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950 border border-red-500/40 text-red-300 flex items-center gap-1 w-fit">
                          <UserX className="w-3 h-3 text-red-400" /> Từ Chối / Khóa
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Sửa mọi thông tin thành viên & giới hạn"
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa & Giới Hạn
                        </button>

                        {u.role !== 'admin' && (
                          <>
                            {u.status !== 'approved' && (
                              <button
                                onClick={() => handleApprove(u.id, u.username)}
                                title="Chấp nhận duyệt"
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Duyệt
                              </button>
                            )}
                            {u.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(u.id, u.username)}
                                title="Từ chối / Tạm khóa"
                                className="px-2.5 py-1 bg-slate-800 hover:bg-amber-900/50 text-amber-300 border border-slate-700 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5" /> Khóa
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(u.id, u.username)}
                              title="Xóa tài khoản"
                              className="p-1.5 hover:bg-red-950/80 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Tạo Tài Khoản User Mới</h3>
                  <p className="text-xs text-slate-400">Cấp tài khoản trực tiếp từ hệ thống Admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tên Đăng Nhập (Username)*</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: xuanmanh"
                    value={createUsername}
                    onChange={e => setCreateUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Họ Và Tên</label>
                  <input
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={createName}
                    onChange={e => setCreateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Địa Chỉ Email*</label>
                  <input
                    type="email"
                    required
                    placeholder="user@vnastar.com"
                    value={createEmail}
                    onChange={e => setCreateEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Mật Khẩu Mới*</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={createPassword}
                    onChange={e => setCreatePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vai Trò Hệ Thống</label>
                  <select
                    value={createRole}
                    onChange={e => setCreateRole(e.target.value as 'admin' | 'user')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="user">USER (Thành viên)</option>
                    <option value="admin">ADMIN (Quản trị viên)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Trạng Thái Kích Hoạt</label>
                  <select
                    value={createStatus}
                    onChange={e => setCreateStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="approved">✅ Đã Duyệt (Hoạt động)</option>
                    <option value="pending">⏳ Chờ Duyệt</option>
                    <option value="rejected">❌ Từ Chối / Khóa</option>
                  </select>
                </div>
              </div>

              {/* Limits Section */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  Cấu Hình Giới Hạn Tạo Link Tự Định Nghĩa
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Tạo Tối Đa / Ngày (link/ngày)</label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={createDailyLimit}
                      onChange={e => setCreateDailyLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Tổng Số Link Tối Đa (max links)</label>
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      value={createMaxLinks}
                      onChange={e => setCreateMaxLinks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  {isCreating ? 'Đang Tạo...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Chỉnh Sửa Thông Tin & Giới Hạn Member</h3>
                  <p className="text-xs text-slate-400">ID: <code className="font-mono text-amber-400">{editingUser.id}</code></p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tên Đăng Nhập (Username)</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Họ Và Tên</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Địa Chỉ Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vai Trò Hệ Thống</label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as 'admin' | 'user')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="user">USER (Thành viên)</option>
                    <option value="admin">ADMIN (Quản trị viên)</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Trạng Thái Duyệt</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="approved">✅ Đã Duyệt (Hoạt động)</option>
                    <option value="pending">⏳ Chờ Duyệt</option>
                    <option value="rejected">❌ Từ Chối / Khóa</option>
                  </select>
                </div>
              </div>

              {/* Limits Adjustments */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  Chỉnh Sửa Giới Hạn Sử Dụng Link
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Tạo Tối Đa / Ngày (link/ngày)</label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={editDailyLimit}
                      onChange={e => setEditDailyLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-semibold">Tổng Số Link Tối Đa (max links)</label>
                    <input
                      type="number"
                      min={1}
                      max={1000000}
                      value={editMaxLinks}
                      onChange={e => setEditMaxLinks(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Mật Khẩu Mới (Tùy chọn)</span>
                  <span className="text-[10px] text-slate-500 font-normal">Bỏ trống nếu giữ nguyên</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới để đổi..."
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
