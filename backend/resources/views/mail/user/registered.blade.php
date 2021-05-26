@component('mail::message')
# Welcome!

Your password is {{$password}}.

You can now earn and collect points from your purchase and get a chance to win awesome rewards! Be updated with our new deals and win these awesome prizes! Visit {{ config('app.url') }} for more info.

Thanks,<br>
{{ config('app.name') }}
@endcomponent