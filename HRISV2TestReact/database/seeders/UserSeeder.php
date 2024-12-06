<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the current highest `emp_no` in the users table
        $maxEmpNo = DB::table('users')->max('emp_no') ?? 0; // Defaults to 0 if no users exist
        $startEmpNo = 10000;
        $companies = ['TSL Marketing Corporation', 'Roadmax Marketing Corporation'];
        // Insert multiple users
        for ($i = 0; $i <= 10; $i++) {
            DB::table('users')->insert([
                'emp_no' => $startEmpNo + ($i + 1),
                'name' => 'User' . ($i + 1),
                'company' => $companies[array_rand($companies)],
                'password' => bcrypt('1234'),
            ]);
        }
    }
}
