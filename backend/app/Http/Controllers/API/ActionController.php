<?php

namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Action;
use Validator;
use App\Http\Resources\Action as ActionResource;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ActionController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();

        if(@$input['search']) $actions = Action::search($input['search'])->paginate(10)->withQueryString();
        else $actions = Action::latest()->paginate(10)->withQueryString();
    
        return $this->sendResponse($actions, 'Actions retrieved successfully.');
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
            'description' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $action = Action::create($input);
   
        return $this->sendResponse(new ActionResource($action), 'Action created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $action = Action::with('rewards')->find($id);
  
        if (is_null($action)) {
            return $this->sendError('Action not found.');
        }
   
        return $this->sendResponse(new ActionResource($action), 'Action retrieved successfully.');
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
    public function update(Request $request, Action $action)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $action->name = $input['name'];
        $action->description = $input['description'];
        $action->save();
   
        return $this->sendResponse(new ActionResource($action), 'Action updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Action $action)
    {
        $action->delete();
   
        return $this->sendResponse($action, 'Action deleted successfully.');
    }

    public function active_actions(Request $request) {
        $user = $request->user();
        $transactions = DB::table('campaign_action_rewards')
                    ->selectRaw('count(DISTINCT(campaign_action_rewards.action_id)) as total')
                    ->join('campaigns', 'campaign_action_rewards.campaign_id', '=', 'campaigns.id')
                    ->where('campaigns.end_date', '>=', Carbon::now())
                    ->first();
   
        return $this->sendResponse($transactions, 'Total active actions retrieved successfully.');
    }
}
