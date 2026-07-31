<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DetectSocialCrawler
{
    /**
     * List of User-Agent regex patterns for social media and search engine crawlers.
     */
    protected array $crawlerUserAgents = [
        'facebookexternalhit',
        'Facebot',
        'ZaloBot',
        'Zalo',
        'TelegramBot',
        'Twitterbot',
        'LinkedInBot',
        'WhatsApp',
        'SkypeUriPreview',
        'Pinterest',
        'Discordbot',
        'Slackbot',
        'Googlebot',
        'bingbot',
        'Applebot',
        'Baiduspider',
        'yandex',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userAgent = $request->header('User-Agent', '');
        $isCrawler = $this->isCrawlerUserAgent($userAgent);

        // Store detection flag in request attributes for downstream controllers
        $request->attributes->set('is_crawler', $isCrawler);
        $request->attributes->set('detected_user_agent', $userAgent);

        return $next($request);
    }

    /**
     * Check if given User-Agent matches any known crawler pattern
     */
    public function isCrawlerUserAgent(string $userAgent): bool
    {
        if (empty($userAgent)) {
            return false;
        }

        foreach ($this->crawlerUserAgents as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                return true;
            }
        }

        return false;
    }
}
