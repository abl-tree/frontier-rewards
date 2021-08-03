<?php

namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\CampaignActionReward;
use Validator;
use App\Http\Resources\CampaignActionReward as CampaignARResource;

class CampaignActionRewardController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $campaign_infos = CampaignActionReward::with('reward', 'action')->paginate(10);
    
        return $this->sendResponse($campaign_infos, 'Campaigns retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'campaign_id' => 'required',
            'action_id' => 'required',
            'reward_id' => 'required',
            'quantity' => 'required|numeric'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $campaign_info = CampaignActionReward::with('action', 'reward')->create($input);

        return $this->sendResponse(new CampaignARResource($campaign_info), 'Campaign created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $campaign_info = CampaignActionReward::find($id);
  
        if (is_null($campaign_info)) {
            return $this->sendError('Campaign not found.');
        }
   
        return $this->sendResponse(new CampaignARResource($campaign_info), 'Campaign retrieved successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'campaign_id' => 'required',
            'action_id' => 'required',
            'reward_id' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $campaign_info = CampaignActionReward::find($id);
        $campaign_info->campaign_id = $input['campaign_id'];
        $campaign_info->action_id = $input['action_id'];
        $campaign_info->reward_id = $input['reward_id'];
        $campaign_info->save();
   
        return $this->sendResponse(new CampaignARResource($campaign_info), 'Campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $campaign_info = CampaignActionReward::find($id);
        $campaign_info->delete();
   
        return $this->sendResponse($campaign_info, 'Campaign deleted successfully.');
    }
}
