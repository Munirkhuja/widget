<?php

namespace App\Http\Controllers;

use App\Models\Amo;
use App\Models\Client;
use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;

class AmoAuthController extends Controller
{
    public function index(Request $request)
    {
        file_put_contents(storage_path('logs/request.json'), json_encode($request->input()) . PHP_EOL . PHP_EOL, FILE_APPEND);
        $data = $request->input();

        $httpClient = new HttpClient();

        try {
            $response = $httpClient->request(
                'GET',
                'https://integrations.salesup.pro/api/install', [
                    'verify' => false,
                    'query' => $data
                ]
            );
        } catch (GuzzleException $exception) {
            exit;
        }

        if ($response->getStatusCode() !== 200) {
            exit;
        }

        $core_response = json_decode($response->getBody()->getContents(), true);

        if (!isset($core_response['subdomain']) || !isset($core_response['access_token'])) {
            exit;
        }

        $client = Client::add($core_response['subdomain']);
        if ($client) {
            Amo::$access_token = $core_response['access_token'];
            Amo::$subdomain = $core_response['subdomain'];

            // сюда можно добавлять какие то первичные настройки амо, например добавление хуков
        }
    }
}
