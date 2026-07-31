<?php

namespace Tests\Feature;

use App\Http\Middleware\DetectSocialCrawler;
use Illuminate\Http\Request;
use Tests\TestCase;

class SocialCrawlerDetectionTest extends TestCase
{
    protected DetectSocialCrawler $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new DetectSocialCrawler();
    }

    /** @test */
    public function it_identifies_facebook_bot_as_crawler()
    {
        $ua = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
        $this->assertTrue($this->middleware->isCrawlerUserAgent($ua));
    }

    /** @test */
    public function it_identifies_zalo_bot_as_crawler()
    {
        $ua = 'ZaloBot/1.0 (+http://zalo.me/zalobot)';
        $this->assertTrue($this->middleware->isCrawlerUserAgent($ua));
    }

    /** @test */
    public function it_identifies_telegram_bot_as_crawler()
    {
        $ua = 'TelegramBot (like TwitterBot)';
        $this->assertTrue($this->middleware->isCrawlerUserAgent($ua));
    }

    /** @test */
    public function it_does_not_flag_standard_chrome_user_agent_as_crawler()
    {
        $ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
        $this->assertFalse($this->middleware->isCrawlerUserAgent($ua));
    }
}
