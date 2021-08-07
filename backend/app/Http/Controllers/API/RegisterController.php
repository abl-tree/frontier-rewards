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
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistration;
use App\Events\UserRegistered;
use App\Http\Resources\User as UserResource;
use Illuminate\Validation\Rule;
   
class RegisterController extends BaseController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'user_type_id' => 'required|in:3,2|exists:user_types,code',
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'package_id.value' => 'required_if:user_type_id,3|exists:packages,id',
            'customer_id' => 'required_if:user_type_id,3|unique:user_infos',
            'vehicles' => 'required|array|min:1',
            'vehicles.*' => 'required_if:user_type_id,3',
            'vehicles.*.vehicle_id' => 'required_if:user_type_id,3|distinct|unique:user_vehicles,vehicle_id',
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
        $input['package_id'] = @$input['package_id'] ? $input['package_id']['value'] : null;

        $name = $input['firstname'] . ' ' . (@$input['middlename'] ? $input['middlename'] : '') . ' ' . $input['lastname'];
        $input['name'] = $name;
        $tmpPass = $this->generateRandomString();
        $input['password'] = $tmpPass;

        $user = User::create($input);
        $success['token'] =  $user->createToken('MyApp')->accessToken;
        $success['name'] =  $user->name;

        if($input['user_type_id'] == 3) {
            $info = UserInfo::create([
                'user_id' => $user->id,
                'package_id' => $input['package_id'],
                'customer_id' => $input['customer_id'],
                'salesperson_id' => $request->user()->id
            ]);
            
            foreach ($input['vehicles'] as $key => $vehicle) {
                $vehicleInfo = UserVehicle::updateOrCreate(
                    ['user_id' => $user->id, 'vehicle_id' => $vehicle['vehicle_id']],
                    ['vehicle_info' => $vehicle]
                );
            }

            $package = Package::find($input['package_id']);
            $rewards = $package->rewards()->with('reward')->get();

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
                        'reward_qty' => ($reward->type != 'points' || $reward->type != 'discount' ? 1 : $reward->value),
                        'multiplier' => 1
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

        event(new UserRegistered($user, $tmpPass));
   
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