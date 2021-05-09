<?php

namespace App\Listeners;

use App\Events\TransactionStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TransactionStatusUpdated as TransactionStatusUpdatedNotification;

class SendTransactionUpdatesNotification
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
     * @param  TransactionStatusUpdated  $event
     * @return void
     */
    public function handle(TransactionStatusUpdated $event)
    {
        $recipient = User::find($event->transaction->user_id);

        Notification::send($recipient, new TransactionStatusUpdatedNotification($event->transaction));
    }
}
