<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'action_id',
        'action_name',
        'campaign_id',
        'campaign_name',
        'reward_id',
        'total'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            
        });
    }

    public function rewards() {
        return $this->hasMany(UserReward::class, 'transaction_item_id', 'id');
    }

    public function transaction() {
        return $this->hasOne(Transaction::class, 'transaction_item_id', 'id');
    }
}
