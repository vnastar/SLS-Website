import React, { useState } from 'react';
import { 
  FolderTree, 
  Database, 
  Package, 
  Globe, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Code,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SYSTEM_BLUEPRINT } from '../data/blueprintData';

export function Step1Blueprint({ onNextStep }: { onNextStep?: () => void }) {
  const [activeTab, setActiveTab] = useState<'tree' | 'schema' | 'packages' | 'routes'>('tree');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              BƯỚC 1: SYSTEM DESIGN & BLUEPRINT SPECIFICATION
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {SYSTEM_BLUEPRINT.project_name}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Bản quyền thuộc về <span className="text-amber-300 font-semibold">{SYSTEM_BLUEPRINT.copyright}</span> • Production-Ready Architecture Blueprint
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PHP 8.3 / Laravel 12
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
              MySQL + Redis
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'tree'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          1. Directory Tree ({SYSTEM_BLUEPRINT.project_name})
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'schema'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          2. ERD / Database Schema ({SYSTEM_BLUEPRINT.database_schema.length} Bảng)
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'packages'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          3. Composer & NPM Packages ({SYSTEM_BLUEPRINT.composer_packages.length + SYSTEM_BLUEPRINT.npm_packages.length})
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'routes'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          4. Web & API Routes List ({SYSTEM_BLUEPRINT.routes_web.length + SYSTEM_BLUEPRINT.routes_api.length})
        </button>
      </div>

      {/* Tab 1: Directory Tree */}
      {activeTab === 'tree' && (
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-200 font-mono text-sm overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400 font-sans">
            <span className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-400" />
              Laravel 12 Project Structure Pattern (PSR-12, Service & Repository Layer)
            </span>
            <span className="text-slate-500">utf-8</span>
          </div>
          <pre className="text-emerald-400 leading-relaxed">{SYSTEM_BLUEPRINT.directory_tree}</pre>
        </div>
      )}

      {/* Tab 2: ERD & Database Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYSTEM_BLUEPRINT.database_schema.map((table) => (
              <div key={table.table} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    <Database className="w-4 h-4 text-amber-500" />
                    Bảng: <span className="text-amber-600 dark:text-amber-400">{table.table}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-sans">{table.columns.length} Cột</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {table.columns.map((col) => (
                    <div key={col.name} className="p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 font-mono hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{col.name}</span>
                        {col.key && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            col.key.includes('PK') ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                            col.key.includes('FK') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {col.key}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <span className="text-slate-600 dark:text-slate-300 font-mono">{col.type}</span>
                        <span className="text-[11px] font-sans text-slate-400 italic">({col.notes})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Composer & NPM Packages */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Composer Packages */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              Composer Packages (Backend PHP 8.3+)
            </h3>
            <div className="space-y-3">
              {SYSTEM_BLUEPRINT.composer_packages.map((pkg) => (
                <div key={pkg.name} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-900 dark:text-slate-200">
                    <span className="text-amber-600 dark:text-amber-400">{pkg.name}</span>
                    <span className="text-slate-500">{pkg.version}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{pkg.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NPM Packages */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-sky-500" />
              NPM Frontend & Build Packages
            </h3>
            <div className="space-y-3">
              {SYSTEM_BLUEPRINT.npm_packages.map((pkg) => (
                <div key={pkg.name} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-900 dark:text-slate-200">
                    <span className="text-sky-600 dark:text-sky-400">{pkg.name}</span>
                    <span className="text-slate-500">{pkg.version}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{pkg.purpose}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                STRICT COMPLIANCE RULE:
              </div>
              <p>Frontend sử dụng Blade Template + Tailwind CSS v4 + AlpineJS. Hoàn toàn 100% Server Side Rendering (SSR), không SPA, không React/Vue runtime trên bản Laravel thật.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Routes List */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center justify-between">
              <span>Web Routes (`routes/web.php`)</span>
              <span className="text-xs font-normal text-slate-500">{SYSTEM_BLUEPRINT.routes_web.length} Endpoints</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">HTTP Method</th>
                    <th className="p-3">Path</th>
                    <th className="p-3">Controller @ Action</th>
                    <th className="p-3">Middleware</th>
                    <th className="p-3 font-sans">Mô tả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SYSTEM_BLUEPRINT.routes_web.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          r.method === 'GET' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          r.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {r.method}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{r.path}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{r.controller}</td>
                      <td className="p-3 text-slate-500">{r.middleware}</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center justify-between">
              <span>API Routes (`routes/api.php`)</span>
              <span className="text-xs font-normal text-slate-500">{SYSTEM_BLUEPRINT.routes_api.length} Endpoints</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Method</th>
                    <th className="p-3">Endpoint</th>
                    <th className="p-3">Controller</th>
                    <th className="p-3 font-sans">Mô tả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SYSTEM_BLUEPRINT.routes_api.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          r.method === 'GET' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {r.method}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{r.path}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{r.controller}</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation & Step 2 Prompt Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            BƯỚC 1 ĐÃ HOÀN THÀNH XUẤT SẮC & SẴN SÀNG!
          </div>
          <p className="text-xs text-slate-400">
            Hệ thống đã thiết kế xong Directory Tree, Database ERD Schema, Composer/NPM packages và Routes. Hãy sẵn sàng để tiếp tục triển khai các bước kế tiếp khi được yêu cầu.
          </p>
        </div>
      </div>
    </div>
  );
}
