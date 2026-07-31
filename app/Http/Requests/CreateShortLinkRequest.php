<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateShortLinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'destination_url' => ['required', 'url', 'max:2048'],
            'alias'           => ['nullable', 'string', 'alpha_dash', 'max:32', 'unique:short_links,alias'],
            'title'           => ['nullable', 'string', 'max:255'],
            'expires_at'      => ['nullable', 'date', 'after:now'],
            'password'        => ['nullable', 'string', 'min:4', 'max:32'],
            'og_title'        => ['nullable', 'string', 'max:255'],
            'og_description'  => ['nullable', 'string', 'max:1000'],
            'og_image'        => ['nullable', 'url', 'max:2048'],
            'facebook_app_id' => ['nullable', 'string', 'max:64'],
            'utm_params'      => ['nullable', 'array'],
            'utm_params.utm_source'   => ['nullable', 'string', 'max:64'],
            'utm_params.utm_medium'   => ['nullable', 'string', 'max:64'],
            'utm_params.utm_campaign' => ['nullable', 'string', 'max:64'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'destination_url.required' => 'Vui lòng nhập đường dẫn đích cần rút gọn.',
            'destination_url.url'      => 'Đường dẫn đích phải là định dạng URL hợp lệ (http:// hoặc https://).',
            'alias.alpha_dash'         => 'Alias chỉ được chứa chữ cái, chữ số, dấu gạch ngang (-) và gạch dưới (_).',
            'alias.unique'             => 'Alias tùy chỉnh này đã được sử dụng. Vui lòng chọn alias khác.',
            'expires_at.after'         => 'Thời gian hết hạn phải diễn ra sau thời điểm hiện tại.',
            'og_image.url'             => 'Đường dẫn ảnh Open Graph phải là URL hợp lệ.',
        ];
    }
}
