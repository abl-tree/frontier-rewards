<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

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
    ];

    public function getEndDateAttribute($value) {
        return Carbon::parse($value)->format('Y-m-d');
    }

    public function campaigns()
    {
        return $this->hasMany(CampaignActionReward::class, 'campaign_id', 'id');
    }
}
