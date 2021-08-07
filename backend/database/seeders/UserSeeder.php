<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            [
                'name' => 'Super Admin',
                'firstname' => 'Super',
                'lastname' => 'Admin',
                'email' => 'superadmin@gmail.com',
                'password' => 'password',
                'user_type_id' => 1,
            ]
        ];

        foreach ($types as $key => $type) {
            User::create($type);
        }
    }
}
