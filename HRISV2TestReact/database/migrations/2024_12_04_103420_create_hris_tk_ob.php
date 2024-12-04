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
        Schema::create('hris_tk_ob', function (Blueprint $table) {
            $table->id('ob_id');
            $table->integer('ob_status_id');
            $table->string('ob_no');
            $table->string('mf_status_name'); 
            $table->integer('ob_type_id');
            $table->string('ob_type_name');
            $table->bigInteger('emp_no');
            $table->string('destination');
            $table->date('date_from');
            $table->time('time_from', 2);
            $table->date('date_to');
            $table->time('time_to', 2);
            $table->integer('ob_days');
            $table->string('person_to_meet');
            $table->text('ob_purpose');
            $table->text('ob_attach')->nullable();
            $table->text('appr_remarks')->nullable();
            $table->string('first_apprv_no');
            $table->string('sec_apprv_no')->nullable();
            $table->string('approved_by')->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('created_by');
            $table->dateTime('created_date')->useCurrent();
            $table->string('updated_by')->nullable();
            $table->dateTime('updated_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hris_tk_ob');
    }
};
