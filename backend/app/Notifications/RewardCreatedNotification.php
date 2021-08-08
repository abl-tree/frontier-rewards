<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\ExpoPushNotifications\ExpoChannel;
use NotificationChannels\ExpoPushNotifications\ExpoMessage;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class RewardCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $reward;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($reward)
    {
        $this->reward = $reward;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast', 'database', 'mail', ExpoChannel::class, TwilioChannel::class];
    }

    public function toExpoPush($notifiable)
    {
        return ExpoMessage::create()
            ->badge(1)
            ->enableSound()
            ->title("Congratulations!")
            ->body("Your {$notifiable->service} account was approved!");
    }

    public function toTwilio($notifiable)
    {
        return (new TwilioSmsMessage())
            ->content("GOOD NEWS!\n\nAre you ready to win ".$this->reward->name."? Earn at least Required points to get this awesome reward! Visit ".config('app.url')." for more info.\n\nNote: This reward is only eligible for  Eligibility requirements for the reward users.");
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
                ->subject('New reward created')
                ->markdown('mail.reward.created', ['data' => $this->reward]);
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
            'title' => 'New reward created',
            'data' => $this->reward
        ];
    }
}
