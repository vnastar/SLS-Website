<?php

namespace App\Services;

use App\Models\ShortLink;
use App\Models\LinkMetadata;
use App\Models\ClickLog;
use App\Models\User;
use App\Models\UserDailyLimit;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Exception;

class UrlShortenerService
{
    /**
     * Cache TTL in seconds (24 hours)
     */
    const CACHE_TTL = 86400;

    /**
     * Create a new short link with metadata and UTM parameters
     */
    public function createShortLink(array $data, ?User $user = null): ShortLink
    {
        // 1. Check user daily limit if user is logged in and not admin
        if ($user && !$user->isAdmin()) {
            if ($user->hasReachedDailyLimit()) {
                throw new InvalidArgumentException("Bạn đã vượt quá giới hạn tạo {$user->daily_limit} link/ngày.");
            }
        }

        // 2. Generate or validate alias
        $alias = isset($data['alias']) && !empty(trim($data['alias']))
            ? trim($data['alias'])
            : $this->generateUniqueAlias();

        if (ShortLink::where('alias', $alias)->exists()) {
            throw new InvalidArgumentException("Alias '{$alias}' đã tồn tại trên hệ thống, vui lòng chọn alias khác.");
        }

        // 3. Prepare destination URL with optional UTM parameters
        $destinationUrl = $this->buildUrlWithUtm($data['destination_url'], $data['utm_params'] ?? []);

        // 4. Create ShortLink record
        $shortLink = ShortLink::create([
            'user_id'         => $user?->id,
            'alias'           => $alias,
            'destination_url' => $destinationUrl,
            'title'           => $data['title'] ?? null,
            'status'          => 'active',
            'expires_at'      => $data['expires_at'] ?? null,
            'password'        => isset($data['password']) && !empty($data['password']) ? bcrypt($data['password']) : null,
            'click_count'     => 0,
            'utm_params'      => $data['utm_params'] ?? null,
        ]);

        // 5. Create associated LinkMetadata for Open Graph Customization
        if (!empty($data['og_title']) || !empty($data['og_image']) || !empty($data['og_description'])) {
            LinkMetadata::create([
                'short_link_id'   => $shortLink->id,
                'og_title'        => $data['og_title'] ?? $data['title'] ?? null,
                'og_description'  => $data['og_description'] ?? null,
                'og_image'        => $data['og_image'] ?? null,
                'facebook_app_id' => $data['facebook_app_id'] ?? null,
                'use_custom_og'   => true,
            ]);
        }

        // 6. Increment user daily count
        if ($user) {
            $today = now()->toDateString();
            $dailyRecord = UserDailyLimit::firstOrCreate(
                ['user_id' => $user->id, 'date' => $today],
                ['links_created' => 0]
            );
            $dailyRecord->increment('links_created');
        }

        // 7. Store in Redis Cache
        $this->cacheShortLink($shortLink);

        return $shortLink;
    }

    /**
     * Get short link details by alias with Redis caching
     */
    public function getShortLinkByAlias(string $alias): ?ShortLink
    {
        $cacheKey = "short_link:alias:{$alias}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($alias) {
            return ShortLink::with('metadata')->where('alias', $alias)->first();
        });
    }

    /**
     * Record click event analytics asynchronously or directly
     */
    public function recordClick(ShortLink $shortLink, array $clientData): void
    {
        // Increment database click count
        $shortLink->increment('click_count');

        // Forget cache so updated click count syncs on next fetch if needed
        Cache::forget("short_link:alias:{$shortLink->alias}");

        // Create ClickLog
        ClickLog::create([
            'short_link_id' => $shortLink->id,
            'ip_address'    => $clientData['ip'] ?? null,
            'country_code'  => $clientData['country'] ?? 'VN',
            'city'          => $clientData['city'] ?? 'Hanoi',
            'device'        => $clientData['device'] ?? 'desktop',
            'os'            => $clientData['os'] ?? 'Unknown',
            'browser'       => $clientData['browser'] ?? 'Chrome',
            'referer'       => $clientData['referer'] ?? null,
            'is_crawler'    => $clientData['is_crawler'] ?? false,
            'created_at'    => now(),
        ]);
    }

    /**
     * Generate unique 6-character Base62 string
     */
    public function generateUniqueAlias(int $length = 6): string
    {
        $maxAttempts = 10;
        $attempt = 0;

        do {
            $alias = Str::random($length);
            $exists = ShortLink::where('alias', $alias)->exists();
            $attempt++;
        } while ($exists && $attempt < $maxAttempts);

        if ($exists) {
            $alias = Str::random($length + 2);
        }

        return $alias;
    }

    /**
     * Append UTM parameters to destination URL
     */
    public function buildUrlWithUtm(string $url, array $utmParams): string
    {
        $cleanParams = array_filter($utmParams, fn($value) => !empty($value));

        if (empty($cleanParams)) {
            return $url;
        }

        $parsed = parse_url($url);
        $query = [];

        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $query);
        }

        $mergedQuery = array_merge($query, $cleanParams);
        $queryString = http_build_query($mergedQuery);

        $scheme   = isset($parsed['scheme']) ? $parsed['scheme'] . '://' : 'https://';
        $host     = $parsed['host'] ?? '';
        $port     = isset($parsed['port']) ? ':' . $parsed['port'] : '';
        $path     = $parsed['path'] ?? '';

        return "{$scheme}{$host}{$port}{$path}?{$queryString}";
    }

    /**
     * Cache short link instance in Redis
     */
    public function cacheShortLink(ShortLink $shortLink): void
    {
        $shortLink->loadMissing('metadata');
        Cache::put("short_link:alias:{$shortLink->alias}", $shortLink, self::CACHE_TTL);
    }
}
