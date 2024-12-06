<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UTModel extends Model
{
    protected $table = 'hris_tk_ut';
    protected $fillable = [
        'ut_status_id',
        'ut_no',
        'mf_status_name',
        'emp_no',
        'emp_fullname',
        'ut_date',
        'ut_time',
        'ut_reason',
        'first_apprv_no',
        'first_apprv_name',
        'sec_apprv_no',
        'sec_apprv_name',
        'approved_by',
        'approved_date',
        'remarks',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date'
    ];

    // Disable Laravel's default timestamp handling
    public $timestamps = false;

    // Define custom date formats for timestamp columns
    protected $dates = [
        'ut_date',
        'ut_time',
        'approved_date',
        'created_date',
        'updated_date'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'emp_no', 'emp_no');
    }
    
    public function status()
    {
        return $this->belongsTo(MFStatusModel::class, 'ut_status_id', 'mf_status_id');
    }
}
