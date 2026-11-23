<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WebsiteSettingController extends Controller
{
    public function show()
    {
        $settings = WebsiteSetting::firstOrCreate(
            ['id' => 1],
            ['website_name' => 'PT Athayasa Mandiri']
        );

        return response()->json([
            'message' => 'Website settings retrieved successfully.',
            'data' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $settings = WebsiteSetting::firstOrCreate(
            ['id' => 1],
            ['website_name' => 'PT Athayasa Mandiri']
        );

        $validated = $request->validate([
            // Website Information
            'website_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            // Website Branding
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'favicon' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,ico', 'max:2048'],

            // Social Media
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'whatsapp_url' => ['nullable', 'url', 'max:255'],

            // Hero Section
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string'],
            'hero_primary_cta_text' => ['nullable', 'string', 'max:100'],
            'hero_primary_cta_url' => ['nullable', 'string', 'max:255'],
            'hero_secondary_cta_text' => ['nullable', 'string', 'max:100'],
            'hero_secondary_cta_url' => ['nullable', 'string', 'max:255'],
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],

            // About Section
            'about_title' => ['nullable', 'string', 'max:255'],
            'about_description' => ['nullable', 'string'],

            // Why Choose Us
            'why_title' => ['nullable', 'string', 'max:255'],

            'reason_1_icon' => ['nullable', 'string', 'max:100'],
            'reason_1_title' => ['nullable', 'string', 'max:255'],
            'reason_1_description' => ['nullable', 'string'],

            'reason_2_icon' => ['nullable', 'string', 'max:100'],
            'reason_2_title' => ['nullable', 'string', 'max:255'],
            'reason_2_description' => ['nullable', 'string'],

            'reason_3_icon' => ['nullable', 'string', 'max:100'],
            'reason_3_title' => ['nullable', 'string', 'max:255'],
            'reason_3_description' => ['nullable', 'string'],

            // Section Visibility
            'show_about' => ['sometimes', 'boolean'],
            'show_services' => ['sometimes', 'boolean'],
            'show_projects' => ['sometimes', 'boolean'],
            'show_why_choose_us' => ['sometimes', 'boolean'],
            'show_articles' => ['sometimes', 'boolean'],
            'show_customers' => ['sometimes', 'boolean'],
            'show_contact' => ['sometimes', 'boolean'],
        ]);

        unset(
            $validated['logo'],
            $validated['favicon'],
            $validated['hero_image']
        );

        $settings->fill($validated);

        // Handle image uploads
        foreach (['logo', 'favicon', 'hero_image'] as $field) {
            if ($request->hasFile($field)) {
                if ($settings->$field) {
                    Storage::disk('public')->delete($settings->$field);
                }

                $settings->$field = $request->file($field)
                    ->store('website-settings', 'public');
            }
        }

        $settings->save();

        return response()->json([
            'message' => 'Website settings updated successfully.',
            'data' => $settings->fresh(),
        ]);
    }
}
