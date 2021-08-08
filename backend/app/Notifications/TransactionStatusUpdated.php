<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;
use App\Models\User;

class TransactionStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public $transaction;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast', 'database', 'mail', TwilioChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $transaction = $this->transaction;
        $status = $transaction->status;
        $user = User::find($transaction->user_id);

        return (new MailMessage)
                ->subject("Your order is $status")
                ->markdown("mail.transaction.$status", ['transaction' => $transaction, 'user' => $user]);
    }

    public function toTwilio($notifiable)
    {
        $transaction = $this->transaction;
        $status = $transaction->status;
        $user = User::find($transaction->user_id);
        $message = "";

        if($status == 'pending') {
            $message = "Your redemption is pending. Please wait for the confirmation.";
        } else if($status == 'cancelled') {
            $message = "Sorry, we cannot process your request. The item you requested is currently out of stock. We have returned your $transaction->cost point/s to your account. Your balance is ".($transaction->cost+$transaction->balance).". Transaction ID $transaction->transaction_id.";
        } else if($status == 'confirmed') {
            $message = "Your redemption with Transaction ID $transaction->transaction_id has been confirmed. Please contact ".config('app.name')." Admin and use your Reference No. to claim your reward. Ref. No. $transaction->reference_no.";
        } else if($status == 'completed') {
            $message = "Congratulations!\n\nYour reward with transaction ID $transaction->transaction_id has been claimed. Continue using ".config('app.name')." Products/Services to enjoy ".config('app.name').". Ref. No. $transaction->reference_no";
        }

        return (new TwilioSmsMessage())
            ->content($message);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'title' => 'Transaction update',
            'data' => $this->transaction
        ];
    }
}
