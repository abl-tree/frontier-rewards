<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;
use App\Models\CampaignActionReward;
use App\Models\UserReward;
use App\Models\Reward;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\Transaction as TransactionResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $input = $request->all();
        $validation = [];

        if(isset($input['type'])) {
            $validation = array_merge($validation, [
                'type' => 'required|in:all,redeems,rewards'
            ]);
        }

        if(isset($input['start_date']) || isset($input['end_date'])) {  
            $validation = array_merge($validation, [
                'start_date' => 'required|date|date_format:Y-m-d',
                'end_date' => 'required|date|date_format:Y-m-d|after_or_equal:start_date'
            ]);
        }

        if(!empty($validation)) {
            $validator = Validator::make($input, $validation);
       
            if($validator->fails()){
                return $this->sendError('Validation Error.', $validator->errors());       
            }
        }
        
        $transactions = Transaction::with('salesperson', 'customer', 'item.rewards')
                        ->when((isset($input['type']) && $input['type'] != 'all'), function($query) use ($input) {
                            $type = $input['type'] == 'redeems' ? 'earn' : 'claim';
                            $query->where('type', $type);
                        })
                        ->when(isset($input['transaction_id']), function($query) use ($input) {
                            $query->where('transaction_id', 'LIKE', '%' . $input['transaction_id'] . '%');
                        })
                        ->when(isset($input['reference_no']), function($query) use ($input) {
                            $query->where('reference_no', 'LIKE', '%' . $input['reference_no'] . '%');
                        })
                        ->when(isset($input['customer']), function($query) use ($input) {
                            $query->whereHas('customer', function(Builder $query) use ($input) {
                                $query->where('name', 'LIKE', '%' . $input['customer'] . '%');
                            });
                        })
                        ->when(isset($input['salesperson']), function($query) use ($input) {
                            $query->whereHas('salesperson', function(Builder $query) use ($input) {
                                $query->where('name', 'LIKE', '%' . $input['salesperson'] . '%');
                            });
                        })
                        ->when(isset($input['start_date']) && isset($input['end_date']), function($query) use ($input) {
                            $query->where('created_at', '>=', $input['start_date']);
                            $query->where('created_at', '<=', $input['end_date'] . ' 23:59:59');
                        })
                        ->when(!isset($input['start_date']) && !isset($input['end_date']), function($query) use ($input) {
                            $query->whereDate('created_at', Carbon::today());
                        })
                        ->when($request->user()->type->code == 3, function($query) use ($request) {
                            $query->where('user_id', $request->user()->id);
                        })
                        ->orderBy('created_at', 'desc')
                        ->paginate(10)->withQueryString();
    
        return $this->sendResponse($transactions, 'Transactions retrieved successfully.');
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
            'type' => 'required|in:earn',
            'action_id' => 'required',
            'campaign_id' => 'required',
            'rewards' => 'required|array|min:1',
            'rewards.*.value' => 'required|numeric|exists:rewards,id',
            'user_id' => 'required|numeric|exists:users,id'
        ]);
        
        $validator->after(function ($validator) use ($input) {
            if (@$input['rewards'] && @$input['campaign_id'] && @$input['action_id']) {
                $reward_ids = array_column($input['rewards'], 'value');
                $rewards = Reward::whereIn('id', $reward_ids)->get();

                foreach ($rewards as $key => $reward) {
                    if(!CampaignActionReward::where('campaign_id', $input['campaign_id'])->where('action_id', $input['action_id'])->where('reward_id', $reward->id)->where('quantity', '>', 0)->count()) {
                        $validator->errors()->add(
                            'rewards', "{$reward->name} is not available."
                        );
                    }
                }
            }
        });
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $item = TransactionItem::create([
            'action_id' => $input['action_id'],
            'action_name' => $input['action_name'],
            'campaign_id' => $input['campaign_id'],
            'campaign_name' => $input['campaign_name'],
            'total' => 0
        ]);

        if($item) {
            $reward_ids = array_column($input['rewards'], 'value');
            $rewards = Reward::whereIn('id', $reward_ids)->get();

            foreach ($rewards as $key => $reward) {
                $tmpReward = UserReward::create([
                    'user_id' => $input['user_id'],
                    'transaction_item_id' => $item->id,
                    'reward_id' => $reward->id,
                    'reward_name' => $reward->name,
                    'reward_type' => $reward->type,
                    'reward_qty' => ($reward->type === 'item' || $reward->type === 'discount' ? 1 : $reward->value)
                ]);

                if($tmpReward->reward_type == 'points') $item->increment('total', $tmpReward->reward_qty);

                CampaignActionReward::where('campaign_id', $input['campaign_id'])->where('action_id', $input['action_id'])->where('reward_id', $reward->id)->where('quantity', '>', 0)->first()->decrement('quantity');
            }
       
            $transaction = Transaction::create([
                'type' => $input['type'],
                'cost' => $item->total,
                'user_id' => $input['user_id'],
                'transaction_item_id' => $item->id
            ]);
        }
   
        return $this->sendResponse($transaction, 'Package created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    public function update(Request $request, Transaction $transaction)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'status' => 'required|in:pending,cancelled,completed,confirmed',
            'reference_no' => 'required_if:status,confirmed'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        if($input['status'] == 'confirmed' && $input['reference_no']) $transaction->reference_no = $input['reference_no'];
        $transaction->status = $input['status'];
        $transaction->status_updated_by = $request->user()->id;
        $transaction->save();
   
        return $this->sendResponse(new TransactionResource($transaction), 'Transaction updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    
    public function redeem(Request $request) {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'reward_id' => 'required|numeric|exists:rewards,id'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }

        $reward = Reward::find($input['reward_id']);

        $total = $reward->cost;
        
        if($request->user()->points < $total) return $this->sendError('Points is insufficient.');   

        $item = TransactionItem::create([
            'action_name' => 'Redeem',
            'total' => $total,
        ]);

        $user = $request->user();

        if($item) {
            UserReward::create([
                'user_id' => $user->id,
                'transaction_item_id' => $item->id,
                'reward_id' => $reward->id,
                'reward_name' => $reward->name,
                'reward_type' => $reward->type,
                'reward_qty' => $reward->value,
                'status' => 'completed'
            ]);
       
            $transaction = Transaction::create([
                'type' => 'claim',
                'cost' => $total,
                'transaction_item_id' => $item->id
            ]);
        }
   
        return $this->sendResponse($transaction, 'Transaction created successfully.');
    }

    public function claim(Request $request) {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'reward_id' => 'required|numeric|exists:user_rewards,id',
            'qty' => 'required|numeric|gt:0'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }

        $reward = UserReward::with('transaction_item.transaction')->find($input['reward_id']);

        if($reward->status == 'completed') {
            return $this->sendError('Reward already claimed.');
        }

        if($reward->transaction_item->transaction->status != 'completed') {
            return $this->sendError('Reward cannot be claimed. Please contact the admins.');
        }

        $total = 0;

        $item = TransactionItem::create([
            'action_name' => 'Redeem',
            'reward_id' => $input['reward_id'],
            'total' => $total,
        ]);
       
        $transaction = Transaction::create([
            'type' => 'claim',
            'cost' => $total,
            'transaction_item_id' => $item->id
        ]);

        $total_claimed = $reward->qty + $input['qty'];

        if($total_claimed >= $reward->reward_qty) $reward->status = 'completed';
        $reward->claimed_qty = $total_claimed;
        $reward->save();
   
        return $this->sendResponse(['transaction' => $transaction, 'reward' => $reward], 'Transaction created successfully.');
    }

    public function summary(Request $request) {
        $user = $request->user();
        $transactions = DB::table('transactions')
                    ->selectRaw('count(*) as total')
                    ->selectRaw("count(case when status = 'confirmed' then 1 end) as confirmed")
                    ->selectRaw("count(case when status = 'pending' then 1 end) as pending")
                    ->selectRaw("count(case when status = 'cancelled' then 1 end) as cancelled")
                    ->selectRaw("count(case when status = 'completed' then 1 end) as completed")
                    ->when($user->type->code == 3, function($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->first();
   
        return $this->sendResponse($transactions, 'Transaction created successfully.');
    }
}
