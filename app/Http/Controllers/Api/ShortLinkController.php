<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UrlShortenerService;
use App\Models\ShortLink;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class ShortLinkController extends Controller
{
    protected UrlShortenerService $shortenerService;

    public function __construct(UrlShortenerService $shortenerService)
    {
        $this->shortenerService = $shortenerService;
    }

    /**
     * Store a newly created ShortLink
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination_url' => 'required|url|max:2048',
            'alias'           => 'nullable|string|alpha_dash|max:32',
            'title'           => 'nullable|string|max:255',
            'expires_at'      => 'nullable|date|after:now',
            'password'        => 'nullable|string|min:4|max:32',
            'og_title'        => 'nullable|string|max:255',
            'og_description'  => 'nullable|string|max:1000',
            'og_image'        => 'nullable|url|max:2048',
            'facebook_app_id' => 'nullable|string|max:64',
            'utm_params'      => 'nullable|array',
            'utm_params.utm_source'   => 'nullable|string|max:64',
            'utm_params.utm_medium'   => 'nullable|string|max:64',
            'utm_params.utm_campaign' => 'nullable|string|max:64',
        ]);

        try {
            $user = $request->user();
            $shortLink = $this->shortenerService->createShortLink($validated, $user);

            return response()->json([
                'success' => true,
                'message' => 'Tạo link rút gọn thành công!',
                'data'    => $shortLink->load('metadata'),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * List user short links with pagination
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = ShortLink::with('metadata')
            ->orderBy('created_at', 'desc');

        if ($user && !$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        $links = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $links,
        ]);
    }

    /**
     * Show single link details with analytics summary
     */
    public function show(string $alias)
    {
        $shortLink = ShortLink::with(['metadata', 'clickLogs' => function($q) {
            $q->latest('created_at')->limit(50);
        }])->where('alias', $alias)->first();

        if (!$shortLink) {
            return response()->json(['success' => false, 'message' => 'Link không tồn tại'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $shortLink,
        ]);
    }

    /**
     * Update existing short link status or metadata
     */
    public function update(Request $request, int $id)
    {
        $shortLink = ShortLink::findOrFail($id);

        $validated = $request->validate([
            'title'          => 'nullable|string|max:255',
            'status'         => 'nullable|in:active,paused,blocked',
            'destination_url'=> 'nullable|url|max:2048',
            'og_title'       => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:1000',
            'og_image'       => 'nullable|url|max:2048',
        ]);

        if (isset($validated['destination_url'])) {
            $shortLink->destination_url = $validated['destination_url'];
        }
        if (isset($validated['title'])) {
            $shortLink->title = $validated['title'];
        }
        if (isset($validated['status'])) {
            $shortLink->status = $validated['status'];
        }

        $shortLink->save();

        if ($shortLink->metadata) {
            $shortLink->metadata->update([
                'og_title'       => $validated['og_title'] ?? $shortLink->metadata->og_title,
                'og_description' => $validated['og_description'] ?? $shortLink->metadata->og_description,
                'og_image'       => $validated['og_image'] ?? $shortLink->metadata->og_image,
            ]);
        }

        // Re-cache updated link
        $this->shortenerService->cacheShortLink($shortLink);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật link rút gọn thành công!',
            'data'    => $shortLink->load('metadata'),
        ]);
    }

    /**
     * Delete short link
     */
    public function destroy(int $id)
    {
        $shortLink = ShortLink::findOrFail($id);
        $alias = $shortLink->alias;

        $shortLink->delete();

        // Evict from Redis Cache
        \Illuminate\Support\Facades\Cache::forget("short_link:alias:{$alias}");

        return response()->json([
            'success' => true,
            'message' => 'Đã xoá link rút gọn khỏi hệ thống.',
        ]);
    }
}
