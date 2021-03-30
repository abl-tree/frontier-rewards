<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CampaignActionReward extends JsonResource
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
            'campaign_id' => $this->campaign_id,
            'action_id' => $this->action_id,
            'reward_id' => $this->reward_id,
        ];
    }
}
