// server.js - Hostinger & cPanel Production Entry Point Wrapper for VNaStar Media
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distServer = path.join(__dirname, 'dist', 'server.cjs');
const distIndex = path.join(__dirname, 'dist', 'index.html');

async function launch() {
  if (fs.existsSync(distServer) && fs.existsSync(distIndex)) {
    // Dist bundle exists! Load production server bundle directly.
    try {
      await import('./dist/server.cjs');
      return;
    } catch (err) {
      console.error('[Hostinger Deploy] Failed to load dist/server.cjs:', err);
    }
  }

  // Fallback mode: Start lightweight Express server immediately so Hostinger proxy gets 200 OK (No 503)
  console.log('[Hostinger Deploy] Dist bundle not found. Starting Installer & Auto-Build Fallback Server...');
  const app = express();
  let isBuilding = false;
  let buildError = null;

  function runBackgroundBuild() {
    if (isBuilding) return;
    isBuilding = true;
    buildError = null;

    console.log('[Hostinger Deploy] Executing background "npm run build"...');
    const child = spawn('npm', ['run', 'build'], { cwd: __dirname, shell: true });

    child.stdout.on('data', (data) => console.log(`[Build] ${data.toString()}`));
    child.stderr.on('data', (data) => console.error(`[Build Error] ${data.toString()}`));

    child.on('close', (code) => {
      isBuilding = false;
      if (code === 0) {
        console.log('[Hostinger Deploy] Build completed successfully! Restarting process or loading bundle...');
        if (fs.existsSync(distServer)) {
          import('./dist/server.cjs').catch(e => console.error('Error importing built bundle:', e));
        }
      } else {
        buildError = `Lệnh "npm run build" thoát với mã lỗi ${code}. Vui lòng kiểm tra log trên Hostinger.`;
        console.error('[Hostinger Deploy]', buildError);
      }
    });
  }

  // Trigger build immediately
  runBackgroundBuild();

  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'initializing',
      building: isBuilding,
      error: buildError
    });
  });

  app.use((req, res) => {
    if (fs.existsSync(distIndex) && fs.existsSync(distServer)) {
      return res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>VNaStar Media - Cài Đặt Hoàn Tất</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
  <h2>🎉 Quá trình Build hoàn tất!</h2>
  <p>Vui lòng nhấp vào nút bên dưới để khởi chạy ứng dụng.</p>
  <button onclick="location.reload()" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #2563eb; color: white; border: none; border-radius: 6px;">Tải Lại Trang</button>
</body>
</html>`);
    }

    res.status(200).send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VNaStar Media - Hệ Thống Đang Khởi Tạo</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 40px; border-radius: 16px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .spinner { border: 4px solid #334155; border-top: 4px solid #3b82f6; border-radius: 50%; width: 48px; height: 48px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    h1 { font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #38bdf8; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn:hover { background: #1d4ed8; }
    .err { color: #f87171; background: #451a1a; border: 1px solid #7f1d1d; padding: 12px; border-radius: 8px; font-size: 13px; margin-top: 16px; text-align: left; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>VNaStar Media - Đang Khởi Tạo Website</h1>
    <p>Hệ thống đang tự động biên dịch và hoàn tất cài đặt lần đầu trên Hostinger. Quá trình này mất khoảng 20-30 giây.</p>
    ${buildError ? `<div class="err"><strong>Lỗi:</strong> ${buildError}</div>` : ''}
    <div style="margin-top: 20px;">
      <button class="btn" onclick="location.reload()">Kiểm Tra & Tải Lại Trang</button>
    </div>
  </div>
  <script>
    setTimeout(function() {
      fetch('/api/health').then(r => r.json()).then(d => {
        if (!d.building) { location.reload(); }
      }).catch(function(){});
    }, 5000);
  </script>
</body>
</html>`);
  });

  const listenPort = process.env.PORT || process.env.PASSENGER_NODE_SOCKET || 3000;

  if (typeof listenPort === 'string' && (listenPort.startsWith('/') || listenPort.startsWith('\\\\') || listenPort.includes('.sock'))) {
    app.listen(listenPort, () => {
      console.log(`[Hostinger Deploy] Fallback server listening on socket: ${listenPort}`);
    });
  } else {
    const port = parseInt(String(listenPort), 10) || 3000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`[Hostinger Deploy] Fallback server listening on http://0.0.0.0:${port}`);
    });
  }
}

launch();
