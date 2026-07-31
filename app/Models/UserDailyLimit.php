<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDailyLimit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'links_created',
    ];

    protected $casts = [
        'date' => 'date',
        'links_created' => 'integer',
    ];

    /**
     * Relationship: UserDailyLimit belongs to User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
