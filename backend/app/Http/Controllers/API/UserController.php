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
use Validator;
use App\Http\Resources\User as UserResource;
use Illuminate\Database\Eloquent\Builder;

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

        $users = User::with('info.package')
                ->when(@$input['search'], function($query) use ($input) {
                    $query->where("name", "LIKE", "%".$input['search']."%");
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
                ->orderBy('created_at', 'desc')
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
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users,email,'.$id.',id',
            'user_type_id' => 'required|exists:user_types,code',
            'package_id.value' => 'required_if:user_type_id,3|exists:packages,id',
            'customer_id' => 'required_if:user_type_id,3|unique:user_infos,customer_id,'.$id.',user_id'
        ]);

        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $input = $request->all();
        $input['package_id'] = $input['package_id']['value'];
        $name = $input['firstname'] . ' ' . (@$input['middlename'] ? $input['middlename'] : '') . ' ' . $input['lastname'];

        $user = User::with('info.package')->find($id);
        $user->firstname = $input['firstname'];
        $user->middlename = @$input['middlename'];
        $user->lastname = $input['lastname'];
        $user->email = $input['email'];
        $user->user_type_id = $input['user_type_id'];
        $user->name = $name;
        $user->save();

        if($input['user_type_id'] == 3) {
            $info = $user->info()->first();

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
}
