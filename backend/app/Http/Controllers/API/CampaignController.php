<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Campaign;
use App\Models\CampaignActionReward;
use Validator;
use App\Http\Resources\Campaign as CampaignResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CampaignController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();

        if(@$input['search'])  {

            $campaigns = Campaign::search($input['search'])->when($request->user()->type->code == 3, function($query) {
                $query->whereDate('end_date', '>=', Carbon::now());
            })->when(@$input['activity'] == true, function($query) {
                $query->whereDate('end_date', '>=', Carbon::now());
            })->paginate(10)->withQueryString();

        } else {

            $campaigns = Campaign::when($request->user()->type->code == 3, function($query) {
                $query->whereDate('end_date', '>=', Carbon::now());
            })->when(@$input['activity'] == true, function($query) {
                $query->whereDate('end_date', '>=', Carbon::now());
            })->latest()->paginate(10);
            
        }
    
        return $this->sendResponse($campaigns, 'Campaigns retrieved successfully.');
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
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required',
            'end_date' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $campaign = Campaign::create($input);
   
        return $this->sendResponse(new CampaignResource($campaign), 'Campaign created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $campaign = Campaign::find($id);
        $campaign->setRelation('campaigns', $campaign->campaigns()->with('reward', 'action')->paginate(10));
  
        if (is_null($campaign)) {
            return $this->sendError('Campaign not found.');
        }
   
        return $this->sendResponse(new CampaignResource($campaign), 'Campaign retrieved successfully.');
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
    public function update(Request $request, Campaign $campaign)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required',
            'end_date' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $campaign->name = $input['name'];
        $campaign->description = $input['description'];
        $campaign->start_date = $input['start_date'];
        $campaign->end_date = $input['end_date'];
        $campaign->save();
   
        return $this->sendResponse(new CampaignResource($campaign), 'Campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Campaign $campaign)
    {
        $campaign->campaigns()->delete();
        $campaign->delete();
   
        return $this->sendResponse($campaign, 'Campaign deleted successfully.');
    }

    public function actions($id) {
        $campaigns = Campaign::find($id)->campaigns()->with('action')->groupBy('action_id')->paginate(10);
   
        return $this->sendResponse($campaigns, 'Actions retrieved successfully.');
    }

    public function rewards($campaign_id, $action_id) {
        $rewards = CampaignActionReward::with('reward')->where(['campaign_id' => $campaign_id, 'action_id' => $action_id])->paginate(10);
   
        return $this->sendResponse($rewards, 'Rewards retrieved successfully.');
    }

    public function active_campaigns(Request $request) {
        $user = $request->user();
        $transactions = DB::table('campaigns')
                    ->selectRaw('count(*) as total')
                    ->where('end_date', '>=', Carbon::now())
                    ->first();
   
        return $this->sendResponse($transactions, 'Total active campaigns retrieved successfully.');
    }
}
