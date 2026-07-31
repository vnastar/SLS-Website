@extends('layouts.app')

@section('title', 'Tạo & Quản Lý Link Rút Gọn - VNaStar Shortener')

@section('content')
<div x-data="shortenerApp()" class="space-y-8">

    <!-- Top Banner & Daily Limit Indicator -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
                <span class="text-amber-400">⚡</span> Rút Gọn Link Thông Minh & Tùy Chỉnh Open Graph
            </h1>
            <p class="text-xs text-slate-400 mt-1">
                Bypass crawler Facebook/Zalo, hiển thị ảnh tiêu đề tùy chọn khi chia sẻ mạng xã hội.
            </p>
        </div>

        <div class="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span class="text-slate-400 font-semibold">Giới Hạn Hôm Nay:</span>
            <span class="font-mono font-bold text-amber-400">{{ $todayCount ?? 0 }} / {{ auth()->user()->daily_limit ?? 500 }} Link</span>
            <div class="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-400 h-full" style="width: {{ min(100, (($todayCount ?? 0) / (auth()->user()->daily_limit ?? 500)) * 100) }}%"></div>
            </div>
        </div>
    </div>

    <!-- Main Creation Form Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <form @submit.prevent="submitCreateLink()" class="space-y-6">
            
            <!-- Destination URL Input -->
            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    1. Nhập Đường Dẫn Đích (Destination URL) <span class="text-amber-400">*</span>
                </label>
                <div class="relative">
                    <input type="url" 
                           x-model="form.destination_url" 
                           required 
                           placeholder="https://example.com/bai-viet-chi-tiet-san-pham"
                           class="w-full pl-4 pr-32 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-amber-300 placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" />
                    
                    <button type="button" 
                            @click="form.destination_url = 'https://sls.vnastar.com/digital-marketing-2026-campaign'"
                            class="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all">
                        Link Mẫu
                    </button>
                </div>
            </div>

            <!-- Custom Alias & Expiration Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Tùy Chỉnh Đường Dẫn (Custom Alias)
                    </label>
                    <div class="flex items-center">
                        <span class="bg-slate-950 border border-r-0 border-slate-800 px-3 py-2.5 rounded-l-xl text-xs font-mono text-slate-500">
                            {{ config('app.url') }}/
                        </span>
                        <input type="text" 
                               x-model="form.alias" 
                               placeholder="vnastar-sale"
                               class="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-xs font-mono text-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">
                        Ngày Hết Hạn Link (Optional)
                    </label>
                    <input type="datetime-local" 
                           x-model="form.expires_at" 
                           class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
                </div>
            </div>

            <!-- Toggle Open Graph Customization Section -->
            <div class="border-t border-slate-800 pt-4 space-y-4">
                <button type="button" 
                        @click="showOgSettings = !showOgSettings" 
                        class="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300">
                    <span x-text="showOgSettings ? '▼' : '►'"></span> 
                    Tùy Chỉnh Tiêu Đề, Mô Tả & Ảnh Xem Trước Khi Chia Sẻ (Open Graph Tags)
                </button>

                <div x-show="showOgSettings" x-collapse class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    <!-- Form OG Fields -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Tiêu Đề Thẻ (OG Title)</label>
                            <input type="text" x-model="form.og_title" placeholder="Chiến Dịch Truyền Thông VNaStar 2026" class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Thẻ (OG Description)</label>
                            <textarea rows="2" x-model="form.og_description" placeholder="Bùng nổ doanh số với giải pháp rút gọn link thông minh." class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"></textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1">URL Ảnh Xem Trước (OG Image)</label>
                            <input type="url" x-model="form.og_image" placeholder="https://images.unsplash.com/photo-1557804506-669a67965ba0" class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300" />
                        </div>
                    </div>

                    <!-- Live Social Card Preview Box -->
                    <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                        <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Live Open Graph Card Preview (Facebook / Zalo Feed)</span>
                        
                        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden max-w-sm mx-auto shadow-lg">
                            <div class="h-36 bg-slate-800 overflow-hidden relative">
                                <template x-if="form.og_image">
                                    <img :src="form.og_image" class="w-full h-full object-cover" />
                                </template>
                                <template x-if="!form.og_image">
                                    <div class="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">Chưa chọn ảnh thumbnail</div>
                                </template>
                            </div>
                            <div class="p-3 space-y-1">
                                <span class="text-[10px] font-mono text-slate-500 uppercase block">SLS.VNASTAR.COM</span>
                                <h4 class="text-xs font-bold text-white truncate" x-text="form.og_title || 'Tiêu đề bài viết chia sẻ'"></h4>
                                <p class="text-[11px] text-slate-400 line-clamp-2" x-text="form.og_description || 'Mô tả xem trước sẽ xuất hiện trên bảng tin Facebook & Zalo.'"></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" 
                    :disabled="loading"
                    class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all">
                <template x-if="loading">
                    <span>Đang xử lý tạo link...</span>
                </template>
                <template x-if="!loading">
                    <span>🚀 Rút Gọn Link Ngay</span>
                </template>
            </button>
        </form>
    </div>

    <!-- Recent Links Table / List -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 class="text-sm font-bold text-white">Danh Sách Link Đã Tạo Của Bạn</h3>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                        <th class="p-3">Rút Gọn (Alias)</th>
                        <th class="p-3">Đường Dẫn Gốc</th>
                        <th class="p-3 text-center">Lượt Click</th>
                        <th class="p-3 text-center">Trạng Thái</th>
                        <th class="p-3 text-right">Thao Tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-300">
                    <template x-for="link in links" :key="link.id">
                        <tr>
                            <td class="p-3 font-bold text-amber-400">
                                <a :href="'/' + link.alias" target="_blank" class="hover:underline" x-text="'/' + link.alias"></a>
                            </td>
                            <td class="p-3 max-w-xs truncate text-slate-400 font-sans" x-text="link.destination_url"></td>
                            <td class="p-3 text-center font-bold text-emerald-400" x-text="link.click_count"></td>
                            <td class="p-3 text-center">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                                      :class="link.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400'">
                                    <span x-text="link.status"></span>
                                </span>
                            </td>
                            <td class="p-3 text-right space-x-2">
                                <button @click="copyToClipboard(link.alias)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-sans">
                                    Copy Link
                                </button>
                                <button @click="openQrModal(link.alias)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-sans">
                                    Mã QR
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

</div>

<script>
function shortenerApp() {
    return {
        loading: false,
        showOgSettings: false,
        form: {
            destination_url: '',
            alias: '',
            expires_at: '',
            og_title: '',
            og_description: '',
            og_image: '',
        },
        links: [
            { id: 1, alias: 'vn8aS2', destination_url: 'https://sls.vnastar.com/campaign/summer-sale', click_count: 142, status: 'active' },
            { id: 2, alias: 'zalo-promo', destination_url: 'https://sls.vnastar.com/landing-page', click_count: 89, status: 'active' },
        ],
        async submitCreateLink() {
            this.loading = true;
            setTimeout(() => {
                const alias = this.form.alias || 'vN' + Math.random().toString(36).substring(2, 6);
                this.links.unshift({
                    id: Date.now(),
                    alias: alias,
                    destination_url: this.form.destination_url,
                    click_count: 0,
                    status: 'active'
                });
                this.form.destination_url = '';
                this.form.alias = '';
                this.loading = false;
                alert('Tạo link rút gọn thành công!');
            }, 500);
        },
        copyToClipboard(alias) {
            const url = window.location.origin + '/' + alias;
            navigator.clipboard.writeText(url);
            alert('Đã sao chép link: ' + url);
        },
        openQrModal(alias) {
            alert('Mã QR cho link /' + alias + ' sẵn sàng tải về.');
        }
    }
}
</script>
@endsection
