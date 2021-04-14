<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\ActionController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\CampaignActionRewardController;
use App\Http\Controllers\API\PackageController;
use App\Http\Controllers\API\PackageRewardController;
use App\Http\Controllers\API\RewardController;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', [RegisterController::class, 'login']);
   
Route::middleware('auth:api')->group( function () {

    Route::resource('products', ProductController::class);
    Route::resource('actions', ActionController::class);
    Route::resource('campaigns', CampaignController::class);
    Route::resource('campaign_rewards', CampaignActionRewardController::class);
    Route::resource('packages', PackageController::class);
    Route::resource('package_rewards', PackageRewardController::class);
    Route::resource('rewards', RewardController::class);
    Route::resource('users', UserController::class);
    Route::post('register', [RegisterController::class, 'register']);
    
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
