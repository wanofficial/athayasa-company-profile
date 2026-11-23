<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    /**
     * Display articles with search, filters and pagination.
     */
    public function index(Request $request)
    {
        $articles = Article::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Store a new article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'image_credit' => ['nullable', 'string', 'max:255'],
            'image_source_url' => ['nullable', 'url', 'max:2048'],
            'author' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['slug'] = $this->generateUniqueSlug(
            $validated['title']
        );

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')
                ->store('articles', 'public');
        }

        if ($validated['status'] === 'published') {
            $validated['published_at'] = $validated['published_at'] ?? now();
        } else {
            $validated['published_at'] = null;
        }

        $article = Article::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Article created successfully.',
            'data' => $article,
        ], 201);
    }

    /**
     * Display a specific article.
     */
    public function show(Article $article)
    {
        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Update an existing article.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'image_credit' => ['nullable', 'string', 'max:255'],
            'image_source_url' => ['nullable', 'url', 'max:2048'],
            'author' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ]);

        if ($validated['title'] !== $article->title) {
            $validated['slug'] = $this->generateUniqueSlug(
                $validated['title'],
                $article->id
            );
        }

        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) {
                Storage::disk('public')->delete($article->cover_image);
            }

            $validated['cover_image'] = $request->file('cover_image')
                ->store('articles', 'public');
        }

        if ($validated['status'] === 'published') {
            $validated['published_at'] =
                $validated['published_at']
                ?? $article->published_at
                ?? now();
        } else {
            $validated['published_at'] = null;
        }

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully.',
            'data' => $article->fresh(),
        ]);
    }

    /**
     * Delete an article.
     */
    public function destroy(Article $article)
    {
        if ($article->cover_image) {
            Storage::disk('public')->delete($article->cover_image);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully.',
        ]);
    }

    /**
     * Generate a unique article slug.
     */
    private function generateUniqueSlug(
        string $title,
        ?int $ignoreId = null
    ): string {
        $baseSlug = Str::slug($title) ?: 'article';
        $slug = $baseSlug;
        $counter = 1;

        while (
            Article::where('slug', $slug)
                ->when(
                    $ignoreId,
                    fn ($query) => $query->where('id', '!=', $ignoreId)
                )
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
