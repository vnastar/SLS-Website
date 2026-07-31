<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShortLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $linkId = $this->route('id') ?? $this->route('short_link');

        return [
            'destination_url' => ['sometimes', 'required', 'url', 'max:2048'],
            'title'           => ['nullable', 'string', 'max:255'],
            'status'          => ['nullable', 'in:active,paused,blocked'],
            'expires_at'      => ['nullable', 'date'],
            'og_title'        => ['nullable', 'string', 'max:255'],
            'og_description'  => ['nullable', 'string', 'max:1000'],
            'og_image'        => ['nullable', 'url', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'destination_url.url' => 'Đường dẫn đích không đúng định dạng URL.',
            'status.in'           => 'Trạng thái link chỉ có thể là active, paused hoặc blocked.',
        ];
    }
}
