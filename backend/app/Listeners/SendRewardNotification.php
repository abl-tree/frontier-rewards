<?php

namespace App\Listeners;

use App\Events\RewardCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RewardCreatedNotification;
use App\Models\User;

class SendRewardNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  RewardCreated  $event
     * @return void
     */
    public function handle(RewardCreated $event)
    {
        $recipient = User::whereHas('type', function($query) {
            $query->where('code', 3);
        })->get();

        Notification::send($recipient, new RewardCreatedNotification($event->reward));
    }
}
