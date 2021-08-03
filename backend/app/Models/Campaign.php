<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;

class Campaign extends Model
{
    use HasFactory, SoftDeletes, SearchableTrait;

    protected $searchable = [
        'columns' => [
            'campaigns.name'  => 10,
            'campaigns.description'  => 10,
        ]
    ];

    protected $fillable = [
        'name', 'description', 'start_date', 'end_date'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    protected $appends = [
        'is_expired'
    ];

    public function getIsExpiredAttribute($value) {
        return Carbon::parse($this->end_date)->addDay()->lt(Carbon::now());
    }

    public function getEndDateAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function campaigns()
    {
        return $this->hasMany(CampaignActionReward::class, 'campaign_id', 'id');
    }
}
