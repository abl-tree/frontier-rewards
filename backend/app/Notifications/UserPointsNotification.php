<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class UserPointsNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
                ->subject('Received rewards')
                ->markdown('mail.user.points', ['data' => $this->transaction]);
    }

    public function toTwilio($notifiable)
    {
        $data = $this->transaction;

        if(count($data->item->rewards)) {
            $items = "Item/s:\n\n";

            foreach ($data->item->rewards as $key => $reward) {
                $items .= ($key+1).". ".$reward->reward_name."\n";
            }
        }

        return (new TwilioSmsMessage())
            ->content("Congratulations!\n\nYou have received a total point/s of $data->cost".(count($data->item->rewards) ? ' and '.count($data->item->rewards).' item/s' : '').". Your total points balance is now $data->balance. Collect more points to win awesome prizes!\n\n".@$items);
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
            'title' => 'Points update',
            'data' => $this->transaction
        ];
    }
}
