<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Package extends Model
{
    use HasFactory, SearchableTrait;

    protected $searchable = [
        'columns' => [
            'packages.name'  => 10,
            'packages.description'  => 10,
        ]
    ];
    
    protected $fillable = [
        'name', 'description', 'multiplier'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function rewards() {
        return $this->hasMany(PackageReward::class, 'package_id');
    }
}
