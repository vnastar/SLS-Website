import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Trash2, Search, Clock, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface UserRecord {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function UserManager() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Quản Lý & Phê Duyệt Tài Khoản Người Dùng</h2>
          </div>
          <p className="text-xs text-slate-400">
            Duyệt đăng ký tài khoản mới, kiểm tra quyền truy cập và quản lý user trong hệ thống.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          Làm Mới Danh Sách
        </button>
      </div>

      {/* Action Notice */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border-red-500/50 text-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold ml-4"
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
                    Chấp Nhận / Duyệt
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
            placeholder="Tìm theo username (VD: xuan.manh), email, tên..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Tất Cả ({users.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Chờ Duyệt ({pendingUsers.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'approved' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Đã Duyệt ({users.filter(u => u.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'rejected' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
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
                <th className="px-4 py-3">Trạng Thái</th>
                <th className="px-4 py-3">Ngày Tạo</th>
                <th className="px-4 py-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
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
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-1.5">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
