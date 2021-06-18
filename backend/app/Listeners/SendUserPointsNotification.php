<?php

namespace App\Listeners;

use App\Events\UserPointsUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\UserPointsNotification;
use Illuminate\Support\Facades\Notification;
use App\Models\User;

class SendUserPointsNotification
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
     * @param  UserPointsUpdated  $event
     * @return void
     */
    public function handle(UserPointsUpdated $event)
    {
        $recipient = User::find($event->transaction->user_id);

        Notification::send($recipient, new UserPointsNotification($event->transaction));
    }
}
