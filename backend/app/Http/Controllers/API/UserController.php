<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use App\Models\UserInfo;
use App\Models\Package;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\UserReward;
use App\Models\UserVehicle;
use Validator;
use App\Http\Resources\User as UserResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();

        $users = User::with('info.package', 'vehicles')
                ->when(@$input['search'], function($query) use ($input) {
                    $query->search($input['search']);
                })
                ->when((isset($input['type']) && $input['type'] != 'all'), function($query) use ($input) {
                    $query->where('user_type_id', $input['type']);
                })
                ->when((isset($input['email'])), function($query) use ($input) {
                    $query->where("email", "LIKE", "%".$input['email']."%");
                })
                ->when(isset($input['customer_id']), function($query) use ($input) {
                    $query->whereHas('info', function(Builder $query) use ($input) {
                        $query->where('customer_id', 'LIKE', '%' . $input['customer_id'] . '%');
                    });
                })
                ->when(!isset($input['search']), function($query) use ($input) {
                    $query->latest();
                })
                ->paginate(10)
                ->withQueryString();
    
        return $this->sendResponse($users, 'Users retrieved successfully.');
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with('info.package')->find($id);
  
        if (is_null($user)) {
            return $this->sendError('User not found.');
        }
   
        return $this->sendResponse(new UserResource($user), 'User retrieved successfully.');
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
        $validator = Validator::make($request->all(), [
            'user_type_id' => 'required|in:3,2|exists:user_types,code',
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users,email,'.$id.',id',
            'user_type_id' => 'required|exists:user_types,code',
            'package_id.value' => 'required_if:user_type_id,3|exists:packages,id',
            'customer_id' => 'required_if:user_type_id,3|unique:user_infos,customer_id,'.$id.',user_id',
            'vehicles' => 'required|array|min:1',
            'vehicles.*' => 'required_if:user_type_id,3',
            'vehicles.*.vehicle_id' => 'required_if:user_type_id,3|distinct|unique:user_vehicles,vehicle_id,'.$id.',user_id',
            'vehicles.*.year' => 'required_if:user_type_id,3',
            'vehicles.*.make' => 'required_if:user_type_id,3',
            'vehicles.*.model' => 'required_if:user_type_id,3',
            'vehicles.*.trim' => 'required_if:user_type_id,3',
            'vehicles.*.color' => 'required_if:user_type_id,3',
            'vehicles.*.vin_no' => 'required_if:user_type_id,3',
        ], [
            'customer_id.required_if' => 'The customer id field is required when user type is Customer.',
            'package_id.value.required_if' => 'The package field is required when user type is Customer.',
            'vehicles.*.vehicle_id.required_if' => 'The vehicle ID field is required.',
            'vehicles.*.vehicle_id.distinct' => 'The vehicle ID field has a duplicate value.',
            'vehicles.*.vehicle_id.unique' => 'The vehicle ID field is already assigned to other customer.',
            'vehicles.*.year.required_if' => 'The vehicle year field is required.',
            'vehicles.*.make.required_if' => 'The vehicle make field is required.',
            'vehicles.*.model.required_if' => 'The vehicle model field is required.',
            'vehicles.*.trim.required_if' => 'The vehicle trim field is required.',
            'vehicles.*.color.required_if' => 'The vehicle color field is required.',
            'vehicles.*.vin_no.required_if' => 'The vehicle vin no field is required.',
        ]);

        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $input = $request->all();

        $input['package_id'] = $input['package_id']['value'];
        $name = $input['firstname'] . ' ' . (@$input['middlename'] ? $input['middlename'] : '') . ' ' . $input['lastname'];

        $input['points'] = !isset($input['points']) ? 0 : $input['points'];

        $user = User::with('info.package', 'vehicles')->find($id);
        $user->firstname = $input['firstname'];
        $user->middlename = @$input['middlename'];
        $user->lastname = $input['lastname'];
        $user->email = $input['email'];
        if(@$input['phone_number']) $user->phone_number = $input['phone_number'];
        $user->user_type_id = $input['user_type_id'];
        $user->name = $name;
        $user->save();

        $prev_points = $user->points;

        if($prev_points != $input['points']) {
            if($prev_points > $input['points']) {
                $total = $prev_points - $input['points'];

                $item = TransactionItem::create([
                    'action_name' => 'Manual Deduct Points',
                    'total' => $total
                ]);

                $transaction = Transaction::create([
                    'type' => 'earn',
                    'cost' => -$total,
                    'user_id' => $user->id,
                    'transaction_item_id' => $item->id
                ]);

                $user->points = $transaction->balance;
            } else {
                $total = $input['points'] - $prev_points;

                $item = TransactionItem::create([
                    'action_name' => 'Manual Add Points',
                    'total' => $total
                ]);

                $transaction = Transaction::create([
                    'type' => 'earn',
                    'cost' => $total,
                    'user_id' => $user->id,
                    'transaction_item_id' => $item->id
                ]);

                $user->points = $transaction->balance;
            }
        }

        if($input['user_type_id'] == 3) {
            $info = $user->info()->first();

            //Delete vehicles
            $existingVehiclesId = [];
            foreach ($input['vehicles'] as $key => $vehicle) {
                if(isset($vehicle['id'])) {
                    array_push($existingVehiclesId, $vehicle['id']);
                }
            }
            if(!empty($existingVehiclesId)) {
                UserVehicle::where('user_id', $user->id)->whereNotIn('id', $existingVehiclesId)->delete();
            } else {
                UserVehicle::where('user_id', $user->id)->delete();
            }

            foreach ($input['vehicles'] as $key => $vehicle) {
                if(isset($vehicle['id'])) {
                    $vehicleInfo = UserVehicle::find($vehicle['id']);
                    $vehicleInfo->vehicle_id = $vehicle['vehicle_id'];
                    $vehicleInfo->vehicle_info = $vehicle;
                    $vehicleInfo->save();
                } else {
                    $vehicleInfo = new UserVehicle;
                    $vehicleInfo->user_id = $user->id;
                    $vehicleInfo->vehicle_id = $vehicle['vehicle_id'];
                    $vehicleInfo->vehicle_info = $vehicle;
                    $vehicleInfo->save();
                }
            }

            if($info->package_id != $input['package_id']) {    
                $transaction = $user->transactions()->whereHas('item', function(Builder $query) {
                    $query->where('action_name', 'Registration');
                    $query->where('type', 'earn');
                })->where('status', '!=', 'cancelled')->latest()->first();
    
                if($transaction) {
                    $transaction->status = 'cancelled';
                    $transaction->save();
                }

                $package = Package::with('rewards.reward')->find($input['package_id']);
                $rewards = $package->rewards;
    
                $total = 0;
    
                foreach ($rewards as $key => $value) {
                    $reward = $value->reward;
                    if($reward->type == 'points') {
                        $total += $reward->value;
                    }
                }

                $item = TransactionItem::create([
                    'action_name' => 'Registration',
                    'total' => $total,
                ]);

                if($item) {
                    foreach ($rewards as $key => $value) {
                        $reward = $value->reward;
                        UserReward::create([
                            'user_id' => $user->id,
                            'transaction_item_id' => $item->id,
                            'reward_id' => $reward->id,
                            'reward_name' => $reward->name,
                            'reward_type' => $reward->type,
                            'reward_qty' => $reward->value
                        ]);
                    }
            
                    $transaction = Transaction::create([
                        'type' => 'earn',
                        'cost' => $total,
                        'user_id' => $user->id,
                        'transaction_item_id' => $item->id
                    ]);
                }
            }

            if($info->package_id != $input['package_id']) $info->package_id = $input['package_id'];
            if($info->customer_id != $input['customer_id']) $info->customer_id = $input['customer_id'];
            $info->salesperson_id = $request->user()->id;

            $info->save();
        }

        $user = User::with('info.package', 'vehicles')->find($id);

        return $this->sendResponse(new UserResource($user), 'User retrieved successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        $user->info()->delete();
   
        return $this->sendResponse(new UserResource($user), 'User retrieved successfully.');
    }

    public function rewards($id) {
        $user = User::find($id);
        $user->setRelation('rewards', $user->rewards()
                            ->where('reward_type', '!=', 'points')
                            ->where('status', '!=', 'completed')
                            ->whereHas('transaction_item', function($query) {
                                $query->whereHas('transaction', function($query) {
                                    $query->where('status', '!=', 'cancelled');
                                });
                            })
                            ->orderByDesc('created_at')->paginate(10));

        return $this->sendResponse(new UserResource($user), 'User rewards retrieved successfully.');
    }

    public function profile(Request $request) {
        $user = User::with('info.package')->find($request->user()->id);

        return $this->sendResponse(new UserResource($user), 'User profile retrieved successfully.');
    }
    
    public function showByQR($qrCode)
    {
        $user = User::with('info.package')->whereHas('info', function($q) use ($qrCode) {
            $q->where('customer_id', $qrCode);
        })->first();
  
        if (is_null($user)) {
            return $this->sendError('User not found.');
        }
   
        return $this->sendResponse(new UserResource($user), 'User retrieved successfully.');
    }

    public function settings(Request $request)
    {
        $userid = $request->user()->id;
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users,email,'.$userid.',id',
            'password' => 'required|password:api',
            'new_password' => 'nullable|min:8|confirmed'
        ]);

        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }

        $input = $request->all();

        $user = User::find($userid);
        $user->firstname = $input['firstname'];
        $user->middlename = @$input['middlename'];
        $user->lastname = $input['lastname'];
        $user->email = $input['email'];
        if(isset($input['new_password'])) $user->password = $input['new_password'];
        $user->phone_number = $input['phone_number'];
        $user->save();
   
        return $this->sendResponse(new UserResource($user), 'Settings updated successfully.');
    }

    public function total_customers(Request $request) {
        $user = $request->user();
        $transactions = DB::table('users')
                    ->selectRaw("count(case when user_type_id = 3 then 1 end) as total")
                    ->first();
   
        return $this->sendResponse($transactions, 'Total number of customers retrieved successfully.');
    }

    public function export(Request $request) {
        return (new UsersExport)->download('users.xlsx');
    }

    public function check(Request $request) {
        return $this->sendResponse($request->user(), 'Authenticated.');
    }
}
