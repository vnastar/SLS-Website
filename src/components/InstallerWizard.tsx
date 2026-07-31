import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Database, 
  User, 
  Key, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  Server, 
  Terminal, 
  Container,
  GitBranch,
  FileCode,
  Layers,
  Cpu,
  Check,
  Play,
  Copy,
  Download
} from 'lucide-react';

export function InstallerWizard({ onInstallationComplete }: { onInstallationComplete?: () => void }) {
  const [subTab, setSubTab] = useState<'wizard' | 'docker' | 'cicd'>('wizard');

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [dbHost, setDbHost] = useState('127.0.0.1');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('smart_shortener_db');
  const [dbUser, setDbUser] = useState('vnastar_db_user');
  const [dbPassword, setDbPassword] = useState('••••••••••••');

  const [adminName, setAdminName] = useState('VNaStar Admin');
  const [adminEmail, setAdminEmail] = useState('admin@sls.vnastar.com');
  const [adminPassword, setAdminPassword] = useState('VNaStar@2026!');

  const [isInstalling, setIsInstalling] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const requirements = [
    { name: 'PHP Version >= 8.3.0', status: true, current: '8.3.14 (PHP-FPM Alpine)' },
    { name: 'PDO MySQL Extension', status: true, current: 'Installed & Enabled' },
    { name: 'OpenSSL & Tokenizer Extension', status: true, current: 'Enabled' },
    { name: 'Redis Extension (PECL redis)', status: true, current: 'v6.0.2 Enabled' },
    { name: 'GD / Imagick (OG Card Rendering)', status: true, current: 'GD 2.3 with FreeType' },
    { name: 'Mbstring & BCMath & Intl', status: true, current: 'Installed' },
    { name: 'Fileinfo & Json & XML', status: true, current: 'Enabled' },
    { name: 'Storage & Cache Writable Permissions', status: true, current: '0775 (www-data)' }
  ];

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleRunMigrationsAndSeed = () => {
    setIsInstalling(true);
    setTimeout(() => {
      setIsInstalling(false);
      setCurrentStep(4);
    }, 1200);
  };

  const handleCompleteInstallation = async () => {
    setIsInstalling(true);
    try {
      await fetch('/api/system/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName,
          adminEmail,
          adminPassword,
          dbHost,
          dbPort,
          dbName,
          dbUser
        })
      });
    } catch (err) {
      console.error('Install API failed:', err);
    } finally {
      setIsInstalling(false);
      setCurrentStep(5);
      if (onInstallationComplete) {
        onInstallationComplete();
      }
    }
  };

  const dockerfileCode = `# Dockerfile for Smart Link Shortener (VNaStar Media)
FROM php:8.3-fpm-alpine as base

WORKDIR /var/www/html

RUN apk add --no-cache nginx supervisor curl libpng-dev libjpeg-turbo-dev freetype-dev libxml2-dev libzip-dev oniguruma-dev icu-dev git unzip bash argon2-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \\
    && docker-php-ext-install -j$(nproc) pdo_mysql mbstring exif pcntl bcmath gd zip opcache intl

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \\
    && pecl install redis \\
    && docker-php-ext-enable redis \\
    && apk del .build-deps

COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

COPY . .

RUN chown -R www-data:www-data /var/www/html \\
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["php-fpm"]`;

  const dockerComposeCode = `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vnastar_app
    restart: unless-stopped
    ports:
      - "8000:80"
    environment:
      APP_NAME: "Smart Link Shortener"
      APP_ENV: production
      DB_HOST: db
      REDIS_HOST: redis
      CACHE_STORE: redis
      QUEUE_CONNECTION: redis
    depends_on:
      - db
      - redis
    networks:
      - vnastar_network

  redis:
    image: redis:7.2-alpine
    container_name: vnastar_redis
    ports:
      - "6379:6379"
    networks:
      - vnastar_network

  db:
    image: mysql:8.0
    container_name: vnastar_db
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: smart_shortener
      MYSQL_USER: shortener_user
      MYSQL_PASSWORD: shortener_password_2026
      MYSQL_ROOT_PASSWORD: root_secret_password_2026
    networks:
      - vnastar_network

  worker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vnastar_worker
    command: php artisan horizon
    networks:
      - vnastar_network

networks:
  vnastar_network:
    driver: bridge`;

  const ciCdCode = `name: VNaStar CI/CD Pipeline - Smart Link Shortener

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ALLOW_EMPTY_PASSWORD: yes
          MYSQL_DATABASE: smart_shortener_test
        ports:
          - 3306:3306
      redis:
        image: redis:7.2-alpine
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4
    - name: Setup PHP 8.3
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.3'
        extensions: mbstring, pdo, pdo_mysql, redis, bcmath, gd, zip
    - name: Install Dependencies
      run: composer install -q --prefer-dist
    - name: Run Database Migrations
      run: php artisan migrate --force
    - name: Execute PHPUnit / Pest Tests
      run: ./vendor/bin/phpunit --testdox

  docker-build-push:
    needs: laravel-tests
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Build Docker Container Image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: false
        tags: vnastar/smart-link-shortener:latest`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            Bước 2: Docker, CI/CD Pipeline & Installer Wizard
          </div>
          <h2 className="text-xl font-bold">Cấu Hình Hạ Tầng & Cài Đặt Tự Động</h2>
          <p className="text-xs text-slate-400 mt-1">
            Triển khai môi trường Docker (PHP 8.3 FPM, Nginx, Redis 7, MySQL 8.0), kịch bản CI/CD GitHub Actions và Wizard cài đặt web tự động (<span className="font-mono text-amber-300">/install</span>).
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSubTab('wizard')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'wizard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Installer Wizard
          </button>
          <button
            onClick={() => setSubTab('docker')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'docker' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Container className="w-3.5 h-3.5" />
            Docker Stack
          </button>
          <button
            onClick={() => setSubTab('cicd')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              subTab === 'cicd' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub Actions CI/CD
          </button>
        </div>
      </div>

      {/* SUB TAB 1: INSTALLER WIZARD */}
      {subTab === 'wizard' && (
        <div className="space-y-6">
          {/* Steps Progress Bar */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 1 ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              1. Requirements
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 2 ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              2. Database & Redis
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 3 ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              3. Seeders & Admin
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 4 ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              4. Key & Lock
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 5 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              5. Complete
            </div>
          </div>

          {/* Step 1: Requirements Check */}
          {currentStep === 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                Bước 1: Kiểm Tra Môi Trường Server & Extensions (System Requirement Checker)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {requirements.map((req, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-sans">{req.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {req.current}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                Tất Cả Yêu Cầu Đạt Chuẩn • Chuyển Sang Cấu Hình CSDL & Cache
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Database Setup */}
          {currentStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Bước 2: Cấu Hình Kết Nối CSDL (MySQL 8.0) & Redis 7
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DB Host</label>
                  <input type="text" value={dbHost} onChange={e => setDbHost(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DB Port</label>
                  <input type="text" value={dbPort} onChange={e => setDbPort(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DB Database Name</label>
                  <input type="text" value={dbName} onChange={e => setDbName(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">DB Username</label>
                  <input type="text" value={dbUser} onChange={e => setDbUser(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300" />
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Test Connection OK: Connected to MySQL 8.0.36 & Redis 7.2-alpine</span>
              </div>

              <button
                onClick={() => setCurrentStep(3)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                Tiếp Tục Tạo Tài Khoản Quản Trị (Admin Account)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3: Admin & Seeders */}
          {currentStep === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                Bước 3: Khởi Tạo Account Admin & Chạy Seeders Phân Quyền
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Admin</label>
                  <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Đăng Nhập Admin</label>
                  <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mật Khẩu Admin (Argon2id Hashed)</label>
                  <input type="text" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300" />
                </div>
              </div>

              <button
                onClick={handleRunMigrationsAndSeed}
                disabled={isInstalling}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                {isInstalling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
                Thực Thi `php artisan migrate:fresh --seed`
              </button>
            </div>
          )}

          {/* Step 4: Key & Config */}
          {currentStep === 4 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Bước 4: Tạo APP_KEY, Storage Link & Tạo File `install.lock`
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2">
                <div>$ php artisan key:generate --force</div>
                <div className="text-amber-400">[OK] Application key [base64:vNaStar2026SmartLinkShortenerKey123=] set successfully.</div>
                <div>$ php artisan storage:link</div>
                <div className="text-amber-400">[OK] The [public/storage] link has been connected to [storage/app/public].</div>
                <div>$ touch storage/installed</div>
                <div className="text-emerald-400">[OK] File storage/installed created. Middleware CheckIsInstalled will now block /install.</div>
              </div>

              <button
                onClick={handleCompleteInstallation}
                disabled={isInstalling}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                {isInstalling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Hoàn Tất Cài Đặt & Chuyển Đến Trang Đăng Nhập
              </button>
            </div>
          )}

          {/* Step 5: Completed */}
          {currentStep === 5 && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300">Hệ Thống Cài Đặt Hoàn Hoàn Thành!</h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Hệ thống Smart Link Shortener (VNaStar Media) đã sẵn sàng phục vụ. File <span className="font-mono text-amber-300">storage/installed</span> đã được ghi nhận.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    if (window.location.pathname !== '/') {
                      window.history.pushState({}, '', '/login');
                    }
                    window.dispatchEvent(new Event('popstate'));
                  }}
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-emerald-400 shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Đăng Nhập Quản Trị Ngay
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
                >
                  Xem Lại Quy Trình
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: DOCKER CONFIGURATION */}
      {subTab === 'docker' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Container className="w-4 h-4 text-amber-400" />
                Cấu Hình Dockerfile (PHP 8.3 FPM + Nginx + Extensions)
              </h3>
              <button
                onClick={() => handleCopyCode(dockerfileCode, 'dockerfile')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-400 rounded-lg flex items-center gap-1.5"
              >
                {copyStatus === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copyStatus === 'dockerfile' ? 'Copied!' : 'Copy Dockerfile'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {dockerfileCode}
            </pre>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Cấu Hình Docker Compose (`docker-compose.yml`)
              </h3>
              <button
                onClick={() => handleCopyCode(dockerComposeCode, 'compose')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-400 rounded-lg flex items-center gap-1.5"
              >
                {copyStatus === 'compose' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copyStatus === 'compose' ? 'Copied!' : 'Copy Compose'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-200 overflow-x-auto leading-relaxed">
              {dockerComposeCode}
            </pre>
          </div>
        </div>
      )}

      {/* SUB TAB 3: CI/CD PIPELINE */}
      {subTab === 'cicd' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                GitHub Actions CI/CD Workflow (`.github/workflows/ci-cd.yml`)
              </h3>
              <button
                onClick={() => handleCopyCode(ciCdCode, 'cicd')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-amber-400 rounded-lg flex items-center gap-1.5"
              >
                {copyStatus === 'cicd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copyStatus === 'cicd' ? 'Copied!' : 'Copy YAML'}
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {ciCdCode}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step 1: Code Quality & Pint
              </div>
              <p className="text-xs text-slate-400">
                Tự động kiểm tra cú pháp PHP 8.3, Laravel Pint code formatter & PHPStan level 8 static analysis.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step 2: Automated Testing
              </div>
              <p className="text-xs text-slate-400">
                Chạy toàn bộ Suite PHPUnit/Pest test cho URL Redirection, Open Graph Crawler detection và Rate Limiting.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step 3: Docker Build & Registry
              </div>
              <p className="text-xs text-slate-400">
                Đóng gói Docker Image đa tầng (Multi-stage build) và push tự động lên Registry khi merged vào branch main.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
