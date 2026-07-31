<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateShortLinkRequest;
use App\Http\Requests\UpdateShortLinkRequest;
use App\Repositories\Contracts\ShortLinkRepositoryInterface;
use App\Services\UrlShortenerService;
use Illuminate\Http\Request;
use Exception;

class ShortLinkController extends Controller
{
    protected ShortLinkRepositoryInterface $shortLinkRepo;
    protected UrlShortenerService $shortenerService;

    public function __construct(
        ShortLinkRepositoryInterface $shortLinkRepo,
        UrlShortenerService $shortenerService
    ) {
        $this->shortLinkRepo = $shortLinkRepo;
        $this->shortenerService = $shortenerService;
    }

    /**
     * Display a listing of short links for logged-in user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user && $user->isAdmin()) {
            $links = $this->shortLinkRepo->getAllPaginated(20, $request->only(['search', 'status']));
        } else {
            $links = $this->shortLinkRepo->getUserLinks($user?->id ?? 0, 20);
        }

        return response()->json([
            'success' => true,
            'data'    => $links,
        ]);
    }

    /**
     * Store a newly created short link in storage using FormRequest and Service
     */
    public function store(CreateShortLinkRequest $request)
    {
        try {
            $user = $request->user();
            $data = $request->validated();

            $shortLink = $this->shortenerService->createShortLink($data, $user);

            return response()->json([
                'success' => true,
                'message' => 'Tạo liên kết rút gọn thành công!',
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
     * Display the specified short link details
     */
    public function show(int $id)
    {
        $shortLink = $this->shortLinkRepo->findById($id);

        if (!$shortLink) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy liên kết.'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $shortLink,
        ]);
    }

    /**
     * Update the specified short link in storage
     */
    public function update(UpdateShortLinkRequest $request, int $id)
    {
        $shortLink = $this->shortLinkRepo->findById($id);

        if (!$shortLink) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy liên kết.'], 404);
        }

        $data = $request->validated();
        $this->shortLinkRepo->update($shortLink, $data);

        // Re-cache updated shortlink
        $this->shortenerService->cacheShortLink($shortLink);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật liên kết thành công!',
            'data'    => $shortLink->fresh('metadata'),
        ]);
    }

    /**
     * Remove the specified short link from storage
     */
    public function destroy(int $id)
    {
        $shortLink = $this->shortLinkRepo->findById($id);

        if (!$shortLink) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy liên kết.'], 404);
        }

        $alias = $shortLink->alias;
        $this->shortLinkRepo->delete($shortLink);

        // Evict Cache
        \Illuminate\Support\Facades\Cache::forget("short_link:alias:{$alias}");

        return response()->json([
            'success' => true,
            'message' => 'Đã xoá liên kết thành công.',
        ]);
    }
}
