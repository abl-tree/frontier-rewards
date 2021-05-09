<?php

namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Package;
use App\Models\PackageReward;
use Validator;
use App\Http\Resources\Package as PackageResource;

class PackageController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();

        if(@$input['search']) $packages = Package::with('rewards.reward')->whereRaw("MATCH(`name`) AGAINST(? IN BOOLEAN MODE)", array($input['search']))->paginate(10)->withQueryString();
        else $packages = Package::with('rewards.reward')->paginate(10)->withQueryString();
        
        return $this->sendResponse($packages, 'Packages retrieved successfully.');
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
            'multiplier' => 'required|numeric',
            'rewards.*.value' => 'numeric|exists:rewards,id'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $package = Package::create($input);

        foreach ($input['rewards'] as $key => $reward) {
            $package->rewards()->create([
                'reward_id' => $reward['value']
            ]);
        }

        $package = Package::with('rewards.reward')->find($package->id);
   
        return $this->sendResponse(new PackageResource($package), 'Package created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $package = Package::find($id);
  
        if (is_null($package)) {
            return $this->sendError('Package not found.');
        }
   
        return $this->sendResponse(new PackageResource($package), 'Package retrieved successfully.');
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
    public function update(Request $request, Package $package)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'multiplier' => 'required|numeric',
            'rewards.*.value' => 'numeric|exists:rewards,id'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $package->name = $input['name'];
        $package->description = $input['description'];
        $package->multiplier = $input['multiplier'];
        $package->save();

        foreach ($input['rewards'] as $key => $reward) {
            $package->rewards()->firstOrCreate(['reward_id' => $reward['value']]);
        }

        $package->rewards()->whereNotIn('reward_id', array_column($input['rewards'], 'value'))->delete();

        $package = Package::with('rewards.reward')->find($package->id);
   
        return $this->sendResponse(new PackageResource($package), 'Package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Package $package)
    {
        $package->rewards()->delete();
        $package->delete();
   
        return $this->sendResponse($package, 'Package deleted successfully.');
    }
}
