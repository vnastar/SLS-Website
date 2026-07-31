<?php

namespace App\Http\Controllers;

use App\Services\UrlShortenerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RedirectController extends Controller
{
    protected UrlShortenerService $shortenerService;

    public function __construct(UrlShortenerService $shortenerService)
    {
        $this->shortenerService = $shortenerService;
    }

    /**
     * Handle redirection or social crawler Open Graph metadata response
     */
    public function handleRedirect(Request $request, string $alias)
    {
        // 1. Fetch short link from Service (cached via Redis)
        $shortLink = $this->shortenerService->getShortLinkByAlias($alias);

        if (!$shortLink) {
            return response()->view('errors.404_link', [], 404);
        }

        // 2. Check if link is paused, blocked or expired
        if ($shortLink->status !== 'active') {
            return response()->view('errors.link_inactive', ['status' => $shortLink->status], 403);
        }

        if ($shortLink->isExpired()) {
            return response()->view('errors.link_expired', [], 410);
        }

        // 3. Check crawler detection flag set by DetectSocialCrawler middleware
        $isCrawler = $request->attributes->get('is_crawler', false);

        // 4. IF CRAWLER (Facebook, Zalo, Telegram, Googlebot, etc.):
        // Return HTML containing rich Open Graph meta tags WITHOUT redirecting,
        // ensuring social scrapers index custom title, description & thumbnail image!
        if ($isCrawler) {
            $metadata = $shortLink->metadata;

            $ogTitle = $metadata?->og_title ?: ($shortLink->title ?: config('app.name'));
            $ogDescription = $metadata?->og_description ?: 'Bấm vào để xem chi tiết liên kết rút gọn từ VNaStar Media.';
            $ogImage = $metadata?->og_image ?: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80';
            $fbAppId = $metadata?->facebook_app_id ?: '1029384756';

            return response()->view('og_preview', [
                'ogTitle'        => $ogTitle,
                'ogDescription'  => $ogDescription,
                'ogImage'        => $ogImage,
                'fbAppId'        => $fbAppId,
                'destinationUrl' => $shortLink->destination_url,
                'shortUrl'       => $shortLink->short_url,
            ]);
        }

        // 5. IF PASSWORD PROTECTED & NOT CRAWLER:
        if ($shortLink->isPasswordProtected()) {
            $sessionKey = "link_unlocked_{$shortLink->id}";
            if (!$request->session()->has($sessionKey)) {
                if ($request->isMethod('post')) {
                    if (Hash::check($request->input('password'), $shortLink->password)) {
                        $request->session()->put($sessionKey, true);
                    } else {
                        return response()->view('link_password', [
                            'shortLink' => $shortLink,
                            'error'     => 'Mật khẩu truy cập không chính xác. Vui lòng thử lại.',
                        ]);
                    }
                } else {
                    return response()->view('link_password', ['shortLink' => $shortLink]);
                }
            }
        }

        // 6. RECORD CLICK LOG ANALYTICS (Human User)
        $this->shortenerService->recordClick($shortLink, [
            'ip'         => $request->ip(),
            'country'    => $request->header('CF-IPCountry', 'VN'),
            'city'       => 'Hanoi',
            'device'     => $this->detectDevice($request->userAgent()),
            'os'         => $this->detectOS($request->userAgent()),
            'browser'    => $this->detectBrowser($request->userAgent()),
            'referer'    => $request->header('referer'),
            'is_crawler' => false,
        ]);

        // 7. PERFORM 302 REDIRECT TO DESTINATION URL
        return redirect()->away($shortLink->destination_url, 302);
    }

    /**
     * Helper to detect simple device type from User Agent
     */
    protected function detectDevice(?string $ua): string
    {
        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $ua)) {
            return 'tablet';
        }
        if (preg_match('/(android|bb\d+|meego).+mobile|iphone|ipod|mobile/i', $ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Helper to detect Operating System
     */
    protected function detectOS(?string $ua): string
    {
        if (preg_match('/iphone|ipad|ipod/i', $ua)) return 'iOS';
        if (preg_match('/android/i', $ua)) return 'Android';
        if (preg_match('/macintosh|mac os x/i', $ua)) return 'macOS';
        if (preg_match('/windows|win32/i', $ua)) return 'Windows';
        if (preg_match('/linux/i', $ua)) return 'Linux';
        return 'Unknown';
    }

    /**
     * Helper to detect Browser
     */
    protected function detectBrowser(?string $ua): string
    {
        if (preg_match('/zalo/i', $ua)) return 'Zalo Browser';
        if (preg_match('/fbav|fban/i', $ua)) return 'Facebook InApp';
        if (preg_match('/chrome/i', $ua)) return 'Chrome';
        if (preg_match('/safari/i', $ua)) return 'Safari';
        if (preg_match('/firefox/i', $ua)) return 'Firefox';
        if (preg_match('/edg/i', $ua)) return 'Edge';
        return 'Other';
    }
}
