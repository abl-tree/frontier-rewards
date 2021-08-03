<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserType;

class UserTypeSeeder extends Seeder
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
                'code' => 1,
                'name' => 'Superadmin',
            ],[
                'code' => 2,
                'name' => 'Admin',
            ],[
                'code' => 3,
                'name' => 'Customer',
            ]
        ];

        foreach ($types as $key => $type) {
            UserType::create($type);
        }
    }
}
