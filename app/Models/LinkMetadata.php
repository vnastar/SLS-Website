<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinkMetadata extends Model
{
    use HasFactory;

    protected $table = 'link_metadatas';

    protected $fillable = [
        'short_link_id',
        'og_title',
        'og_description',
        'og_image',
        'facebook_app_id',
        'use_custom_og',
    ];

    protected $casts = [
        'use_custom_og' => 'boolean',
    ];

    /**
     * Relationship: LinkMetadata belongs to ShortLink
     */
    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
