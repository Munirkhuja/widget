<?php

namespace App\Http\Middleware;

use App\Models\Amo;
use App\Models\Client;
use Closure;
use Firebase\JWT\JWT;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;


class CheckAmoAuthTokenApi
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
        $xAuthToken = $request->header('X-Auth-Token');
        $account_id = $request->get('account_id');
        $client_uuid = $request->get('client_uuid');

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: *');

        if (!$xAuthToken) {
            $xAuthToken = JWT::encode([
                'account_id' => $account_id,
                'client_uuid' => config('amo.client_id')
            ], config('amo.client_secret'), 'HS256');
        }

        if (!$account_id || !$client_uuid) {
            response()->json('Invalid arguments.', 400)->send();
            exit;
        }

        $httpClient = new \GuzzleHttp\Client();
        $method = 'token';

        try {
            $response = $httpClient->request(
                'GET',
                'https://integrations.salesup.pro/api/' . $method,
                [
                    'verify' => false,
                    'headers' => [
                        'X-Auth-Token' => $xAuthToken
                    ],
                    'query' => [
                        'account_id' => $account_id,
                        'client_uuid' => $client_uuid
                    ]
                ]
            );
        } catch (GuzzleException $exception) {
            response()->json('Core request failed.', 500)->send();
            exit;
        }

        if ($response->getStatusCode() !== 200) {
            response()->json('Core request failed.', 500)->send();
            exit;
        }

        $core_response = json_decode($response->getBody()->getContents(), true);

        if (isset($core_response['subdomain']) && isset($core_response['access_token'])) {
            Client::setCurrentBySubdomain($core_response['subdomain']);

            Amo::$access_token = $core_response['access_token'];
            Amo::$subdomain = $core_response['subdomain'];
        } else {
            $message = $core_response['message'];

            if (strpos($message, 'Payment expired') !== false) {
                // обработка ошибки: истек срок лицензии интеграции у клиента
            } else {
                // обработка остальных ошибок ответа ядра
            }

            return false;
        }

        return $next($request);
    }
}
