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
        Schema::create('hris_mf_status', function (Blueprint $table) {
            $table->id('mf_status_id');
            $table->string('mf_status_code');
            $table->string('mf_status_name');
            $table->text('mf_status_description')->nullable();
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
        Schema::dropIfExists('hris_mf_status');
    }
};
