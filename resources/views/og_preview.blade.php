<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Open Graph Protocol Meta Tags for Facebook & Zalo Scrapers -->
    <title>{{ $ogTitle }}</title>
    <meta name="description" content="{{ $ogDescription }}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $shortUrl }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:secure_url" content="{{ $ogImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    @if(!empty($fbAppId))
    <meta property="fb:app_id" content="{{ $fbAppId }}">
    @endif

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $ogDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ $destinationUrl }}">
</head>
<body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px 20px;">
    <h2>Đang chuyển hướng tới liên kết gốc...</h2>
    <p style="color: #94a3b8;">{{ $ogTitle }}</p>
    <p><a href="{{ $destinationUrl }}" style="color: #f59e0b; text-decoration: underline;">Bấm vào đây nếu trình duyệt không tự chuyển hướng</a></p>
    
    <script>
        setTimeout(function() {
            window.location.href = "{{ $destinationUrl }}";
        }, 1500);
    </script>
</body>
</html>
