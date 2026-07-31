<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ShortLink;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function unauthenticated_user_cannot_access_dashboard()
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    /** @test */
    public function user_cannot_edit_another_users_short_link()
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $linkA = ShortLink::factory()->create([
            'user_id' => $userA->id,
            'alias'   => 'link-user-a',
        ]);

        $response = $this->actingAs($userB)->delete("/api/short-links/{$linkA->id}");

        $response->assertStatus(403);
    }
}
