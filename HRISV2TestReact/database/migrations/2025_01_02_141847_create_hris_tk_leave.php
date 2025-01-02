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
        Schema::create('hris_tk_leave', function (Blueprint $table) {
            $table->id('leave_id');
            $table->unsignedBigInteger('leave_status_id');
            $table->string('leave_no');
            $table->unsignedBigInteger('leave_type_id');
            $table->bigInteger('emp_no');
            $table->date('date_from');
            $table->date('date_to');
            $table->string('halfday', 3)->nullable();
            $table->integer('leave_days')->nullable();
            $table->text('reason');
            $table->text('leave_attach')->nullable();
            $table->text('appr_remarks')->nullable();
            $table->bigInteger('first_apprv_no');
            $table->bigInteger('sec_apprv_no')->nullable();
            $table->bigInteger('approved_by')->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('created_by');
            $table->dateTime('created_date')->useCurrent();
            $table->string('updated_by')->nullable();
            $table->dateTime('updated_date')->nullable();
            $table->string('is_late')->nullable();


            $table->foreign('emp_no')->references('emp_no')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('first_apprv_no')->references('emp_no')->on('users');
            $table->foreign('sec_apprv_no')->references('emp_no')->on('users');

            $table->foreign('leave_type_id')->references('leave_type_id')->on('hris_mf_leave_type')->onDelete('cascade')->onUpdate(('cascade'));
            $table->foreign('leave_status_id')->references('mf_status_id')->on('hris_mf_status')->onDelete('cascade')->onUpdate(('cascade'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hris_tk_leave');
    }
};
