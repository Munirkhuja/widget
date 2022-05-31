<?php

use App\Http\Controllers\AmoAuthController;
use App\Http\Controllers\HookController;
use App\Http\Controllers\LeadPipelinneColumnController;
use App\Http\Middleware\CheckAmoAuthTokenApi;
use Fruitcake\Cors\HandleCors;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// установка интеграции
Route::any('amo-auth', [AmoAuthController::class, 'index'])->name('amo.auth');

Route::get('get-pipeline-column/{account_id}/{pipeline_id}', [LeadPipelinneColumnController::class, 'index'])->name('pipeline.column.get');
Route::post('set-pipeline-column', [LeadPipelinneColumnController::class, 'set'])->name('pipeline.column.set');

// запрос токена виджетом для дальнейшей работы
Route::any('get-token', [AmoAuthController::class, 'getToken'])->name('amo.token');

// пример обработчика хука:
Route::any('hook-example', [HookController::class, 'example'])->name('hook.example');


Route::middleware([CheckAmoAuthTokenApi::class, HandleCors::class])->group(function() {
    // все апи запросы сюда:

});
