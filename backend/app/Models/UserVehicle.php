<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVehicle extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id', 
        'vehicle_id',
        'vehicle_info',
    ];
    
    public function setVehicleInfoAttribute( $val )
    {
        $this->attributes['vehicle_info'] = json_encode( $val );
    }
    
    public function getVehicleInfoAttribute( $val )
    {
        return json_decode( $val );
    }
}
