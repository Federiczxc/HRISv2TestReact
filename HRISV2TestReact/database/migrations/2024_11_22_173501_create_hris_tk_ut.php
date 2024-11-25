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
            $table->integer('ut_status_id');
            $table->string('ut_no');
            $table->string('mf_status_name'); 
            $table->bigInteger('emp_no')->nullable();
            /* $table->bigInteger('ent_id');  */
            $table->string('emp_fullname'); 
            $table->date('ut_date'); 
            $table->time('ut_time');
            $table->text('ut_reason')->nullable(); 
            $table->string('first_apprv_no'); 
            $table->string('first_apprv_name'); 
            $table->string('sec_apprv_no')->nullable(); 
            $table->string('sec_apprv_name')->nullable(); 
            $table->string('approved_by')->nullable(); 
            $table->timestamp('approved_date')->nullable(); 
            $table->text('remarks')->nullable(); 
            $table->string('created_by'); 
            $table->timestamp('created_date')->useCurrent(); 
            $table->string('updated_by')->nullable(); 
            $table->timestamp('updated_date')->nullable(); 

            // Foreign keys (if applicable)
          /*   $table->foreign('ut_status_id')->references('id')->on('hris_mf_table'); */
            $table->foreign('emp_no')->references('emp_no')->on('users')->onDelete('cascade');
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
