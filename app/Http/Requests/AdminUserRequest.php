<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255', 'unique:users,email,' . $userId],
            'role'        => ['required', 'in:user,admin,agency'],
            'daily_limit' => ['required', 'integer', 'min:1', 'max:100000'],
            'status'      => ['required', 'in:active,suspended'],
        ];
    }
}
