<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\CompanyProfile;
use App\Models\Customer;
use App\Models\Project;
use App\Models\Service;
use App\Models\WebsiteSetting;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'services' => [
                    'total' => Service::count(),
                    'active' => Service::where('is_active', true)->count(),
                ],
                'projects' => [
                    'total' => Project::count(),
                    'active' => Project::where('is_active', true)->count(),
                ],
                'customers' => [
                    'total' => Customer::count(),
                    'active' => Customer::where('is_active', true)->count(),
                ],
                'articles' => [
                    'total' => Article::count(),
                    'published' => Article::query()
                        ->where('status', 'published')
                        ->where(fn ($query) => $query
                            ->whereNull('published_at')
                            ->orWhere('published_at', '<=', now()))
                        ->count(),
                    'drafts' => Article::where('status', 'draft')->count(),
                ],
                'company_profile_configured' => CompanyProfile::exists(),
                'website_settings_configured' => WebsiteSetting::exists(),
            ],
        ]);
    }
}
