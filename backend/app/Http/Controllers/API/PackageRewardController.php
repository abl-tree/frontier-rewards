<?php

namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\PackageReward;
use Validator;
use App\Http\Resources\PackageReward as PackageRewardResource;

class PackageRewardController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $packages = PackageReward::all();
    
        return $this->sendResponse(PackageRewardResource::collection($packages), 'Packages retrieved successfully.');
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
            'package_id' => 'required|exists:packages,id',
            'reward_id' => 'required|exists:rewards,id'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $package = PackageReward::create($input);
   
        return $this->sendResponse(new PackageRewardResource($package), 'Package created successfully.');
    } 
   
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $package = PackageReward::find($id);
  
        if (is_null($package)) {
            return $this->sendError('Package not found.');
        }
   
        return $this->sendResponse(new PackageRewardResource($package), 'Package retrieved successfully.');
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PackageReward $package)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'package_id' => 'required|exists:packages,id',
            'reward_id' => 'required|exists:rewards,id'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $package->package_id = $input['package_id'];
        $package->reward_id = $input['reward_id'];
        $package->save();
   
        return $this->sendResponse(new PackageRewardResource($package), 'Package updated successfully.');
    }
   
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $package = PackageReward::find($id);
        $package->delete();
   
        return $this->sendResponse([], 'Package deleted successfully.');
    }
}
