<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hris_mf_ob_type', function (Blueprint $table) {
            $table->id('ob_type_id');
            $table->string('ob_type_code');
            $table->string('ob_type_name');
            $table->text('ob_type_desc')->nullable();
            $table->string('created_by');
            $table->timestamp('created_date')->useCurrent();
            $table->string('updated_by');
            $table->timestamp('updated_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hris_mf_ob_type');
    }
};
