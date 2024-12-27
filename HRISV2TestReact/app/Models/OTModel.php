<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OTModel extends Model
{
    protected $table = 'hris_tk_ot';
    protected $primaryKey = 'ot_id';
    protected $fillable = [
        'ot_status_id',
        'ot_no',
        'ot_type_id',
        'emp_no',
        'date_from',
        'time_from',
        'date_to',
        'time_to',
        'task_title',
        'task_done',
        'appr_remarks',
        'first_apprv_no',
        'sec_apprv_no',
        'approved_by',
        'approved_date',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
    ];
    public $timestamps = false;
    protected $dates = [
        'date_from',
        'time_from',
        'date_to',
        'time_to',
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
        return $this->belongsTo(MFStatusModel::class, 'ot_status_id', 'mf_status_id');
    }
}
