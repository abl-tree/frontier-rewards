@component('mail::message')

Sorry, we cannot process your request. The item you requested is currently out of stock. We have returned your {{$transaction->cost}} point/s to your account. Your balance is {{$user->points}}. Transaction ID {{$transaction->transaction_id}}.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
