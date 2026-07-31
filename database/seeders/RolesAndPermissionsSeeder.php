<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ShortLink;
use App\Models\LinkMetadata;
use App\Models\ClickLog;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Default Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@sls.vnastar.com'],
            [
                'name' => 'VNaStar System Administrator',
                'password' => Hash::make('VNaStar@2026!'),
                'role' => 'admin',
                'daily_limit' => 10000,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Regular Demo User
        $user = User::firstOrCreate(
            ['email' => 'demo@sls.vnastar.com'],
            [
                'name' => 'VNaStar Demo User',
                'password' => Hash::make('DemoUser2026!'),
                'role' => 'user',
                'daily_limit' => 50,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Create Demo Short Link for Admin
        $link1 = ShortLink::firstOrCreate(
            ['alias' => 'vnastar-campaign-2026'],
            [
                'user_id' => $admin->id,
                'destination_url' => 'https://sls.vnastar.com/campaigns/summer-2026',
                'title' => 'VNaStar Summer Campaign 2026',
                'status' => 'active',
                'click_count' => 12450,
                'utm_params' => [
                    'utm_source' => 'facebook',
                    'utm_medium' => 'cpc',
                    'utm_campaign' => 'summer_promo',
                ],
            ]
        );

        LinkMetadata::firstOrCreate(
            ['short_link_id' => $link1->id],
            [
                'og_title' => 'Chiến Dịch Truyền Thông VNaStar Summer 2026',
                'og_description' => 'Tham gia cùng VNaStar Media bứt phá doanh số với giải pháp tiếp thị liên kết và rút gọn link thông minh.',
                'og_image' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
                'facebook_app_id' => '1029384756',
                'use_custom_og' => true,
            ]
        );

        // 4. Create Demo Short Link for User
        $link2 = ShortLink::firstOrCreate(
            ['alias' => 'shopee-voucher-99'],
            [
                'user_id' => $user->id,
                'destination_url' => 'https://shopee.vn/m/sale-lum-voucher-99k',
                'title' => 'Shopee Sale Voucher 99K',
                'status' => 'active',
                'click_count' => 3890,
                'utm_params' => [
                    'utm_source' => 'zalo',
                    'utm_medium' => 'social_group',
                ],
            ]
        );

        LinkMetadata::firstOrCreate(
            ['short_link_id' => $link2->id],
            [
                'og_title' => 'Săn Voucher Shopee 99K Khủng Nhất Ngày',
                'og_description' => 'Click ngay để nhận mã giảm giá 99K trực tiếp vào ví Shopee Pay của bạn.',
                'og_image' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
                'use_custom_og' => true,
            ]
        );

        // 5. Create Sample Analytics Logs
        for ($i = 0; $i < 20; $i++) {
            ClickLog::create([
                'short_link_id' => $link1->id,
                'ip_address' => '113.161.' . rand(1, 254) . '.' . rand(1, 254),
                'country_code' => 'VN',
                'city' => rand(0, 1) ? 'Ho Chi Minh' : 'Hanoi',
                'device' => rand(0, 1) ? 'mobile' : 'desktop',
                'os' => rand(0, 1) ? 'iOS' : 'Android',
                'browser' => 'Chrome',
                'referer' => 'https://facebook.com/',
                'is_crawler' => false,
                'created_at' => now()->subHours(rand(1, 48)),
            ]);
        }
    }
}
