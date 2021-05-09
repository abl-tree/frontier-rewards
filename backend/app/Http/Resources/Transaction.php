<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource ;

class Transaction extends JsonResource 
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
            'type' => $this->type,
            'transaction_id' => $this->transaction_id,
            'reference_no' => $this->reference_no,
            'balance' => $this->balance,
            'cost' => $this->cost,
            'user_id' => $this->user_id,
            'salesperson_id' => $this->salesperson_id,
            'status' => $this->status,
            'status_updated_by' => $this->status_updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
