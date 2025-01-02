<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveTypeModel extends Model
{
    protected $table = 'hris_mf_leave_type';
    protected $primaryKey = 'leave_type_id';

    protected $fillable = [
        'leave_type_code',
        'leave_type_name',
        'leave_type_desc',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date'
    ];
}
