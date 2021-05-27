<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use App\Events\UserRegistered;
use App\Listeners\SendUserNotification;
use App\Events\RewardCreated;
use App\Listeners\SendRewardNotification;
use App\Events\TransactionStatusUpdated;
use App\Listeners\SendTransactionUpdatesNotification;
use App\Events\UserPointsUpdated;
use App\Listeners\SendUserPointsNotification;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Models\Transaction;
use App\Observers\TransactionObserver;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserRegistered::class => [
            SendUserNotification::class,
        ],
        RewardCreated::class => [
            SendRewardNotification::class,
        ],
        TransactionStatusUpdated::class => [
            SendTransactionUpdatesNotification::class,
        ],
        UserPointsUpdated::class => [
            SendUserPointsNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        
        Transaction::observe(TransactionObserver::class);
    }
}
