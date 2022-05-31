<?php

namespace App\Http\Middleware;

use App\Models\Amo;
use App\Models\Client;
use Closure;
use Illuminate\Http\Request;

class CheckAmoAuthToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->input('token');

        if (!$token) {
            // обрабатываем ошибку, если токен не найден
        } else {
            $client = Client::setCurrent($token);
            if (!Amo::init() && Amo::$isPaymentExpired) {
                // обрабатываем ошибку если истек срок лицензии интеграции у клиента
            }

            if (!$client) {
                // обрабатываем ошибку если клиент по токену не найден
            }
        }

        return $next($request);
    }
}
