<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services Credentials
    |--------------------------------------------------------------------------
    |
    | OAuth credentials for Google & Facebook Login via Laravel Socialite
    |
    */

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URI', 'https://sls.vnastar.com/auth/google/callback'),
    ],

    'facebook' => [
        'client_id'     => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect'      => env('FACEBOOK_REDIRECT_URI', 'https://sls.vnastar.com/auth/facebook/callback'),
    ],

];
