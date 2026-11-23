<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    protected $fillable = [
        // Website Information
        'website_name',
        'tagline',
        'description',

        // Website Branding
        'logo',
        'favicon',

        // Social Media
        'instagram_url',
        'facebook_url',
        'linkedin_url',
        'whatsapp_url',

        // Hero Section
        'hero_title',
        'hero_subtitle',
        'hero_description',
        'hero_primary_cta_text',
        'hero_primary_cta_url',
        'hero_secondary_cta_text',
        'hero_secondary_cta_url',
        'hero_image',

        // About Section
        'about_title',
        'about_description',

        // Why Choose Us
        'why_title',
        'reason_1_icon',
        'reason_1_title',
        'reason_1_description',
        'reason_2_icon',
        'reason_2_title',
        'reason_2_description',
        'reason_3_icon',
        'reason_3_title',
        'reason_3_description',

        // Section Visibility
        'show_about',
        'show_services',
        'show_projects',
        'show_why_choose_us',
        'show_articles',
        'show_customers',
        'show_contact',
    ];

    protected function casts(): array
    {
        return [
            'show_about' => 'boolean',
            'show_services' => 'boolean',
            'show_projects' => 'boolean',
            'show_why_choose_us' => 'boolean',
            'show_articles' => 'boolean',
            'show_customers' => 'boolean',
            'show_contact' => 'boolean',
        ];
    }
}
