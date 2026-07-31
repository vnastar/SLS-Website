import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  GitMerge, 
  Key, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Link as LinkIcon, 
  FileText, 
  BarChart3, 
  Copy, 
  Check, 
  Code2,
  Terminal
} from 'lucide-react';

export function DatabaseSchemaInspector() {
  const [activeModel, setActiveModel] = useState<'User' | 'ShortLink' | 'LinkMetadata' | 'ClickLog' | 'UserDailyLimit'>('ShortLink');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const models = [
    {
      name: 'User',
      table: 'users',
      description: 'Lưu thông tin người dùng, phân quyền (Admin/User), giới hạn tạo link hàng ngày và bảo mật 2FA.',
      relations: [
        { type: 'hasMany', target: 'ShortLink', key: 'user_id' },
        { type: 'hasMany', target: 'UserDailyLimit', key: 'user_id' }
      ],
      fields: [
        { name: 'id', type: 'unsignedBigInteger', key: 'PK', nullable: false, desc: 'Khoá chính tự tăng' },
        { name: 'name', type: 'string(255)', key: '-', nullable: false, desc: 'Họ tên hiển thị' },
        { name: 'email', type: 'string(255)', key: 'UNIQUE', nullable: false, desc: 'Địa chỉ email đăng nhập' },
        { name: 'password', type: 'string(255)', key: '-', nullable: false, desc: 'Mật khẩu mã hoá Argon2id / Bcrypt' },
        { name: 'role', type: "enum('admin','user','guest')", key: 'INDEX', nullable: false, desc: 'Phân quyền tài khoản' },
        { name: 'daily_limit', type: 'unsignedInteger', key: '-', nullable: false, desc: 'Số link tối đa tạo trong 1 ngày' },
        { name: 'is_active', type: 'boolean', key: 'INDEX', nullable: false, desc: 'Trạng thái tài khoản (1: Active, 0: Locked)' },
        { name: 'two_factor_secret', type: 'text', key: '-', nullable: true, desc: 'Mã bí mật 2FA TOTP App (Google Auth)' },
      ],
      code: `class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'daily_limit', 'is_active', 'two_factor_secret'
    ];

    public function shortLinks(): HasMany
    {
        return $this->hasMany(ShortLink::class);
    }

    public function dailyLimits(): HasMany
    {
        return $this->hasMany(UserDailyLimit::class);
    }
}`
    },
    {
      name: 'ShortLink',
      table: 'short_links',
      description: 'Bảng cốt lõi chứa đường dẫn rút gọn, Alias độc bản, URL đích, mật khẩu truy cập & đếm Lượt Click.',
      relations: [
        { type: 'belongsTo', target: 'User', key: 'user_id' },
        { type: 'hasOne', target: 'LinkMetadata', key: 'short_link_id' },
        { type: 'hasMany', target: 'ClickLog', key: 'short_link_id' }
      ],
      fields: [
        { name: 'id', type: 'unsignedBigInteger', key: 'PK', nullable: false, desc: 'Khoá chính tự tăng' },
        { name: 'user_id', type: 'foreignId', key: 'FK', nullable: true, desc: 'ID người tạo link (null nếu khách tạo)' },
        { name: 'alias', type: 'string(32)', key: 'UNIQUE', nullable: false, desc: 'Alias duy nhất (VD: /vnastar-2026)' },
        { name: 'destination_url', type: 'text', key: '-', nullable: false, desc: 'Đường dẫn gốc cần chuyển hướng' },
        { name: 'title', type: 'string(255)', key: '-', nullable: true, desc: 'Tiêu đề ghi chú link' },
        { name: 'status', type: "enum('active','paused','expired','blocked')", key: 'INDEX', nullable: false, desc: 'Trạng thái hoạt động' },
        { name: 'expires_at', type: 'timestamp', key: 'INDEX', nullable: true, desc: 'Thời điểm hết hạn link' },
        { name: 'password', type: 'string(255)', key: '-', nullable: true, desc: 'Mật khẩu bảo vệ truy cập' },
        { name: 'click_count', type: 'unsignedBigInteger', key: 'INDEX', nullable: false, desc: 'Tổng số lượt click thực tế' },
        { name: 'utm_params', type: 'json', key: '-', nullable: true, desc: 'Cấu hình thẻ UTM Google Analytics' },
      ],
      code: `class ShortLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'alias', 'destination_url', 'title', 'status',
        'expires_at', 'password', 'click_count', 'utm_params'
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function metadata(): HasOne { return $this->hasOne(LinkMetadata::class); }
    public function clickLogs(): HasMany { return $this->hasMany(ClickLog::class); }
}`
    },
    {
      name: 'LinkMetadata',
      table: 'link_metadatas',
      description: 'Bảng chứa các thông số tùy chỉnh Open Graph (Social Preview) nhằm bypass thumbnail chặn của Facebook/Zalo.',
      relations: [
        { type: 'belongsTo', target: 'ShortLink', key: 'short_link_id' }
      ],
      fields: [
        { name: 'id', type: 'unsignedBigInteger', key: 'PK', nullable: false, desc: 'Khoá chính' },
        { name: 'short_link_id', type: 'foreignId', key: 'FK, UNIQUE', nullable: false, desc: 'LK duy nhất 1-1 với short_links' },
        { name: 'og_title', type: 'string(255)', key: '-', nullable: true, desc: 'Tiêu đề hiển thị khi share Facebook/Zalo' },
        { name: 'og_description', type: 'text', key: '-', nullable: true, desc: 'Mô tả hiển thị thẻ xem trước Social' },
        { name: 'og_image', type: 'string(255)', key: '-', nullable: true, desc: 'Đường dẫn ảnh Thumbnail OG Custom' },
        { name: 'facebook_app_id', type: 'string(255)', key: '-', nullable: true, desc: 'App ID Facebook Open Graph Verification' },
        { name: 'use_custom_og', type: 'boolean', key: '-', nullable: false, desc: '1: Dùng OG Custom, 0: Dùng Crawler Tự Động' },
      ],
      code: `class LinkMetadata extends Model
{
    use HasFactory;

    protected $fillable = [
        'short_link_id', 'og_title', 'og_description', 'og_image', 'facebook_app_id', 'use_custom_og'
    ];

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}`
    },
    {
      name: 'ClickLog',
      table: 'click_logs',
      description: 'Ghi chép từng lượt truy cập chi tiết (IP, Quốc gia, Thành phố, Thiết bị, Browser, Crawler status) phục vụ Thống kê Analytics.',
      relations: [
        { type: 'belongsTo', target: 'ShortLink', key: 'short_link_id' }
      ],
      fields: [
        { name: 'id', type: 'unsignedBigInteger', key: 'PK', nullable: false, desc: 'Khoá chính log' },
        { name: 'short_link_id', type: 'foreignId', key: 'FK', nullable: false, desc: 'Thuộc về ShortLink ID' },
        { name: 'ip_address', type: 'string(45)', key: 'INDEX', nullable: true, desc: 'Địa chỉ IPv4/IPv6 client' },
        { name: 'country_code', type: 'string(2)', key: 'INDEX', nullable: true, desc: 'Mã quốc gia ISO (VN, US...)' },
        { name: 'city', type: 'string(255)', key: '-', nullable: true, desc: 'Tên thành phố' },
        { name: 'device', type: 'string(32)', key: 'INDEX', nullable: true, desc: 'Thiết bị (mobile, desktop, tablet)' },
        { name: 'os', type: 'string(32)', key: '-', nullable: true, desc: 'Hệ điều hành (iOS, Android, Windows...)' },
        { name: 'browser', type: 'string(32)', key: '-', nullable: true, desc: 'Trình duyệt (Chrome, Safari, Zalo...)' },
        { name: 'referer', type: 'text', key: '-', nullable: true, desc: 'Nguồn truy cập giới thiệu' },
        { name: 'is_crawler', type: 'boolean', key: 'INDEX', nullable: false, desc: '1: Là Bot Facebook/Zalo, 0: Người dùng thật' },
        { name: 'created_at', type: 'timestamp', key: 'INDEX', nullable: false, desc: 'Thời gian click' },
      ],
      code: `class ClickLog extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'short_link_id', 'ip_address', 'country_code', 'city',
        'device', 'os', 'browser', 'referer', 'is_crawler', 'created_at'
    ];

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}`
    },
    {
      name: 'UserDailyLimit',
      table: 'user_daily_limits',
      description: 'Theo dõi hạn ngạch tạo link trong từng ngày của từng tài khoản người dùng, chống Spam API.',
      relations: [
        { type: 'belongsTo', target: 'User', key: 'user_id' }
      ],
      fields: [
        { name: 'id', type: 'unsignedBigInteger', key: 'PK', nullable: false, desc: 'Khoá chính' },
        { name: 'user_id', type: 'foreignId', key: 'FK', nullable: false, desc: 'ID người dùng' },
        { name: 'date', type: 'date', key: 'INDEX', nullable: false, desc: 'Ngày ghi nhận (YYYY-MM-DD)' },
        { name: 'links_created', type: 'unsignedInteger', key: '-', nullable: false, desc: 'Số link đã tạo trong ngày' },
      ],
      code: `class UserDailyLimit extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'date', 'links_created'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`
    }
  ];

  const currentModelData = models.find(m => m.name === activeModel)!;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            Bước 3: Database Migrations, Models, Relations & Seeders
          </div>
          <h2 className="text-xl font-bold">Cấu Trúc CSDL & Eloquent Models Chi Tiết</h2>
          <p className="text-xs text-slate-400 mt-1">
            Thiết kế chuẩn hóa Relational Database (MySQL 8.0) với đầy đủ Indexes, Cascades, Foreign Keys và Relationships.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          5 Migrations & 5 Models Ready
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {models.map(model => (
          <button
            key={model.name}
            onClick={() => setActiveModel(model.name as any)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeModel === model.name
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold shadow'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-mono text-slate-400">table: {model.table}</div>
            <div className="text-sm font-bold mt-0.5">{model.name}</div>
          </button>
        ))}
      </div>

      {/* Model Inspector Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">Model {currentModelData.name}</span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-amber-300 rounded font-mono text-xs border border-slate-700">
                table: `{currentModelData.table}`
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentModelData.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(currentModelData.code, currentModelData.name)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700"
            >
              {copiedCode === currentModelData.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode === currentModelData.name ? 'Copied Model!' : 'Copy Eloquent Model'}
            </button>
          </div>
        </div>

        {/* Relationships Badges */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GitMerge className="w-3.5 h-3.5 text-amber-400" />
            Eloquent Relationships
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentModelData.relations.map((rel, i) => (
              <div key={i} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-mono">
                <span className="text-amber-400 font-bold">{rel.type}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-emerald-400 font-bold">{rel.target}</span>
                <span className="text-slate-500 text-[10px]">({rel.key})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fields Table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-amber-400" />
            Danh Sách Trường (Database Columns Schema)
          </h4>
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Column Name</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Key / Index</th>
                  <th className="p-3">Nullable</th>
                  <th className="p-3 font-sans">Ghi Chú Tính Năng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                {currentModelData.fields.map((field, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-amber-300">{field.name}</td>
                    <td className="p-3 text-slate-400">{field.type}</td>
                    <td className="p-3">
                      {field.key === 'PK' && <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">PRIMARY KEY</span>}
                      {field.key === 'FK' && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold">FOREIGN KEY</span>}
                      {field.key === 'FK, UNIQUE' && <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-bold">FK UNIQUE 1-1</span>}
                      {field.key === 'UNIQUE' && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold">UNIQUE INDEX</span>}
                      {field.key === 'INDEX' && <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">INDEXED</span>}
                      {field.key === '-' && <span className="text-slate-600">-</span>}
                    </td>
                    <td className="p-3">
                      {field.nullable ? <span className="text-amber-400 font-bold">YES</span> : <span className="text-slate-500">NO</span>}
                    </td>
                    <td className="p-3 font-sans text-slate-300">{field.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            Laravel Eloquent Model Source (`app/Models/{currentModelData.name}.php`)
          </h4>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {currentModelData.code}
          </pre>
        </div>
      </div>

      {/* Database Seeder Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            Seeder Dữ Liệu Mẫu Hệ Thống (`database/seeders/RolesAndPermissionsSeeder.php`)
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            Default Admin & Demo ShortLinks Seeded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              1. Admin Account (Full Permissions)
            </div>
            <div className="text-slate-300">Email: <span className="text-emerald-300">admin@sls.vnastar.com</span></div>
            <div className="text-slate-300">Password: <span className="text-amber-300">VNaStar@2026!</span></div>
            <div className="text-slate-300">Role: <span className="text-purple-300">admin</span> (Limit: 10,000 links/day)</div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              2. Demo User Account
            </div>
            <div className="text-slate-300">Email: <span className="text-emerald-300">demo@sls.vnastar.com</span></div>
            <div className="text-slate-300">Password: <span className="text-amber-300">DemoUser2026!</span></div>
            <div className="text-slate-300">Role: <span className="text-blue-300">user</span> (Limit: 50 links/day)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
