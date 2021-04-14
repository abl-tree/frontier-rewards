<?php
   
namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistration;
use App\Events\RewardCreated;
   
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
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users'
            // 'password' => 'required',
            // 'c_password' => 'required|same:password',
        ]);

        broadcast(new RewardCreated(auth()->user()))->toOthers();

        Mail::to('info@fr-api.thedreamteamdigitalmarketing.com')->cc('frontier_rewards@thedreamteamdigitalmarketing.com')->send(new UserRegistration($request->all()));
        Mail::to('allenlamparas@gmail.com')->cc('frontier_rewards@thedreamteamdigitalmarketing.com')->send(new UserRegistration($request->all()));

        return;
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $input = $request->all();
        $name = $input['first_name'] . ' ' . $input['middle_name'] . ' ' . $input['last_name'];
        $input['name'] = $name;
        $input['password'] = bcrypt($this->generateRandomString());

        $user = User::create($input);
        $success['token'] =  $user->createToken('MyApp')->accessToken;
        $success['name'] =  $user->name;
   
        return $this->sendResponse($input, 'User register successfully.');
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
            $success['name'] =  $user->name;
   
            return $this->sendResponse($success, 'User login successfully.');
        } 
        else{ 
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        } 
    }
}