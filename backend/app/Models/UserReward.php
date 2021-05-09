<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class UserReward extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'transaction_item_id',
        'reward_id',
        'reward_name',
        'reward_type',
        'reward_qty',
        'claimed_qty',
        'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $user = User::with('info.package')->find($model->user_id);
            $isSignupReward = false;

            if(!$isSignupReward && $model->reward_type == 'points') {
                $multiplier = $user->info->package->multiplier;
                $model->reward_qty = $model->reward_qty * $multiplier;
            }

            if($model->status == 'completed') {
                $model->claimed_qty = $model->reward_qty;
            } else {
                $model->claimed_qty = ($model->reward_type == 'points' ? $model->reward_qty : 0);
                $model->status = ($model->reward_type == 'points' ? 'completed' : 'incomplete');
            }
        });
    }

    public function transaction_item() {
        return $this->hasOne(TransactionItem::class, 'id', 'transaction_item_id');
    }
}
