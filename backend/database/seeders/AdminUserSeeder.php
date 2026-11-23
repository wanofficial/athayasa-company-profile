<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD');

        if (empty($password)) {
            throw new \RuntimeException(
                'ADMIN_PASSWORD belum diatur di file .env'
            );
        }

        Role::findOrCreate('super-admin', 'web');
        Role::findOrCreate('admin', 'web');

        $user = User::updateOrCreate(
            [
                'email' => env('ADMIN_EMAIL'),
            ],
            [
                'name' => env('ADMIN_NAME', 'System Administrator'),
                'password' => Hash::make($password),
                'is_active' => true,
            ]
        );

        $user->syncRoles(['super-admin']);
    }
}
