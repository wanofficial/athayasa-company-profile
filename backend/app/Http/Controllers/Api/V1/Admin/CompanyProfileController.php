<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;

class CompanyProfileController extends Controller
{
    /**
     * Get company profile.
     */
    public function show()
    {
        $profile = CompanyProfile::first();

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * Create or update company profile.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'established_year' => [
                'nullable',
                'integer',
                'min:1800',
                'max:' . date('Y'),
            ],

            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'website' => ['nullable', 'url', 'max:255'],

            'vision' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
        ]);

        $profile = CompanyProfile::first();

        if ($profile) {
            $profile->update($validated);
        } else {
            $profile = CompanyProfile::create($validated);
        }

        return response()->json([
            'success' => true,
            'message' => 'Company profile successfully saved.',
            'data' => $profile->fresh(),
        ]);
    }
}
