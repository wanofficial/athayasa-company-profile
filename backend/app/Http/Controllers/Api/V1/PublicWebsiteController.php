<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\CompanyProfile;
use App\Models\Project;
use App\Models\Customer;
use App\Models\Service;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;

class PublicWebsiteController extends Controller
{
    /**
     * Homepage data.
     */
    public function home()
    {
        $settings = WebsiteSetting::query()->first();

        $companyProfile = CompanyProfile::query()->first();

        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(6)
            ->get();

        $projects = Project::query()
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(12)
            ->get();

        $customers = Customer::query()
            ->where('is_active', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(24)
            ->get();

        $articles = Article::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->take(24)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'settings' => $settings,
                'company_profile' => $companyProfile,
                'services' => $services,
                'projects' => $projects,
                'customers' => $customers,
                'articles' => $articles,
            ],
        ]);
    }

    /**
     * Public article listing.
     */
    public function articles(Request $request)
    {
        $perPage = min(
            max($request->integer('per_page', 9), 1),
            24
        );

        $articles = Article::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where(
                    'category',
                    $request->string('category')->toString()
                );
            })
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Public article detail by slug.
     */
    public function article(string $slug)
    {
        $article = Article::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }
}
