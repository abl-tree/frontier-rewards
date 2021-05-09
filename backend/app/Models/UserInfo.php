<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserInfo extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'user_id', 
        'package_id',
        'customer_id',
        'customer_infos',
        'salesperson_id'
    ];

    public function package() {
        return $this->hasOne(Package::class, 'id', 'package_id');
    }
}
