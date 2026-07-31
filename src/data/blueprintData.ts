export const SYSTEM_BLUEPRINT = {
  project_name: "Smart Link Shortener",
  copyright: "VNaStar Media",
  tech_stack: {
    backend: "PHP 8.3+, Laravel 12",
    database: "MySQL 8.0 / MariaDB 10.11",
    cache_queue: "Redis 7.x (Cache, Session, Horizon Worker)",
    frontend: "Blade Templates, Tailwind CSS v4, AlpineJS v3 (100% Server Side Rendering)",
    architecture: "MVC, Service Layer, Repository Pattern, Middleware, Events/Listeners, Horizon Queue Jobs"
  },
  directory_tree: `smart-link-shortener/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── ResetDailyLinkLimits.php
│   ├── Events/
│   │   └── LinkVisited.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── LinkManagementController.php
│   │   │   │   └── UserManagementController.php
│   │   │   ├── Auth/
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── Passkey2FAController.php
│   │   │   │   └── SocialiteController.php
│   │   │   ├── Installer/
│   │   │   │   └── InstallWizardController.php
│   │   │   ├── LinkController.php
│   │   │   ├── MetadataController.php
│   │   │   └── RedirectController.php
│   │   ├── Middleware/
│   │   │   ├── CrawlerDetectMiddleware.php
│   │   │   ├── CheckDailyLinkLimit.php
│   │   │   ├── EnsureSystemIsInstalled.php
│   │   │   └── SecurityHeadersMiddleware.php
│   │   └── Requests/
│   │       ├── CreateShortLinkRequest.php
│   │       └── UpdateMetadataRequest.php
│   ├── Jobs/
│   │   └── ProcessClickAnalyticsJob.php
│   ├── Listeners/
│   │   └── LogLinkVisit.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── ShortLink.php
│   │   ├── LinkMetadata.php
│   │   ├── ClickLog.php
│   │   └── UserDailyLimit.php
│   ├── Policies/
│   │   ├── ShortLinkPolicy.php
│   │   └── UserPolicy.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   ├── ShortLinkRepositoryInterface.php
│   │   │   └── AnalyticsRepositoryInterface.php
│   │   └── Eloquent/
│   │       ├── ShortLinkRepository.php
│   │       └── AnalyticsRepository.php
│   └── Services/
│       ├── CrawlerDetectorService.php
│       ├── ImageUploadService.php
│       ├── QRCodeGeneratorService.php
│       └── ShortLinkService.php
├── config/
│   ├── crawler.php
│   ├── horizon.php
│   └── security.php
├── database/
│   ├── factories/
│   ├── migrations/
│   │   ├── 2026_01_01_000001_create_users_table.php
│   │   ├── 2026_01_01_000002_create_short_links_table.php
│   │   ├── 2026_01_01_000003_create_link_metadatas_table.php
│   │   ├── 2026_01_01_000004_create_click_logs_table.php
│   │   ├── 2026_01_01_000005_create_user_daily_limits_table.php
│   │   └── 2026_01_01_000006_create_webauthn_credentials_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── RolesAndPermissionsSeeder.php
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── local.ini
├── public/
│   ├── install.lock (generated after wizard)
│   └── uploads/
│       └── og-images/
├── resources/
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── app.blade.php
│   │   │   └── installer.blade.php
│   │   ├── crawler/
│   │   │   └── og_render.blade.php (Only <head> metadata for Bots)
│   │   ├── installer/
│   │   │   ├── step1_requirements.blade.php
│   │   │   ├── step2_database.blade.php
│   │   │   ├── step3_admin.blade.php
│   │   │   └── step4_complete.blade.php
│   │   ├── links/
│   │   │   ├── create.blade.php
│   │   │   ├── edit_og.blade.php
│   │   │   └── index.blade.php
│   │   └── dashboard/
│   │       └── index.blade.php
├── routes/
│   ├── api.php
│   ├── auth.php
│   └── web.php
├── Dockerfile
├── docker-compose.yml
└── phpunit.xml`,

  database_schema: [
    {
      table: "users",
      columns: [
        { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", notes: "Primary key" },
        { name: "name", type: "VARCHAR(255)", key: "", notes: "Full name" },
        { name: "email", type: "VARCHAR(255)", key: "UNIQUE", notes: "User email" },
        { name: "password", type: "VARCHAR(255)", key: "", notes: "Argon2id hash" },
        { name: "role", type: "ENUM('admin','user','guest')", key: "INDEX", notes: "Default: user" },
        { name: "daily_limit", type: "INT UNSIGNED", key: "", notes: "Max short links created per day (default: 50)" },
        { name: "is_active", type: "BOOLEAN", key: "", notes: "Default: true (Active/Blocked status)" },
        { name: "two_factor_secret", type: "TEXT NULLABLE", key: "", notes: "2FA TOTP secret" },
        { name: "email_verified_at", type: "TIMESTAMP NULLABLE", key: "", notes: "Email verification date" },
        { name: "created_at", type: "TIMESTAMP", key: "", notes: "Creation date" }
      ]
    },
    {
      table: "short_links",
      columns: [
        { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", notes: "Primary key" },
        { name: "user_id", type: "BIGINT UNSIGNED", key: "FK -> users.id", notes: "Cascade delete" },
        { name: "slug", type: "VARCHAR(64)", key: "UNIQUE INDEX", notes: "Random string or custom alias" },
        { name: "destination_url", type: "TEXT", key: "", notes: "Target destination URL" },
        { name: "clicks_count", type: "BIGINT UNSIGNED", key: "INDEX", notes: "Total real user redirects count" },
        { name: "bot_views_count", type: "BIGINT UNSIGNED", key: "INDEX", notes: "Total crawler/bot preview renders" },
        { name: "is_active", type: "BOOLEAN", key: "INDEX", notes: "Enable/Disable link" },
        { name: "expires_at", type: "TIMESTAMP NULLABLE", key: "INDEX", notes: "Optional link expiration date" },
        { name: "created_at", type: "TIMESTAMP", key: "INDEX", notes: "Creation date" }
      ]
    },
    {
      table: "link_metadatas",
      columns: [
        { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", notes: "Primary key" },
        { name: "short_link_id", type: "BIGINT UNSIGNED", key: "FK -> short_links.id", notes: "UNIQUE, Cascade delete" },
        { name: "og_title", type: "VARCHAR(255)", key: "", notes: "Open Graph title tag" },
        { name: "og_description", type: "TEXT", key: "", notes: "Open Graph description tag" },
        { name: "og_image", type: "VARCHAR(512)", key: "", notes: "URL to OG thumbnail image" },
        { name: "og_url", type: "VARCHAR(512) NULLABLE", key: "", notes: "Custom canonical OG URL" },
        { name: "og_site_name", type: "VARCHAR(255) NULLABLE", key: "", notes: "Website brand name (VNaStar Media)" },
        { name: "twitter_card", type: "ENUM('summary','summary_large_image','player')", key: "", notes: "Default: summary_large_image" },
        { name: "twitter_title", type: "VARCHAR(255) NULLABLE", key: "", notes: "Twitter card title override" },
        { name: "twitter_description", type: "TEXT NULLABLE", key: "", notes: "Twitter card description override" },
        { name: "twitter_image", type: "VARCHAR(512) NULLABLE", key: "", notes: "Twitter card image override" },
        { name: "canonical_url", type: "VARCHAR(512) NULLABLE", key: "", notes: "HTML Canonical link rel" },
        { name: "keywords", type: "TEXT NULLABLE", key: "", notes: "SEO meta keywords" },
        { name: "author", type: "VARCHAR(255) NULLABLE", key: "", notes: "Content author" },
        { name: "meta_robots", type: "VARCHAR(128)", key: "", notes: "Default: index, follow" }
      ]
    },
    {
      table: "click_logs",
      columns: [
        { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", notes: "Primary key" },
        { name: "short_link_id", type: "BIGINT UNSIGNED", key: "FK -> short_links.id", notes: "Cascade delete" },
        { name: "ip_address", type: "VARCHAR(45)", key: "INDEX", notes: "IPv4 or IPv6 address" },
        { name: "country", type: "VARCHAR(100) NULLABLE", key: "INDEX", notes: "GeoIP Country" },
        { name: "city", type: "VARCHAR(100) NULLABLE", key: "", notes: "GeoIP City" },
        { name: "user_agent", type: "TEXT", key: "", notes: "Raw HTTP User-Agent string" },
        { name: "is_bot", type: "BOOLEAN", key: "INDEX", notes: "1 if crawler/bot, 0 if human user" },
        { name: "bot_name", type: "VARCHAR(100) NULLABLE", key: "INDEX", notes: "e.g. FacebookExternalHit, TelegramBot, Discordbot" },
        { name: "device_type", type: "ENUM('Desktop','Mobile','Tablet','Bot')", key: "INDEX", notes: "Device category" },
        { name: "os", type: "VARCHAR(50)", key: "", notes: "Operating System" },
        { name: "browser", type: "VARCHAR(50)", key: "", notes: "Browser name" },
        { name: "referer", type: "VARCHAR(512) NULLABLE", key: "", notes: "HTTP Referer URL" },
        { name: "created_at", type: "TIMESTAMP", key: "INDEX", notes: "Visit timestamp" }
      ]
    },
    {
      table: "user_daily_limits",
      columns: [
        { name: "id", type: "BIGINT UNSIGNED AUTO_INCREMENT", key: "PK", notes: "Primary key" },
        { name: "user_id", type: "BIGINT UNSIGNED", key: "FK -> users.id", notes: "Cascade delete" },
        { name: "date", type: "DATE", key: "INDEX", notes: "YYYY-MM-DD" },
        { name: "created_count", type: "INT UNSIGNED", key: "", notes: "Links created on this date" },
        { name: "UNIQUE(user_id, date)", type: "CONSTRAINT", key: "UNIQUE", notes: "Reset limit at 00:00" }
      ]
    }
  ],

  composer_packages: [
    { name: "laravel/framework", version: "^12.0", purpose: "Core Web Framework PHP 8.3+" },
    { name: "laravel/horizon", version: "^5.30", purpose: "Redis Queue Monitoring & Processing" },
    { name: "laravel/sanctum", version: "^4.0", purpose: "API Token Authentication" },
    { name: "laravel/socialite", version: "^5.16", purpose: "OAuth Social Login (Google, GitHub)" },
    { name: "jaybizzle/crawler-detect", version: "^1.2", purpose: "User-Agent Crawler & Bot Detection Engine" },
    { name: "simplesoftwareio/simple-qrcode", version: "^4.2", purpose: "QR Code Generator (PNG, SVG, EPS)" },
    { name: "intervention/image", version: "^3.11", purpose: "OG Image Processing, Thumbnail Resizing & WebP Conversion" },
    { name: "web-token/webauthn-framework", version: "^4.9", purpose: "Passkey & WebAuthn 2FA Security" },
    { name: "torann/geoip", version: "^3.0", purpose: "GeoIP IP-to-Country/City Resolution for Analytics" },
    { name: "predis/predis", version: "^2.3", purpose: "Redis Client for Caching & Queue" },
    { name: "darkaonline/l5-swagger", version: "^8.6", purpose: "Swagger OpenAPI Documentation for APIs" }
  ],

  npm_packages: [
    { name: "@tailwindcss/vite", version: "^4.0", purpose: "Tailwind CSS v4 Engine" },
    { name: "alpinejs", version: "^3.14", purpose: "Lightweight SSR Interactivity for Blade Views" },
    { name: "chart.js", version: "^4.4", purpose: "Analytics Dashboard Charts" }
  ],

  routes_web: [
    { method: "GET", path: "/install", controller: "InstallWizardController@index", name: "install.index", middleware: "guest", desc: "Installer Wizard Step 1" },
    { method: "POST", path: "/install/database", controller: "InstallWizardController@testDatabase", name: "install.db", middleware: "guest", desc: "Test & Run Migrations" },
    { method: "POST", path: "/install/admin", controller: "InstallWizardController@createAdmin", name: "install.admin", middleware: "guest", desc: "Seed & Create Admin" },
    { method: "GET", path: "/", controller: "HomeController@index", name: "home", middleware: "installed", desc: "Landing & Public Shortener" },
    { method: "GET", path: "/dashboard", controller: "DashboardController@index", name: "dashboard", middleware: "auth, installed", desc: "User Dashboard & Analytics" },
    { method: "GET", path: "/links", controller: "LinkController@index", name: "links.index", middleware: "auth, installed", desc: "List User Short Links" },
    { method: "POST", path: "/links", controller: "LinkController@store", name: "links.store", middleware: "auth, installed, check.limit", desc: "Create Short Link + OG Metadata" },
    { method: "GET", path: "/links/{id}/edit-og", controller: "MetadataController@edit", name: "links.edit_og", middleware: "auth, installed, policy:update", desc: "Metadata Editor Page" },
    { method: "PUT", path: "/links/{id}/edit-og", controller: "MetadataController@update", name: "links.update_og", middleware: "auth, installed, policy:update", desc: "Update Open Graph & Twitter Cards" },
    { method: "GET", path: "/links/{id}/qr", controller: "LinkController@downloadQR", name: "links.qr", middleware: "auth, installed", desc: "Download PNG QR Code" },
    { method: "GET", path: "/admin/users", controller: "Admin\\UserController@index", name: "admin.users", middleware: "auth, admin, installed", desc: "Admin User Management & Ban" },
    { method: "GET", path: "/admin/logs", controller: "Admin\\LogController@index", name: "admin.logs", middleware: "auth, admin, installed", desc: "System & Click Audit Logs" },
    { method: "GET", path: "/{slug}", controller: "RedirectController@handle", name: "link.redirect", middleware: "crawler.detect, installed", desc: "Core Short Link Handler (OG Render for Bots vs 302 Redirect for Real Users)" }
  ],

  routes_api: [
    { method: "POST", path: "/api/v1/links", controller: "Api\\LinkController@store", desc: "API Create Short Link with Sanctum Token" },
    { method: "GET", path: "/api/v1/links/{slug}", controller: "Api\\LinkController@show", desc: "API Get Link Details & OG Metadata" },
    { method: "GET", path: "/api/v1/analytics/{slug}", controller: "Api\\AnalyticsController@stats", desc: "API Get Analytics & Bot vs User Click Counts" }
  ]
};
