<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Amo;
use App\Models\Client;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index(Request $request) {
        // текущий клиент
        $client = Client::current();

        // пример запроса всех сделок
        $leads = Amo::getLeads([]);

        return view('index', [
            'client' => $client,
            'leads' => $leads
        ]);
    }
}
