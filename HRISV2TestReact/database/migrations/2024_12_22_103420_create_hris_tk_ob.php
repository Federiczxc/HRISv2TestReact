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
            $table->unsignedBigInteger('ob_status_id');
            $table->string('ob_no');
            $table->unsignedBigInteger('ob_type_id');
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
            $table->bigInteger('first_apprv_no');
            $table->bigInteger('sec_apprv_no')->nullable();
            $table->bigInteger('approved_by')->nullable();
            $table->dateTime('approved_date')->nullable();
            $table->string('created_by');
            $table->dateTime('created_date')->useCurrent();
            $table->string('updated_by')->nullable();
            $table->dateTime('updated_date')->nullable();


            $table->foreign('emp_no')->references('emp_no')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('first_apprv_no')->references('emp_no')->on('users');
            $table->foreign('sec_apprv_no')->references('emp_no')->on('users');

            $table->foreign('ob_type_id')->references('ob_type_id')->on('hris_mf_ob_type')->onDelete('cascade')->onUpdate(('cascade'));
            $table->foreign('ob_status_id')->references('mf_status_id')->on('hris_mf_status')->onDelete('cascade')->onUpdate(('cascade'));
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
