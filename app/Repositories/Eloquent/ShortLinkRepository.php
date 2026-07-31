<?php

namespace App\Repositories\Eloquent;

use App\Models\ShortLink;
use App\Repositories\Contracts\ShortLinkRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ShortLinkRepository implements ShortLinkRepositoryInterface
{
    public function findById(int $id): ?ShortLink
    {
        return ShortLink::with('metadata')->find($id);
    }

    public function findByAlias(string $alias): ?ShortLink
    {
        return ShortLink::with('metadata')->where('alias', $alias)->first();
    }

    public function getUserLinks(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return ShortLink::with('metadata')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getAllPaginated(int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        $query = ShortLink::with(['user', 'metadata']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('alias', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('destination_url', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function create(array $data): ShortLink
    {
        return ShortLink::create($data);
    }

    public function update(ShortLink $shortLink, array $data): bool
    {
        return $shortLink->update($data);
    }

    public function delete(ShortLink $shortLink): bool
    {
        return $shortLink->delete();
    }

    public function incrementClick(ShortLink $shortLink): void
    {
        $shortLink->increment('click_count');
    }
}
