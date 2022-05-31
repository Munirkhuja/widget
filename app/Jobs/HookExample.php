<?php

namespace App\Jobs;

use App\Models\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class HookExample implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $hook = json_decode(json_encode(request()->input()), true);

        if (!isset($hook['account']['subdomain']) && $hook['account']['subdomain']) {
            // обработка ошибки: subdomain не указан
            return;
        }

        $client = Client::currentBySubdomain($hook['account']['subdomain']);
        if (!$client) {
            // обработка ошибки: Клиент не найден
            return;
        }

        // клиент найден, дальше обрабатываем хук:

    }
}
