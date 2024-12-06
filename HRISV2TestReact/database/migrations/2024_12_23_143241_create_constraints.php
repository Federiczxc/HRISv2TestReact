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
        Schema::table('hris_tk_ob', function (Blueprint $table) {
            $table->foreign('emp_no')
                ->references('emp_no')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('first_apprv_no')
                ->references('emp_no')->on('users');

            $table->foreign('sec_apprv_no')
                ->references('emp_no')->on('users');

            $table->foreign('ob_type_id')
                ->references('ob_type_id')->on('hris_mf_ob_type')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('ob_status_id')
                ->references('mf_status_id')->on('hris_mf_status')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        Schema::table('hris_tk_ut', function (Blueprint $table) {
            $table->foreign('emp_no')
                ->references('emp_no')->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('first_apprv_no')
                ->references('emp_no')->on('users');

            $table->foreign('sec_apprv_no')
                ->references('emp_no')->on('users');

            $table->foreign('ut_status_id')
                ->references('mf_status_id')->on('hris_mf_status')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constraints');
    }
};
