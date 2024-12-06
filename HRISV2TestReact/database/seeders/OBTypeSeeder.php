<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OBTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $table = [
            ['ob_type_code' => 'REG_OB', 'ob_type_name' => 'OB File', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
            ['ob_type_code' => 'LT_OB', 'ob_type_name' => 'Late Filing OB', 'created_by' => 'Admin', 'created_date' => now(), 'updated_by' => 'Admin', 'updated_date' => now()],
        ];
        DB::table('hris_mf_ob_type')->insert($table);
    }
}
