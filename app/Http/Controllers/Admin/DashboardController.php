<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use App\Models\ClickLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get system-wide analytics and statistics for Admin Dashboard
     */
    public function index()
    {
        $totalLinks = ShortLink::count();
        $totalClicks = ShortLink::sum('click_count');
        $totalUsers = User::count();
        $activeLinks = ShortLink::where('status', 'active')->count();

        // Clicks distribution by top countries
        $topCountries = ClickLog::select('country_code', DB::raw('count(*) as total'))
            ->groupBy('country_code')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // Clicks distribution by device type
        $devices = ClickLog::select('device', DB::raw('count(*) as total'))
            ->groupBy('device')
            ->orderBy('total', 'desc')
            ->get();

        // Recent 10 created links
        $recentLinks = ShortLink::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'summary' => [
                    'total_links'  => $totalLinks,
                    'total_clicks' => $totalClicks,
                    'total_users'  => $totalUsers,
                    'active_links' => $activeLinks,
                ],
                'top_countries' => $topCountries,
                'devices'       => $devices,
                'recent_links'  => $recentLinks,
            ],
        ]);
    }
}
