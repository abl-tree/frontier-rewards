<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Reward extends Model
{
    use HasFactory, SearchableTrait;

    protected $searchable = [
        'columns' => [
            'rewards.name'  => 10,
            'rewards.description'  => 10,
        ]
    ];
    
    protected $fillable = [
        'name', 'description', 'type', 'value', 'cost'
    ];

    public function getValueAttribute($value)
    {
        return is_null($value) ? 0 : $value;
    }

    public function setCostAttribute($value)
    {
        $value = ($this->attributes['type'] != 'points') ? $value : 0;
        $this->attributes['cost'] = $value;
    }

    public function getCostAttribute($value)
    {
        return is_null($value) ? 0 : $value;
    }
}
