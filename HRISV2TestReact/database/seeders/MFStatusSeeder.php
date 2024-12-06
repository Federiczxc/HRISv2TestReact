<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MFStatusSeeder extends Seeder
{
    /**created_date
     * Run the database seeds.
     */
    public function run(): void
    {
   
   
  
        $table = [
            ['mf_status_code' => 'PND', 'mf_status_name' => 'Pending', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
            ['mf_status_code' => 'APRV', 'mf_status_name' => 'Approved', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
            ['mf_status_code' => 'DISAPRV', 'mf_status_name' => 'Disapproved', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
            ['mf_status_code' => 'SPOIL', 'mf_status_name' => 'Spoiled', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
        ];
        DB::table('hris_mf_status')->insert($table);

    }
}
