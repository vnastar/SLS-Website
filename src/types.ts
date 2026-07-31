export interface ShortLink {
  id: string;
  slug: string;
  destination_url: string;
  created_at: string;
  clicks_count: number;
  bot_views_count: number;
  is_active: boolean;
  expires_at?: string;
  daily_limit_reached?: boolean;
  user_id: string;
  metadata: OGMetadata;
}

export interface OGMetadata {
  og_title: string;
  og_description: string;
  og_image: string;
  og_url?: string;
  og_site_name?: string;
  og_type?: string;
  twitter_card: 'summary' | 'summary_large_image' | 'player' | 'app';
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  canonical_url: string;
  keywords: string;
  author: string;
  meta_robots: string;
}

export interface ClickLog {
  id: string;
  short_link_id: string;
  slug: string;
  ip_address: string;
  country: string;
  city: string;
  user_agent: string;
  is_bot: boolean;
  bot_name?: string;
  device_type: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot';
  os: string;
  browser: string;
  referer: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  daily_limit: number;
  created_links_today: number;
  avatar?: string;
}

export interface SystemStats {
  total_links: number;
  total_clicks: number;
  total_bot_crawls: number;
  active_users: number;
  redis_status: 'connected' | 'disconnected';
  database_status: 'connected' | 'disconnected';
}
