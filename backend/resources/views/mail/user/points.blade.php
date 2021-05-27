@component('mail::message')
# Congratulations!

You have received a total point/s of {{$data->cost}}{{count($data->item->rewards) ? ' and '.count($data->item->rewards).' item/s' : ''}}. Your total points balance is now {{$data->balance}}. Collect more points to win awesome prizes! 

@if(count($data->item->rewards))
Item/s:
@foreach ($data->item->rewards as $key=>$reward)
{{$key+1}}. {{$reward->reward_name}}
@endforeach
@endif

Visit {{ config('app.url') }} for more info.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
