<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveModel extends Model
{
    protected $table = 'hris_tk_leave';
    protected $primaryKey = 'leave_id';
    protected $fillable = [
        'leave_status_id',
        'leave_no',
        'leave_type_id',
        'emp_no',
        'date_from',
        'date_to',
        'halfday',
        'leave_days',
        'reason',
        'leave_attach',
        'appr_remarks',
        'first_apprv_no',
        'sec_apprv_no',
        'approved_by',
        'approved_date',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
        'is_late',
    ];
    public $timestamps = false;
    protected $dates = [
        'date_from',
        'date_to',
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
        return $this->belongsTo(MFStatusModel::class, 'leave_status_id', 'mf_status_id');
    }

    public function leavetype()
    {
        return $this->belongsTo(LeaveTypeModel::class, 'leave_type_id', 'leave_type_id');

    }
}
