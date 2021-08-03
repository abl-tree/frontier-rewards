<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Nicolaslopezj\Searchable\SearchableTrait;

class Action extends Model
{
    use HasFactory, SearchableTrait;

    protected $searchable = [
        'columns' => [
            'actions.name'  => 10,
            'actions.description'  => 10,
        ]
    ];

    protected $fillable = [
        'name', 'description'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function rewards() {
        return $this->hasMany(CampaignActionReward::class);
    }
}
