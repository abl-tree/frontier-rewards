<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;
use App\Models\User;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'transaction_id',
        'transaction_item_id',
        'reference_no',
        'balance',
        'cost',
        'user_id',
        'salesperson_id',
        'status',
        'status_updated_by'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->transaction_id= uniqid();
            if($model->type == 'earn') {
                $user = User::find($model->user_id);
                $user->increment('points', $model->cost);
                $model->salesperson_id= Auth::id();
                $model->balance = $user->points;
                $model->status = 'completed';
            } else {
                $user = User::find(Auth::id());
                $user->decrement('points', $model->cost);
                $model->balance= $user->points;
                $model->user_id = $user->id;
            }
        });

        static::updated(function ($model) {
            if($model->type == 'earn') {
                if($model->status === 'cancelled') {
                    $user = User::find($model->user_id);
                    $user->decrement('points', $model->cost);
                    $model->salesperson_id= Auth::id();
                }
            } else {
                if($model->status === 'cancelled') {
                    $user = User::find($model->user_id);
                    $user->increment('points', $model->cost);
                }
            }
        });
    }

    public function setTransactionIdAttribute($value) {        
        $this->attributes['transaction_id'] = uniqid();
    }

    public function setSalespersonIdAttribute($value) {
        $this->attributes['salesperson_id'] = Auth::id();
    }

    public function item() {
        return $this->hasOne(TransactionItem::class, 'id', 'transaction_item_id');
    }

    public function salesperson() {
        return $this->hasOne(User::class, 'id', 'salesperson_id');
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'user_id', 'id');
    }

    public function customer() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
