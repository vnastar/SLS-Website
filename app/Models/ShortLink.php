<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShortLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'alias',
        'destination_url',
        'title',
        'status',
        'expires_at',
        'password',
        'click_count',
        'utm_params',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'click_count' => 'integer',
        'utm_params' => 'array',
    ];

    /**
     * Relationship: ShortLink belongs to User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: ShortLink has one LinkMetadata
     */
    public function metadata(): HasOne
    {
        return $this->hasOne(LinkMetadata::class);
    }

    /**
     * Relationship: ShortLink has many ClickLogs
     */
    public function clickLogs(): HasMany
    {
        return $this->hasMany(ClickLog::class);
    }

    /**
     * Check if link is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if link requires a password
     */
    public function isPasswordProtected(): bool
    {
        return !empty($this->password);
    }

    /**
     * Get full shortened URL
     */
    public function getShortUrlAttribute(): string
    {
        return config('app.url') . '/' . $this->alias;
    }
}
