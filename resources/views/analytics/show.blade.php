@extends('layouts.app')

@section('title', 'Báo Cáo Chi Tiết Analytics - VNaStar Shortener')

@section('content')
<div class="space-y-8">

    <!-- Top Link Overview Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <span class="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">Thống Kê Chi Tiết Link Rút Gọn</span>
                <h1 class="text-2xl font-black text-white font-mono">/{{ $alias ?? 'vn8aS2' }}</h1>
                <p class="text-xs text-slate-400 mt-1 font-sans">
                    Đích tới: <a href="{{ $destination_url ?? 'https://sls.vnastar.com/campaign' }}" target="_blank" class="text-amber-300 hover:underline">{{ $destination_url ?? 'https://sls.vnastar.com/campaign' }}</a>
                </p>
            </div>

            <div class="flex items-center gap-4">
                <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <span class="text-[10px] text-slate-500 uppercase font-mono block">Tổng Lượt Click</span>
                    <span class="text-xl font-bold text-emerald-400 font-mono">{{ $click_count ?? 142 }}</span>
                </div>
                <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <span class="text-[10px] text-slate-500 uppercase font-mono block">Social Crawler</span>
                    <span class="text-xl font-bold text-purple-400 font-mono">24</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Analytics Charts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Device Breakdown Chart -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
                📱 Phân Thiết Bị Truy Cập (Mobile / Desktop)
            </h3>
            <div class="h-64">
                <canvas id="deviceChart"></canvas>
            </div>
        </div>

        <!-- Geographic Location Breakdown -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
                🌍 Quốc Gia & Vùng Miền Truy Cập
            </h3>
            <div class="space-y-3">
                <div class="flex items-center justify-between text-xs font-mono">
                    <span class="text-slate-300">🇻🇳 Việt Nam (VN)</span>
                    <span class="font-bold text-emerald-400">128 clicks (90%)</span>
                </div>
                <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-400 h-full" style="width: 90%"></div>
                </div>

                <div class="flex items-center justify-between text-xs font-mono pt-2">
                    <span class="text-slate-300">🇺🇸 Hoa Kỳ (US)</span>
                    <span class="font-bold text-amber-400">10 clicks (7%)</span>
                </div>
                <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div class="bg-amber-400 h-full" style="width: 7%"></div>
                </div>

                <div class="flex items-center justify-between text-xs font-mono pt-2">
                    <span class="text-slate-300">🇸🇬 Singapore (SG)</span>
                    <span class="font-bold text-blue-400">4 clicks (3%)</span>
                </div>
                <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-400 h-full" style="width: 3%"></div>
                </div>
            </div>
        </div>

    </div>

    <!-- Recent Click Logs Stream Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 class="text-sm font-bold text-white">Nhật Ký Lượt Truy Cập Thời Gian Thực (Click Logs)</h3>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
                <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                        <th class="p-3">Thời Gian</th>
                        <th class="p-3">Địa Chỉ IP</th>
                        <th class="p-3">Quốc Gia</th>
                        <th class="p-3">Thiết Bị / Trình Duyệt</th>
                        <th class="p-3">Nguồn Giới Thiệu (Referer)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-300">
                    <tr>
                        <td class="p-3 text-slate-400">2026-07-30 15:02:11</td>
                        <td class="p-3 text-amber-300">113.161.22.84</td>
                        <td class="p-3">Hanoi, VN</td>
                        <td class="p-3">Mobile (Zalo Browser)</td>
                        <td class="p-3 text-slate-400 truncate max-w-xs">https://l.facebook.com/</td>
                    </tr>
                    <tr>
                        <td class="p-3 text-slate-400">2026-07-30 14:58:40</td>
                        <td class="p-3 text-amber-300">14.161.10.99</td>
                        <td class="p-3">HCM, VN</td>
                        <td class="p-3">Desktop (Chrome / Windows)</td>
                        <td class="p-3 text-slate-400 truncate max-w-xs">Trực tiếp / Direct</td>
                    </tr>
                    <tr>
                        <td class="p-3 text-slate-400">2026-07-30 14:40:05</td>
                        <td class="p-3 text-purple-300 font-bold">31.13.127.11 (Bot)</td>
                        <td class="p-3">US</td>
                        <td class="p-3 text-purple-400 font-bold">Facebook Bot Crawler</td>
                        <td class="p-3 text-purple-300 font-bold">Facebookexternalhit/1.1</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('deviceChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Mobile (iOS / Android)', 'Desktop (Chrome / Safari)', 'Tablet'],
            datasets: [{
                data: [98, 38, 6],
                backgroundColor: ['#f59e0b', '#10b981', '#6366f1'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 11 } }
                }
            }
        }
    });
});
</script>
@endsection
