<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class UserRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $password;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
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
                    ->subject('User registration')
                    ->markdown('mail.user.registered', ['password' => $this->password]);
    }

    public function toTwilio($notifiable)
    {
        return (new TwilioSmsMessage())
            ->content("Welcome!\n\nYour password is {$this->password}.\n\nYou can now earn and collect points from your purchase and get a chance to win awesome rewards! Be updated with our new deals and win these awesome prizes! Visit ".config('app.url')." for more info.");
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
            'title' => 'Points and Perks Registration.',
            'data' => $this->user,
        ];
    }
}
