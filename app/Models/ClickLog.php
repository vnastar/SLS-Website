<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClickLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'short_link_id',
        'ip_address',
        'country_code',
        'city',
        'device',
        'os',
        'browser',
        'referer',
        'is_crawler',
        'created_at',
    ];

    protected $casts = [
        'is_crawler' => 'boolean',
        'created_at' => 'datetime',
    ];

    /**
     * Relationship: ClickLog belongs to ShortLink
     */
    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
