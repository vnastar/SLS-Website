<?php

namespace App\Repositories\Contracts;

use App\Models\ShortLink;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ShortLinkRepositoryInterface
{
    public function findById(int $id): ?ShortLink;

    public function findByAlias(string $alias): ?ShortLink;

    public function getUserLinks(int $userId, int $perPage = 20): LengthAwarePaginator;

    public function getAllPaginated(int $perPage = 20, array $filters = []): LengthAwarePaginator;

    public function create(array $data): ShortLink;

    public function update(ShortLink $shortLink, array $data): bool;

    public function delete(ShortLink $shortLink): bool;

    public function incrementClick(ShortLink $shortLink): void;
}
