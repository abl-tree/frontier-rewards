<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CampaignActionReward extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'campaign_id', 'action_id', 'reward_id', 'quantity', 'deleted_at'
    ];

    protected $dates = ['deleted_at'];

    public function reward()
    {
        return $this->hasOne(Reward::class, 'id', 'reward_id');
    }

    public function action()
    {
        return $this->hasOne(Action::class, 'id', 'action_id');
    }
}
