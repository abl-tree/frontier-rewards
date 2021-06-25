@component('mail::message')

Your redemption with Transaction ID {{$transaction->transaction_id}} has been confirmed. Please contact {{ config('app.name') }} Admin and use your Reference No. to claim your reward. Ref. No. {{$transaction->reference_no}}.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
