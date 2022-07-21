{{--{{ $client->subdomain }}<br>--}}
{{--@foreach ($leads as $lead)--}}
{{--    <div>{{ $lead->name }}</div>--}}
{{--@endforeach--}}
+++++++++
<?php
print(json_encode('{
            "method":"SendOrder",
            "params":{
                "title":"\u0417\u0430\u043a\u0430\u0437 \u21164649 \u0441 \u0441\u0430\u0439\u0442\u0430 \"blanco-rus.ru\"",
                "customer":{
                    "name":"\u041b\u0430\u0440\u0438\u0441\u0430 \u0417\u043e\u0440\u0438\u043d\u0430",
                    "phone":"89631911654",
                    "email":""
                },
                "goods":[
                    {
                        "id":"53447581",
                        "title":"\u041c\u043e\u0439\u043a\u0430 Blanco Dalago 5, 518528 \u043b\u0438\u043a\u0432\u0438\u0434\u0430\u0446\u0438\u044f",
                        "cost_per_unit":29694,
                        "qty":1
                    }
                ],
                "order_total":29694,
                "discount_price":0,
                "extra":[],
                "nethouse_id":"957313"
            }
        }'))
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>

    $.ajax({
        'xhrFields': {
            'withCredentials': true
        },
        "url": "https://api7.salesup.pro/nethouse/api",
        'data': JSON.stringify({
            "method":"SendOrder",
            "params":{
                "title":"\u0417\u0430\u043a\u0430\u0437 \u21164649 \u0441 \u0441\u0430\u0439\u0442\u0430 \"blanco-rus.ru\"",
                "customer":{
                    "name":"\u041b\u0430\u0440\u0438\u0441\u0430 \u0417\u043e\u0440\u0438\u043d\u0430",
                    "phone":"89631911654",
                    "email":""
                },
                "goods":[
                    {
                        "id":"53447581",
                        "title":"\u041c\u043e\u0439\u043a\u0430 Blanco Dalago 5, 518528 \u043b\u0438\u043a\u0432\u0438\u0434\u0430\u0446\u0438\u044f",
                        "cost_per_unit":29694,
                        "qty":1
                    }
                ],
                "order_total":29694,
                "discount_price":0,
                "extra":[],
                "nethouse_id":"957313"
            }
        }),
        'type': 'POST',
        'contentType': 'application/json',
        'crossDomain': true,
        'headers':{
            'Access-Control-Allow-Origin': '*',
            'Token':'T4qpGSHXgpzTBXzKfS3rFMB9RPFnRnhCYkBur74dCm8Hp2UBQb4KNXGCLcTtm8rjnZFkZpcAvY8VnJEvdQXJnAN35b5cDutH2SEUrT4qDF9VWLK5DAtSAQBnDbWMTAdz'
        }
    }).done(function (d) {
        console.log(d);
    });

</script>
