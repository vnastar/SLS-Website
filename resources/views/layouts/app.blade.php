<!DOCTYPE html>
<html lang="vi" class="h-full bg-slate-950 font-sans antialiased text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Smart Link Shortener - VNaStar Media')</title>

    <!-- Tailwind CSS v3 / Inter Font -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#fffbe1',
                            100: '#fff3b7',
                            400: '#fbbf24',
                            500: '#f59e0b',
                            600: '#d97706',
                            950: '#0f172a',
                        }
                    }
                }
            }
        }
    </script>

    <!-- Alpine.js v3 for Client-side Reactivity -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <!-- Chart.js for Analytics -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    @stack('styles')
</head>
<body class="h-full bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">

    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800" x-data="{ userMenuOpen: false, mobileMenuOpen: false }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                
                <!-- Logo & Brand -->
                <div class="flex items-center gap-3">
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                            V
                        </div>
                        <div>
                            <span class="font-bold text-white tracking-tight text-base block">VNaStar Shortener</span>
                            <span class="text-[10px] text-amber-400 font-mono block -mt-1">SMART LINK ENGINE</span>
                        </div>
                    </a>
                </div>

                <!-- Navigation Links -->
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
                    <a href="{{ route('links.index') }}" class="hover:text-amber-400 transition-colors {{ request()->routeIs('links.*') ? 'text-amber-400 font-bold' : '' }}">
                        Quản Lý Link
                    </a>
                    <a href="{{ route('analytics.index') }}" class="hover:text-amber-400 transition-colors {{ request()->routeIs('analytics.*') ? 'text-amber-400 font-bold' : '' }}">
                        Thống Kê Analytics
                    </a>
                    @if(auth()->user() && auth()->user()->isAdmin())
                    <a href="{{ route('admin.dashboard') }}" class="hover:text-amber-400 transition-colors text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        Admin Portal
                    </a>
                    @endif
                </nav>

                <!-- User Profile & Dropdown -->
                <div class="relative flex items-center gap-4">
                    <div class="relative" @click.away="userMenuOpen = false">
                        <button @click="userMenuOpen = !userMenuOpen" class="flex items-center gap-2 text-sm font-medium focus:outline-none">
                            <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                                {{ substr(auth()->user()->name ?? 'Admin', 0, 1) }}
                            </div>
                            <span class="hidden sm:inline-block text-slate-200">{{ auth()->user()->name ?? 'System Admin' }}</span>
                        </button>

                        <!-- Profile Dropdown Menu -->
                        <div x-show="userMenuOpen" 
                             x-transition:enter="transition ease-out duration-100"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             class="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs text-slate-300 space-y-1">
                            <a href="{{ route('profile.edit') }}" class="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400">Thiết Lập Tài Khoản</a>
                            <a href="{{ route('api-tokens.index') }}" class="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400">Mã API Token</a>
                            <div class="border-t border-slate-800 my-1"></div>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800">Đăng Xuất</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </header>

    <!-- Global Toast / Alert Banner -->
    @if(session('success'))
    <div class="bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 px-4 py-3 text-xs font-semibold text-center flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        {{ session('success') }}
    </div>
    @endif

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4">
            <p>© {{ date('Y') }} VNaStar Media. All rights reserved. Smart Link Engine v2.5.</p>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
