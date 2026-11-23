<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $fillable = [
        'company_name',
        'tagline',
        'description',
        'established_year',
        'email',
        'phone',
        'address',
        'website',
        'vision',
        'mission',
    ];
}
