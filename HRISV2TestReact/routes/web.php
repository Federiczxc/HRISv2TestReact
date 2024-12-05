<?php

use App\Http\Controllers\OBController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UTController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Auth::check()
        ? redirect('/UT_Module/ut_dashboard') // Redirect to dashboard if authenticated
        : redirect('/login'); // Redirect to login if not authenticated
});


//Login
Route::get('/login', [UserController::class, 'loginForm'])->name('login');
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->name('logout');
Route::post('/UT_Module/ut_dashboard/edit/{id}', [UserController::class, 'update'])->name('update.user');
Route::get('/register', [UserController::class, 'create']);
Route::post('/register', [UserController::class, 'store']);

//UT
Route::get('/UT_Module/ut_dashboard', [UserController::class, 'DisplayUTDashboard'])->middleware('auth');
Route::post('/UT_Module/ut_dashboard/setApprove/{id}', [UserController::class, 'setApprover'])->name('set.approve');
Route::get('/UT_Module/ut_entry/', [UTController::class, 'index'])->middleware('auth')->name('ut.entry');
Route::get('/UT_Module/ut_entry/{id}', [UTController::class, 'viewUTRequest'])->middleware('auth');
Route::delete('/UT_Module/ut_entry/{id}', [UTController::class, 'deleteUTRequest'])->name('delete.ut');
Route::post('/UT_Module/ut_entry/', [UTController::class, 'UTEntry']);
Route::post('/UT_Module/ut_entry/edit', [UTController::class, 'editUTRequest']);
Route::post('/UT_Module/ut_appr_list/edit', [UTController::class, 'editUTApprRequest']);
Route::get('/UT_Module/ut_appr_list', [UTController::class, 'UTApprList'])->middleware('auth')->name('apprlist.show');
Route::post('/UT_Module/ut_appr_list/edit/{id}', [UTController::class, 'updateUTRequest']);
Route::post('/UT_Module/ut_appr_list', [UTController::class, 'updateAll'])->name('update.all');
Route::get('/UT_Module/ut_reports_list', [UTController::class, 'UTReportsList'])->middleware('auth')->name('utreports.show');

//OB
Route::get('/OB_Module/ob_entry/', [OBController::class, 'index'])->middleware('auth');
Route::post('/OB_Module/ob_entry/', [OBController::class, 'OBEntry']);
