import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Local file-backed database persistence
const dbDir = path.join(process.cwd(), 'database');
const linksFilePath = path.join(dbDir, 'links.json');
const logsFilePath = path.join(dbDir, 'logs.json');
const configFilePath = path.join(dbDir, 'config.json');
const usersFilePath = path.join(dbDir, 'users.json');

if (!fs.existsSync(dbDir)) {
  try { fs.mkdirSync(dbDir, { recursive: true }); } catch (e) {}
}

const shortLinks = new Map<string, any>();
let clickLogs: any[] = [];
let usersList: any[] = [];
let systemConfig = {
  installed: false,
  siteName: 'VNaStar Smart Link Shortener',
  siteUrl: 'https://sls.vnastar.com',
  adminName: 'VNaStar Admin',
  adminEmail: 'admin@sls.vnastar.com',
  adminPassword: 'VNaStar@2026!',
  installedAt: null as string | null
};

function loadData() {
  try {
    if (fs.existsSync(configFilePath)) {
      const cfg = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
      systemConfig = { ...systemConfig, ...cfg };
    }
  } catch (e) {
    console.error('Failed to load config from disk:', e);
  }

  try {
    if (fs.existsSync(usersFilePath)) {
      usersList = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load users from disk:', e);
  }

  // Ensure default admin exists in usersList
  const hasAdmin = usersList.some(u => u.username === 'admin' || u.email === systemConfig.adminEmail);
  if (!hasAdmin) {
    usersList.unshift({
      id: 'usr_admin',
      username: 'admin',
      name: systemConfig.adminName || 'VNaStar Admin',
      email: systemConfig.adminEmail || 'admin@sls.vnastar.com',
      password: systemConfig.adminPassword || 'VNaStar@2026!',
      role: 'admin',
      status: 'approved',
      created_at: new Date().toISOString()
    });
  }

  try {
    if (fs.existsSync(linksFilePath)) {
      const data = JSON.parse(fs.readFileSync(linksFilePath, 'utf-8'));
      if (Array.isArray(data)) {
        data.forEach(item => shortLinks.set(item.slug, item));
      }
    }
  } catch (e) {
    console.error('Failed to load links from disk:', e);
  }

  try {
    if (fs.existsSync(logsFilePath)) {
      clickLogs = JSON.parse(fs.readFileSync(logsFilePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load logs from disk:', e);
  }

  // Ensure default demo link exists if empty
  if (shortLinks.size === 0) {
    shortLinks.set('vnastar-promo', {
      id: '1',
      slug: 'vnastar-promo',
      destination_url: 'https://sls.vnastar.com/digital-marketing-campaign-2026',
      created_at: new Date().toISOString(),
      clicks_count: 342,
      bot_views_count: 89,
      is_active: true,
      user_id: 'usr_admin',
      metadata: {
        og_title: '🔥 Chiến Dịch Truyền Thông Đột Phá 2026 | VNaStar Media',
        og_description: 'VNaStar Media mang đến giải pháp Marketing tổng thể, tối ưu hóa Open Graph Metadata giúp tăng 300% CTR trên Facebook, Zalo, Telegram & Discord.',
        og_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        og_url: 'https://sls.vnastar.com',
        og_site_name: 'VNaStar Media',
        twitter_card: 'summary_large_image',
        twitter_title: '🔥 Chiến Dịch Truyền Thông Đột Phá 2026 | VNaStar Media',
        twitter_description: 'Tối ưu Open Graph Metadata & Twitter Cards cho doanh nghiệp.',
        twitter_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        canonical_url: 'https://sls.vnastar.com/digital-marketing',
        keywords: 'VNaStar Media, Link Shortener, Open Graph, Marketing, SEO',
        author: 'VNaStar Media Lead Architect',
        meta_robots: 'index, follow'
      }
    });
    saveData();
  }
}

function saveData() {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(systemConfig, null, 2));
    fs.writeFileSync(linksFilePath, JSON.stringify(Array.from(shortLinks.values()), null, 2));
    fs.writeFileSync(logsFilePath, JSON.stringify(clickLogs, null, 2));
    fs.writeFileSync(usersFilePath, JSON.stringify(usersList, null, 2));
  } catch (e) {
    console.error('Failed to persist data to disk:', e);
  }
}

loadData();

// Helper for Bot detection
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'telegrambot',
  'discordbot',
  'twitterbot',
  'linkedinbot',
  'skypeuripreview',
  'zalobot',
  'whatsapp',
  'slackbot',
  'googlebot',
  'bingbot',
  'crawler'
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

// API Routes
app.get('/api/system/status', (req, res) => {
  res.json({
    installed: systemConfig.installed,
    siteName: systemConfig.siteName,
    siteUrl: systemConfig.siteUrl,
    adminEmail: systemConfig.adminEmail,
    installedAt: systemConfig.installedAt
  });
});

app.post('/api/system/install', (req, res) => {
  const { adminName, adminEmail, adminPassword, siteName, siteUrl } = req.body;
  
  systemConfig.installed = true;
  systemConfig.adminName = adminName || 'VNaStar Admin';
  systemConfig.adminEmail = adminEmail || 'admin@sls.vnastar.com';
  systemConfig.adminPassword = adminPassword || 'VNaStar@2026!';
  if (siteName) systemConfig.siteName = siteName;
  if (siteUrl) systemConfig.siteUrl = siteUrl;
  systemConfig.installedAt = new Date().toISOString();

  saveData();

  res.json({
    success: true,
    message: 'Cài đặt hệ thống hoàn tất thành công!',
    user: {
      name: systemConfig.adminName,
      email: systemConfig.adminEmail
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ Tên đăng nhập (user), Email và Mật khẩu!'
    });
  }

  const normalizedUsername = String(username).toLowerCase().trim();
  const normalizedEmail = String(email).toLowerCase().trim();

  // Validate username format: lowercase letters, digits, dots
  const usernameRegex = /^[a-z0-9.]+$/;
  if (!usernameRegex.test(normalizedUsername)) {
    return res.status(400).json({
      success: false,
      message: 'Tên user chỉ được chứa chữ cái viết thường (a-z), chữ số (0-9) và dấu chấm (.). Ví dụ: xuan.manh'
    });
  }

  if (normalizedUsername.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Tên user phải có độ dài từ 3 ký tự trở lên!'
    });
  }

  // Check unique username
  const existingUser = usersList.find(u => u.username.toLowerCase() === normalizedUsername);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: `Tên user "${normalizedUsername}" đã tồn tại. Vui lòng chọn tên đăng nhập khác!`
    });
  }

  // Check unique email
  const existingEmail = usersList.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingEmail || normalizedEmail === systemConfig.adminEmail.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: `Địa chỉ email "${normalizedEmail}" đã được đăng ký trên hệ thống!`
    });
  }

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username: normalizedUsername,
    name: name || normalizedUsername,
    email: normalizedEmail,
    password: password,
    role: 'user',
    status: 'pending', // Requires admin confirmation!
    created_at: new Date().toISOString()
  };

  usersList.push(newUser);
  saveData();

  res.json({
    success: true,
    message: 'Tạo tài khoản thành công! Tài khoản mới cần được Quản trị viên (Admin) duyệt mới có thể đăng nhập.',
    user: {
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      status: newUser.status
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { login, email, password } = req.body;
  const identifier = String(login || email || '').toLowerCase().trim();

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập Tên user / Email và Mật khẩu!'
    });
  }

  // Find in usersList by username or email
  let foundUser = usersList.find(
    u => u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier
  );

  // Fallback for system admin credentials if not in usersList
  if (!foundUser && (identifier === 'admin' || identifier === systemConfig.adminEmail.toLowerCase())) {
    if (password === systemConfig.adminPassword) {
      return res.json({
        success: true,
        user: {
          id: 'usr_admin',
          username: 'admin',
          name: systemConfig.adminName || 'VNaStar Admin',
          email: systemConfig.adminEmail,
          role: 'admin',
          status: 'approved'
        }
      });
    }
  }

  if (!foundUser) {
    return res.status(401).json({
      success: false,
      message: 'Tên người dùng hoặc mật khẩu không chính xác!'
    });
  }

  if (foundUser.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu không chính xác. Vui lòng thử lại!'
    });
  }

  // Check approval status
  if (foundUser.status === 'pending') {
    return res.status(403).json({
      success: false,
      message: `Tài khoản '${foundUser.username}' chưa được kích hoạt. Vui lòng liên hệ Admin để được duyệt!`
    });
  }

  if (foundUser.status === 'rejected') {
    return res.status(403).json({
      success: false,
      message: `Tài khoản '${foundUser.username}' đã bị từ chối hoặc khoá bởi Admin.`
    });
  }

  res.json({
    success: true,
    user: {
      id: foundUser.id,
      username: foundUser.username,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      status: foundUser.status
    }
  });
});

// Admin User Management Endpoints
app.get('/api/admin/users', (req, res) => {
  res.json({
    success: true,
    users: usersList.map(u => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      created_at: u.created_at
    }))
  });
});

app.post('/api/admin/users/approve', (req, res) => {
  const { userId } = req.body;
  const user = usersList.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
  }

  user.status = 'approved';
  saveData();

  res.json({
    success: true,
    message: `Đã duyệt thành công tài khoản "${user.username}"!`,
    user
  });
});

app.post('/api/admin/users/reject', (req, res) => {
  const { userId } = req.body;
  const user = usersList.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
  }

  user.status = 'rejected';
  saveData();

  res.json({
    success: true,
    message: `Đã từ chối/khóa tài khoản "${user.username}".`,
    user
  });
});

app.post('/api/admin/users/delete', (req, res) => {
  const { userId } = req.body;
  const index = usersList.findIndex(u => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
  }

  const deleted = usersList.splice(index, 1)[0];
  saveData();

  res.json({
    success: true,
    message: `Đã xóa người dùng "${deleted.username}".`
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Smart Link Shortener',
    owner: 'VNaStar Media',
    php_version: '8.3.1',
    laravel_version: '12.1.0',
    redis: 'Connected'
  });
});

app.get('/api/links', (req, res) => {
  res.json(Array.from(shortLinks.values()));
});

app.post('/api/links', (req, res) => {
  const { slug, destination_url, metadata } = req.body;
  const finalSlug = slug || Math.random().toString(36).substring(2, 8);
  
  if (shortLinks.has(finalSlug)) {
    return res.status(400).json({ error: 'Slug đã tồn tại. Vui lòng chọn slug khác!' });
  }

  const newLink = {
    id: Date.now().toString(),
    slug: finalSlug,
    destination_url,
    created_at: new Date().toISOString(),
    clicks_count: 0,
    bot_views_count: 0,
    is_active: true,
    user_id: 'usr_admin',
    metadata: metadata || {
      og_title: 'Smart Link by VNaStar Media',
      og_description: 'Shortened link with custom Open Graph tags',
      og_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      twitter_card: 'summary_large_image',
      twitter_title: 'Smart Link by VNaStar Media',
      twitter_description: 'Shortened link with custom Open Graph tags',
      twitter_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      canonical_url: destination_url,
      keywords: 'VNaStar Media, Link Shortener',
      author: 'VNaStar Media',
      meta_robots: 'index, follow'
    }
  };

  shortLinks.set(finalSlug, newLink);
  saveData();
  res.json(newLink);
});

// Update link metadata
app.put('/api/links/:slug', (req, res) => {
  const { slug } = req.params;
  const link = shortLinks.get(slug);
  if (!link) {
    return res.status(404).json({ error: 'Link không tồn tại' });
  }

  link.metadata = { ...link.metadata, ...req.body.metadata };
  if (req.body.destination_url) {
    link.destination_url = req.body.destination_url;
  }
  shortLinks.set(slug, link);
  saveData();
  res.json(link);
});

// Delete short link
app.delete('/api/links/:slug', (req, res) => {
  const { slug } = req.params;
  if (!shortLinks.has(slug)) {
    return res.status(404).json({ error: 'Link không tồn tại' });
  }
  shortLinks.delete(slug);
  saveData();
  res.json({ success: true, message: `Đã xóa thành công link /r/${slug}` });
});

// Toggle short link active status
app.patch('/api/links/:slug/toggle', (req, res) => {
  const { slug } = req.params;
  const link = shortLinks.get(slug);
  if (!link) {
    return res.status(404).json({ error: 'Link không tồn tại' });
  }
  link.is_active = !link.is_active;
  shortLinks.set(slug, link);
  saveData();
  res.json({ success: true, link });
});

// Auto-scrape Open Graph metadata from destination URL
app.post('/api/scrape-metadata', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ success: false, error: 'URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    clearTimeout(timeout);

    const html = await response.text();

    const getMeta = (propertyOrName: string) => {
      const regex1 = new RegExp(`<meta\\s+[^>]*?(?:property|name)=["']${propertyOrName}["']\\s+[^>]*?content=["']([^"']*)["']`, 'i');
      const regex2 = new RegExp(`<meta\\s+[^>]*?content=["']([^"']*)["']\\s+[^>]*?(?:property|name)=["']${propertyOrName}["']`, 'i');
      const m1 = html.match(regex1);
      if (m1) return m1[1];
      const m2 = html.match(regex2);
      if (m2) return m2[1];
      return '';
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const rawTitle = titleMatch ? titleMatch[1].trim() : '';

    const ogTitle = getMeta('og:title') || rawTitle || 'Trang Web';
    const ogDescription = getMeta('og:description') || getMeta('description') || '';
    const ogImage = getMeta('og:image') || getMeta('twitter:image') || '';
    const ogSiteName = getMeta('og:site_name') || '';
    const keywords = getMeta('keywords') || '';
    const author = getMeta('author') || '';

    return res.json({
      success: true,
      metadata: {
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        og_site_name: ogSiteName,
        keywords,
        author,
        canonical_url: url
      }
    });
  } catch (err: any) {
    console.error('Error scraping metadata:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể tự động tải thẻ Meta từ website này. Bạn có thể điền thông tin thủ công.'
    });
  }
});

// Gemini AI Metadata Generator & Enhancer
app.post('/api/ai/enhance-metadata', async (req, res) => {
  try {
    const { destination_url, title, description } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống'
      });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bạn là chuyên gia SEO & Social Media Marketing hàng đầu của VNaStar Media.
Hãy tối ưu Open Graph Metadata thu hút lượt click (high CTR) nhất cho đường link sau:
- URL gốc: ${destination_url || 'N/A'}
- Tiêu đề hiện tại: ${title || 'Chưa có'}
- Mô tả hiện tại: ${description || 'Chưa có'}

Yêu cầu trả về JSON chuẩn duy nhất (không bọc trong markdown code block khác):
{
  "og_title": "Tiêu đề hấp dẫn, gây tò mò giật gân (dưới 65 ký tự, có emoji)",
  "og_description": "Mô tả truyền thông thôi thúc click xem ngay (120-160 ký tự)",
  "keywords": "từ khóa 1, từ khóa 2, từ khóa 3, VNaStar Media",
  "twitter_title": "Tiêu đề Twitter hấp dẫn",
  "twitter_description": "Mô tả ngắn gọn Twitter"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    const jsonResult = JSON.parse(responseText);

    return res.json({
      success: true,
      metadata: jsonResult
    });
  } catch (err: any) {
    console.error('AI generation error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể tạo nội dung bằng AI. Vui lòng kiểm tra lại GEMINI_API_KEY hoặc thử lại.'
    });
  }
});

// Simulated crawler/redirect endpoint
app.get('/r/:slug', (req, res) => {
  const { slug } = req.params;
  const link = shortLinks.get(slug);
  const userAgent = (req.headers['user-agent'] || req.query.ua || '').toString();

  if (!link) {
    return res.status(404).send('Link not found');
  }

  const botDetected = isBot(userAgent);

  // Log metric
  clickLogs.unshift({
    id: Date.now().toString(),
    short_link_id: link.id,
    slug: link.slug,
    ip_address: req.ip || '127.0.0.1',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    user_agent: userAgent,
    is_bot: botDetected,
    bot_name: botDetected ? userAgent.split('/')[0] : undefined,
    device_type: botDetected ? 'Bot' : (userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'),
    os: userAgent.includes('Windows') ? 'Windows 11' : (userAgent.includes('Mac') ? 'macOS' : 'Linux'),
    browser: userAgent.includes('Chrome') ? 'Chrome' : 'Safari',
    referer: req.headers.referer || 'Direct',
    created_at: new Date().toISOString()
  });

  if (botDetected) {
    link.bot_views_count += 1;
    shortLinks.set(slug, link);
    saveData();

    // Return HTML head ONLY for Bots/Crawlers
    const htmlHead = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(link.metadata.og_title)}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(link.metadata.og_title)}">
  <meta name="description" content="${escapeHtml(link.metadata.og_description)}">
  <meta name="keywords" content="${escapeHtml(link.metadata.keywords || '')}">
  <meta name="author" content="${escapeHtml(link.metadata.author || 'VNaStar Media')}">
  <meta name="robots" content="${escapeHtml(link.metadata.meta_robots || 'index, follow')}">
  <link rel="canonical" href="${escapeHtml(link.metadata.canonical_url || link.destination_url)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(link.metadata.og_url || req.protocol + '://' + req.get('host') + '/r/' + slug)}">
  <meta property="og:title" content="${escapeHtml(link.metadata.og_title)}">
  <meta property="og:description" content="${escapeHtml(link.metadata.og_description)}">
  <meta property="og:image" content="${escapeHtml(link.metadata.og_image)}">
  <meta property="og:site_name" content="${escapeHtml(link.metadata.og_site_name || 'VNaStar Media')}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="${escapeHtml(link.metadata.twitter_card || 'summary_large_image')}">
  <meta name="twitter:title" content="${escapeHtml(link.metadata.twitter_title || link.metadata.og_title)}">
  <meta name="twitter:description" content="${escapeHtml(link.metadata.twitter_description || link.metadata.og_description)}">
  <meta name="twitter:image" content="${escapeHtml(link.metadata.twitter_image || link.metadata.og_image)}">
</head>
<body>
  <!-- Rendered specifically for Crawler Bot (${userAgent}) -->
  <p>VNaStar Media Smart Link Shortener Open Graph Service</p>
</body>
</html>`;
    return res.status(200).send(htmlHead);
  } else {
    link.clicks_count += 1;
    shortLinks.set(slug, link);
    saveData();
    return res.redirect(302, link.destination_url);
  }
});

app.get('/api/logs', (req, res) => {
  res.json(clickLogs.slice(0, 50));
});

function escapeHtml(str: string) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Vite setup for dev/production
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(indexPath);

  if (!isProduction) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite module not found, falling back to static server');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
      }
      app.get('*', (req, res) => {
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(200).send('VNaStar Media Link Shortener - System Initializing...');
        }
      });
    }
  } else {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('VNaStar Media Link Shortener - System Initializing...');
      }
    });
  }

  const listenPort = process.env.PORT || process.env.PASSENGER_NODE_SOCKET || 3000;

  if (typeof listenPort === 'string' && (listenPort.startsWith('/') || listenPort.startsWith('\\\\') || listenPort.includes('.sock'))) {
    app.listen(listenPort, () => {
      console.log(`Server Smart Link Shortener (VNaStar Media) running on Unix socket: ${listenPort}`);
    });
  } else {
    const port = parseInt(String(listenPort), 10) || 3000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server Smart Link Shortener (VNaStar Media) running on http://0.0.0.0:${port}`);
    });
  }
}

startServer();
