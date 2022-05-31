<?php

namespace App\Http\Controllers;

use App\Jobs\HookExample;


class HookController extends Controller
{
    public function example()
    {
        // запустится после ответа
        HookExample::dispatchAfterResponse();

        // тут можно что то делать до ответа:

    }
}
