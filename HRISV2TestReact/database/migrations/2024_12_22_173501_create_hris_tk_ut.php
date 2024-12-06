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
        Schema::create('hris_tk_ut', function (Blueprint $table) {
            $table->id(); // auto-incrementing primary key
            $table->unsignedBigInteger('ut_status_id');
            $table->string('ut_no');
            $table->bigInteger('emp_no')->nullable();
            $table->date('ut_date');
            $table->time('ut_time', 2);
            $table->text('ut_reason');
            $table->bigInteger('first_apprv_no');
            $table->bigInteger('sec_apprv_no')->nullable();
            $table->bigInteger('approved_by')->nullable();
            $table->timestamp('approved_date')->nullable();
            $table->text('remarks')->nullable();
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
        Schema::dropIfExists('hris_tk_ut');
    }
};
