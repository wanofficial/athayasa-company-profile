
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Admin\CompanyProfileController;
use App\Http\Controllers\Api\V1\Admin\ServiceController;
use App\Http\Controllers\Api\V1\Admin\ProjectController;
use App\Http\Controllers\Api\V1\Admin\ArticleController;
use App\Http\Controllers\Api\V1\Admin\CustomerController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\WebsiteSettingController;
use App\Http\Controllers\Api\V1\PublicWebsiteController;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Public API
    |--------------------------------------------------------------------------
    */

    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'application' => 'PT Athayasa Mandiri',
            'message' => 'API is running successfully.',
            'version' => '1.0.0',
            'environment' => app()->environment(),
        ]);
    });
    Route::get('/website/home', [PublicWebsiteController::class, 'home']);

    Route::get('/website/articles', [PublicWebsiteController::class, 'articles']);

    Route::get('/website/articles/{slug}', [PublicWebsiteController::class, 'article']);


    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:5,1');

        Route::middleware('auth:sanctum')->group(function () {

            Route::get('/me', [AuthController::class, 'me']);

            Route::post('/logout', [AuthController::class, 'logout']);

        });

    });

    /*
    |--------------------------------------------------------------------------
    | Protected Administrator API
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'auth:sanctum',
        'role:super-admin|admin',
    ])->prefix('admin')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', DashboardController::class);

        /*
        |--------------------------------------------------------------------------
        | Company Profile Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/company-profile',
            [CompanyProfileController::class, 'show']
        );

        Route::put(
            '/company-profile',
            [CompanyProfileController::class, 'update']
        );

        /*
        |--------------------------------------------------------------------------
        | Services Management
        |--------------------------------------------------------------------------
        */

        Route::apiResource('services', ServiceController::class);

        /*
        |--------------------------------------------------------------------------
        | Projects Management
        |--------------------------------------------------------------------------
        */

        Route::apiResource('projects', ProjectController::class);

        /*
        |--------------------------------------------------------------------------
        | Customers Management
        |--------------------------------------------------------------------------
        */

        Route::apiResource('customers', CustomerController::class);

        /*
        |--------------------------------------------------------------------------
        | Articles Management
        |--------------------------------------------------------------------------
        */

        Route::apiResource('articles', ArticleController::class);

        /*
        |--------------------------------------------------------------------------
        | Website Settings Management
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/settings',
            [WebsiteSettingController::class, 'show']
        );

        Route::post(
            '/settings',
            [WebsiteSettingController::class, 'update']
        );

    });

});
