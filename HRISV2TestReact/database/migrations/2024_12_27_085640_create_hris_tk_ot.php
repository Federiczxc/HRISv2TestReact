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
        Schema::create('hris_tk_ot', function (Blueprint $table) {
            $table->id('ot_id');
            $table->unsignedBigInteger('ot_status_id');
            $table->string('ot_no');
            $table->unsignedBigInteger('ot_type_id');
            $table->bigInteger('emp_no');
            $table->date('date_from');
            $table->time('time_from', 2);
            $table->date('date_to');
            $table->time('time_to', 2);
            $table->text('task_title');
            $table->text('task_done');
            $table->text('appr_remarks')->nullable();
            $table->bigInteger('first_apprv_no');
            $table->bigInteger('sec_apprv_no');
            $table->bigInteger('approved_by')->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('created_by');
            $table->dateTime('created_date')->useCurrent();
            $table->string('updated_by')->nullable();
            $table->dateTime('updated_date')->nullable();


            $table->foreign('emp_no')->references('emp_no')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('first_apprv_no')->references('emp_no')->on('users');
            $table->foreign('sec_apprv_no')->references('emp_no')->on('users');

            $table->foreign('ot_status_id')->references('mf_status_id')->on('hris_mf_status')->onDelete('cascade')->onUpdate(('cascade'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hris_tk_ot');
    }
};
