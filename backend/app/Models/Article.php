<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'summary',
        'body',
        'cover_image',
        'image_credit',
        'image_source_url',
        'author',
        'status',
        'published_at',
        'seo_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
