<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UTController;

Route::get('/', function () {
    return Inertia('login');
});


//Login
Route::get('/login', [UserController::class, 'loginForm'])->name('login');
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
Route::post('/UT_Module/ut_dashboard/edit/{id}', [UserController::class, 'update'])->name('update.user');
Route::get('/register', [UserController::class, 'create']);
Route::post('/register', [UserController::class, 'store']);

Route::get('/UT_Module/ut_dashboard', [UserController::class, 'DisplayUTDashboard']);

Route::post('/UT_Module/ut_dashboard/setApprove/{id}', [UserController::class, 'setApprover'])->name('set.approve');
Route::get('/UT_Module/ut_entry/', [UTController::class, 'index']);
Route::get('/UT_Module/ut_entry/{id}', [UTController::class, 'viewUTRequest']);
Route::post('/UT_Module/ut_entry/', [UTController::class, 'UTEntry']);
