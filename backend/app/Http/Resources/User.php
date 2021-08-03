<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'lastname' => $this->lastname,
            'name' => $this->name,
            'email' => $this->email,
            'points' => (int) $this->points,
            'user_type_id' => $this->user_type_id,
            'info' => $this->info,
            'rewards' => $this->rewards,
            'phone_number' => $this->phone_number,
            'type_name' => $this->type_name,
            'vehicles' => $this->vehicles,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
