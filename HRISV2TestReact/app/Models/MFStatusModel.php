<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MFStatusModel extends Model
{
    protected $table = 'hris_mf_status';
    protected $primaryKey = 'mf_status_id';

    protected $fillable = [
        'mf_status_code',
        'mf_status_name',
        'mf_status_description',
        'remarks',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date'
    ];
}
