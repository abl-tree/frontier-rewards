@component('mail::message')
# Congratulations!

Your reward with transaction ID {{$transaction->transaction_id}} has been claimed. Continue using {{ config('app.name') }} Products/Services to enjoy {{ config('app.name') }}. Ref. No. {{$transaction->reference_no}}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
