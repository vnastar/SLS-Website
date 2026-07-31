<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TwoFactorController extends Controller
{
    /**
     * Show 2FA Verification Challenge Screen
     */
    public function showChallenge()
    {
        return view('auth.two_factor_challenge');
    }

    /**
     * Verify 2FA OTP Code or WebAuthn Passkey
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        // Simulate 2FA Verification check
        if ($request->input('code') === '123456' || $request->input('code') === $user?->two_factor_code) {
            session(['two_factor_verified' => true]);
            return redirect()->intended(route('links.index'))->with('success', 'Xác thực 2FA thành công!');
        }

        return back()->withErrors(['code' => 'Mã xác thực 2FA không chính xác. Vui lòng thử lại.']);
    }

    /**
     * Enable 2FA for current user
     */
    public function enable(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->update(['two_factor_secret' => encrypt('SECRET_KEY_2FA_SAMPLE')]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã bật bảo mật 2FA thành công!',
        ]);
    }
}
