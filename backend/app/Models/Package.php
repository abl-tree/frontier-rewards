<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name', 'description', 'multiplier'
    ];

    public function rewards() {
        return $this->hasMany(PackageReward::class, 'package_id');
    }
}
