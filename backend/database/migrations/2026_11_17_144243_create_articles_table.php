
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            // Article Information
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->string('summary', 500)->nullable();
            $table->longText('body')->nullable();

            // Cover Image
            $table->string('cover_image')->nullable();

            // Publishing
            $table->string('author')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();

            // SEO
            $table->string('seo_title')->nullable();
            $table->string('meta_description', 500)->nullable();

            $table->timestamps();

            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
