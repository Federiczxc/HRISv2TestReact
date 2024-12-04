<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OBModel extends Model
{
    protected $table = 'hris_tk_ob';
    protected $primaryKey = 'ob_id';
    protected $fillable = [
        'ob_status_id',
        'ob_no',
        'mf_status_name',
        'ob_type_id',
        'ob_type_name',
        'emp_no',
        'destination',
        'date_from',
        'time_from',
        'date_to',
        'time_to',
        'ob_days',
        'person_to_meet',
        'ob_purpose',
        'ob_attach',
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
}
