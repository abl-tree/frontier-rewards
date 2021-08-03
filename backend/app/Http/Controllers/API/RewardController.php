<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Reward;
use Validator;
use App\Http\Resources\Reward as RewardResource;
use App\Events\RewardCreated;

class RewardController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();

        if(@$input['search']) {
            $rewards = Reward::search($input['search'])
                    ->when((isset($input['show']) && $input['show'] == 'eligible'), function($query) use ($request) {
                        $query->where('type', '!=', 'points');
                        $query->where('cost', '<=', $request->user()->points);
                    })
                    ->paginate(10);

        } else {
            $rewards = Reward::latest()
                    ->when((isset($input['show']) && $input['show'] == 'eligible'), function($query) use ($request) {
                        $query->where('type', '!=', 'points');
                        $query->where('cost', '<=', $request->user()->points);
                    })
                    ->paginate(10);
        }
    
        return $this->sendResponse($rewards, 'Rewards retrieved successfully.');
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
            'type' => 'required|in:item,discount,points',
            'cost' => 'exclude_if:type,points|required_if:type,item,discount|numeric|min:1',
            'value' => 'required|numeric|min:1',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $reward = Reward::create($input);

        event(new RewardCreated($reward));
   
        return $this->sendResponse(new RewardResource($reward), 'Reward created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $reward = Reward::find($id);
  
        if (is_null($reward)) {
            return $this->sendError('Reward not found.');
        }
   
        return $this->sendResponse(new RewardResource($reward), 'Reward retrieved successfully.');
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
    public function update(Request $request, Reward $reward)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'type' => 'required|in:item,discount,points',
            'cost' => 'exclude_if:type,points|required_if:type,item,discount|numeric|min:1',
            'value' => 'required|numeric|min:1',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $reward->name = $input['name'];
        $reward->description = $input['description'];
        $reward->type = $input['type'];
        $reward->value = $input['value'];
        $reward->cost = @$input['cost'];
        $reward->save();
   
        return $this->sendResponse(new RewardResource($reward), 'Reward updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reward $reward)
    {
        $reward->delete();
   
        return $this->sendResponse($reward, 'Reward deleted successfully.');
    }
}
