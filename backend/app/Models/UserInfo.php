<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'userid', 
        'first_name',
        'middle_name',
        'last_name',
        'address',
        'vehicle_year',
        'vehicle_make',
        'vehicle_model',
        'vehicle_trim',
        'vehicle_color',
        'vehicle_vin_no',
        'salesperson_id'
    ];
}
