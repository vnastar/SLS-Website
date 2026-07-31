<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'daily_limit',
        'is_active',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'daily_limit' => 'integer',
    ];

    /**
     * Relationship: User has many ShortLinks
     */
    public function shortLinks(): HasMany
    {
        return $this->hasMany(ShortLink::class);
    }

    /**
     * Relationship: User has many DailyLimits
     */
    public function dailyLimits(): HasMany
    {
        return $this->hasMany(UserDailyLimit::class);
    }

    /**
     * Check if user is an administrator
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user reached today's link limit
     */
    public function hasReachedDailyLimit(): bool
    {
        if ($this->isAdmin()) {
            return false;
        }

        $todayCount = $this->dailyLimits()
            ->where('date', now()->toDateString())
            ->value('links_created') ?? 0;

        return $todayCount >= $this->daily_limit;
    }
}
