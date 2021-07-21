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
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\UserNotificationController;
use NotificationChannels\ExpoPushNotifications\Http\ExpoController;

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
    Route::post('exponent/devices/subscribe', [ExpoController::class, 'subscribe'])->name('register-interest');
    Route::post('exponent/devices/unsubscribe', [ExpoController::class, 'unsubscribe'])->name('remove-interest');

    Route::resource('products', ProductController::class);
    Route::resource('actions', ActionController::class);
    Route::resource('campaigns', CampaignController::class);
    Route::get('campaigns/{campaign_id}/actions', [CampaignController::class, 'actions']);
    Route::get('campaigns/{campaign_id}/actions/{action_id}', [CampaignController::class, 'rewards']);
    Route::resource('campaign_rewards', CampaignActionRewardController::class);
    Route::resource('packages', PackageController::class);
    Route::resource('package_rewards', PackageRewardController::class);
    Route::resource('rewards', RewardController::class);
    Route::resource('users', UserController::class);
    Route::post('users/check', [UserController::class, 'check']);
    Route::get('users/{userid}/rewards', [UserController::class, 'rewards']);
    Route::get('users/{qrCode}/qr', [UserController::class, 'showByQr']);
    Route::get('profile', [UserController::class, 'profile']);
    Route::post('settings', [UserController::class, 'settings']);
    Route::resource('notifications', UserNotificationController::class);
    Route::post('notifications/read', [UserNotificationController::class, 'mark_read']);
    Route::resource('transactions', TransactionController::class);
    Route::post('redeem', [TransactionController::class, 'redeem']);
    Route::post('claim', [TransactionController::class, 'claim']);
    Route::post('register', [RegisterController::class, 'register']);
    Route::post('logout', [RegisterController::class, 'logout']);
    Route::get('summary/transactions', [TransactionController::class, 'summary']);
    Route::get('summary/active_campaigns', [CampaignController::class, 'active_campaigns']);
    Route::get('summary/active_actions', [ActionController::class, 'active_actions']);
    Route::get('summary/total_customers', [UserController::class, 'total_customers']);
    Route::get('summary/total_packages', [PackageController::class, 'total_packages']);

    Route::prefix('export')->group(function () {
        Route::get('user', [UserController::class, 'export']);
    });
});

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
