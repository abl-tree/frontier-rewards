@component('mail::message')
# GOOD NEWS!

Are you ready to win {{$data->name}}? Earn at least Required points to get this awesome reward! Visit {{ config('app.url') }} for more info.

Note: This reward is only eligible for  Eligibility requirements for the reward users.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
