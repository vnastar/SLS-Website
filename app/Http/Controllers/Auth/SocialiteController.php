<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class SocialiteController extends Controller
{
    /**
     * Redirect user to provider's OAuth page
     */
    public function redirectToProvider(string $provider)
    {
        if (!in_array($provider, ['google', 'facebook'])) {
            return redirect()->route('login')->with('error', 'Phương thức đăng nhập không hỗ trợ.');
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Handle callback response from social provider
     */
    public function handleProviderCallback(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();

            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name'        => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Social User',
                    'email'       => $socialUser->getEmail(),
                    'password'    => bcrypt(uniqid('vnastar_', true)),
                    'role'        => 'user',
                    'daily_limit' => 500,
                    'status'      => 'active',
                ]);
            }

            Auth::login($user, true);

            return redirect()->route('links.index')->with('success', "Đăng nhập thành công qua {$provider}!");

        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Lỗi xác thực mạng xã hội: ' . $e->getMessage());
        }
    }
}
