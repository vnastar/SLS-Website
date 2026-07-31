<?php

namespace App\Policies;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShortLinkPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks (Admin override).
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ShortLink $shortLink): bool
    {
        return $user->id === $shortLink->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return !$user->hasReachedDailyLimit();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ShortLink $shortLink): bool
    {
        return $user->id === $shortLink->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ShortLink $shortLink): bool
    {
        return $user->id === $shortLink->user_id;
    }

    /**
     * Determine whether the user can toggle link status.
     */
    public function toggleStatus(User $user, ShortLink $shortLink): bool
    {
        return $user->id === $shortLink->user_id;
    }
}
