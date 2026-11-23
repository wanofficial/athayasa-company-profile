
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            // Hero Section
            $table->string('hero_title')->nullable();
            $table->string('hero_subtitle')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_primary_cta_text', 100)->nullable();
            $table->string('hero_primary_cta_url')->nullable();
            $table->string('hero_secondary_cta_text', 100)->nullable();
            $table->string('hero_secondary_cta_url')->nullable();
            $table->string('hero_image')->nullable();

            // About Section
            $table->string('about_title')->nullable();
            $table->text('about_description')->nullable();

            // Why Choose Us
            $table->string('why_title')->nullable();

            $table->string('reason_1_icon', 100)->nullable();
            $table->string('reason_1_title')->nullable();
            $table->text('reason_1_description')->nullable();

            $table->string('reason_2_icon', 100)->nullable();
            $table->string('reason_2_title')->nullable();
            $table->text('reason_2_description')->nullable();

            $table->string('reason_3_icon', 100)->nullable();
            $table->string('reason_3_title')->nullable();
            $table->text('reason_3_description')->nullable();

            // Section Visibility
            $table->boolean('show_about')->default(true);
            $table->boolean('show_services')->default(true);
            $table->boolean('show_projects')->default(true);
            $table->boolean('show_why_choose_us')->default(true);
            $table->boolean('show_articles')->default(true);
            $table->boolean('show_contact')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            $table->dropColumn([
                'hero_title',
                'hero_subtitle',
                'hero_description',
                'hero_primary_cta_text',
                'hero_primary_cta_url',
                'hero_secondary_cta_text',
                'hero_secondary_cta_url',
                'hero_image',
                'about_title',
                'about_description',
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
                'show_about',
                'show_services',
                'show_projects',
                'show_why_choose_us',
                'show_articles',
                'show_contact',
            ]);
        });
    }
};
