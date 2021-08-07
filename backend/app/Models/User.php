<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, SearchableTrait;

    protected $searchable = [
        'columns' => [
            'users.name'  => 10,
            'users.firstname'  => 10,
            'users.middlename'  => 10,
            'users.lastname'  => 10,
        ]
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'firstname',
        'middlename',
        'lastname',
        'email',
        'password',
        'points',
        'phone_number',
        'user_type_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    protected $appends = [
        'type_name'
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = preg_replace('/\s+/', ' ', $value);
    }

    public function getNameAttribute($value) {
        return ucwords($value);
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function getTypeNameAttribute() {
        return $this->type['name'];
    }

    public function info() {
        return $this->hasOne(UserInfo::class);
    }

    public function type() {
        return $this->hasOne(UserType::class, 'id', 'user_type_id');
    }

    public function rewards() {
        return $this->hasMany(UserReward::class, 'user_id');
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'user_id', 'id');
    }

    public function vehicles() {
        return $this->hasMany(UserVehicle::class, 'user_id', 'id');
    }
}
