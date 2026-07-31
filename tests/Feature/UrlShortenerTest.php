<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use App\Services\UrlShortenerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UrlShortenerTest extends TestCase
{
    use RefreshDatabase;

    protected UrlShortenerService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(UrlShortenerService::class);
    }

    /** @test */
    public function it_can_generate_a_unique_6_character_alias()
    {
        $alias = $this->service->generateUniqueAlias();

        $this->assertEquals(6, strlen($alias));
        $this->assertMatchesRegularExpression('/^[a-zA-Z0-9]+$/', $alias);
    }

    /** @test */
    public function it_can_create_short_link_with_custom_og_metadata()
    {
        $user = User::factory()->create(['daily_limit' => 500]);

        $data = [
            'destination_url' => 'https://sls.vnastar.com/campaign/summer-2026',
            'alias'           => 'summer-2026',
            'og_title'        => 'Chiến Dịch Hè VNaStar',
            'og_description'  => 'Mô tả xem trước truyền thông',
            'og_image'        => 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
        ];

        $shortLink = $this->service->createShortLink($data, $user);

        $this->assertDatabaseHas('short_links', [
            'alias'           => 'summer-2026',
            'destination_url' => 'https://sls.vnastar.com/campaign/summer-2026',
            'user_id'         => $user->id,
        ]);

        $this->assertDatabaseHas('link_metadata', [
            'short_link_id' => $shortLink->id,
            'og_title'      => 'Chiến Dịch Hè VNaStar',
        ]);
    }

    /** @test */
    public function it_appends_utm_parameters_correctly()
    {
        $url = 'https://sls.vnastar.com/landing-page';
        $utm = [
            'utm_source'   => 'facebook',
            'utm_medium'   => 'cpc',
            'utm_campaign' => 'summer_sale',
        ];

        $resultUrl = $this->service->buildUrlWithUtm($url, $utm);

        $this->assertStringContainsString('utm_source=facebook', $resultUrl);
        $this->assertStringContainsString('utm_medium=cpc', $resultUrl);
        $this->assertStringContainsString('utm_campaign=summer_sale', $resultUrl);
    }
}
