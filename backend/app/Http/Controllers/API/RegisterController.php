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
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistration;
use App\Events\RewardCreated;
use App\Events\UserRegistered;
use App\Http\Resources\User as UserResource;
   
class RegisterController extends BaseController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'user_type_id' => 'required|exists:user_types,code',
            'package_id.value' => 'required_if:user_type_id,3|exists:packages,id',
            'customer_id' => 'required_if:user_type_id,3|unique:user_infos'
        ]);

        // broadcast(new RewardCreated(auth()->user()))->toOthers();
        // event(broadcast(new RewardCreated(auth()->user()))->toOthers());
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $input = $request->all();
        $input['package_id'] = @$input['package_id'] ? $input['package_id']['value'] : null;

        $name = $input['firstname'] . ' ' . (@$input['middlename'] ? $input['middlename'] : '') . ' ' . $input['lastname'];
        $input['name'] = $name;
        $tmpPass = $this->generateRandomString();
        $input['password'] = bcrypt($tmpPass);

        $user = User::create($input);
        $success['token'] =  $user->createToken('MyApp')->accessToken;
        $success['name'] =  $user->name;

        // event(new UserRegistered($user));

        if($input['user_type_id'] == 3) {
            $info = UserInfo::create([
                'user_id' => $user->id,
                'package_id' => $input['package_id'],
                'customer_id' => $input['customer_id'],
                'salesperson_id' => $request->user()->id
            ]);

            $rewards = Package::find($input['package_id'])->rewards()->with('reward')->get();

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

        $user = User::with('info.package')->find($user->id);
        $user->tmpPass = $tmpPass;

        event(new UserRegistered($user));
   
        return $this->sendResponse(new UserResource($user), 'User register successfully.');
    }
   
    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){ 
            $user = Auth::user(); 
            $success['token'] =  $user->createToken('MyApp')-> accessToken; 
            $success['id'] =  $user->id;
            $success['name'] =  $user->name;
            $success['type'] =  @$user->type->code;
   
            return $this->sendResponse($success, 'User login successfully.');
        } 
        else{ 
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        } 
    }

    public function logout(Request $request) {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }
    
}