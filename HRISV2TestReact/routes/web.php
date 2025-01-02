<?php

use App\Http\Controllers\OBController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OTController;
use App\Http\Controllers\UTController;
use App\Http\Controllers\LeaveController;
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
Route::post('/UT_Module/ut_entry/edit', [UTController::class, 'editUTRequest']);
Route::post('/UT_Module/ut_entry/{id}', [UTController::class, 'spoilUTRequest']);
Route::delete('/UT_Module/ut_entry/{id}', [UTController::class, 'deleteUTRequest'])->name('delete.ut');
Route::post('/UT_Module/ut_entry/', [UTController::class, 'UTEntry']);
//UT APPR
Route::post('/UT_Module/ut_appr_list/edit', [UTController::class, 'editUTApprRequest']);
Route::get('/UT_Module/ut_appr_list', [UTController::class, 'UTApprList'])->middleware('auth')->name('apprlist.show');
Route::post('/UT_Module/ut_appr_list/edit/{id}', [UTController::class, 'updateUTRequest']);
Route::post('/UT_Module/ut_appr_list', [UTController::class, 'updateAll'])->name('update.all');
Route::post('/UT_Module/ut_appr_list/batch', [UTController::class, 'updateBatch'])->name('update.batch');
//UT Reports
Route::get('/UT_Module/ut_reports_list', [UTController::class, 'UTReportsList'])->middleware('auth')->name('utreports.show');
Route::post('/UT_Module/ut_reports_list', [UTController::class, 'uploadUTReport']);

//OB
Route::get('/OB_Module/ob_entry/', [OBController::class, 'index'])->middleware('auth');
Route::post('/OB_Module/ob_entry/', [OBController::class, 'OBEntry']);
Route::post('/OB_Module/ob_entry/edit', [OBController::class, 'editOBRequest']);
/* Route::post('/OB_Module/ob_entry/edit', [OBController::class, 'editOBRequest']); */
Route::post('/OB_Module/ob_entry/{id}', [OBController::class, 'spoilOBRequest']);
Route::delete('/OB_Module/ob_entry/{id}', [OBController::class, 'deleteOBRequest'])->name('delete.ob');
//OB APPR
Route::get('/OB_Module/ob_appr_list', [OBController::class, 'OBApprList'])->middleware('auth')->name('obapprlist.show');
Route::post('/OB_Module/ob_appr_list', [OBController::class, 'updateAll'])->name('obupdate.all');
Route::post('/OB_Module/ob_appr_list/batch', [OBController::class, 'updateBatch'])->name('update.obbatch');
Route::post('/OB_Module/ob_appr_list/edit', [OBController::class, 'editOBApprRequest']);
Route::post('/OB_Module/ob_appr_list/edit/{id}', [OBController::class, 'updateOBRequest']);
//OB Reports
Route::get('/OB_Module/ob_reports_list', [OBController::class, 'OBReportsList'])->middleware('auth')->name('obreports.show');
Route::post('/OB_Module/ob_reports_list', [OBController::class, 'uploadOBReport']);

//OT
Route::get('/OT_Module/ot_entry/', [OTController::class, 'index'])->middleware('auth');
Route::post('/OT_Module/ot_entry/', [OTController::class, 'OTEntry']);
Route::post('/OT_Module/ot_entry/edit', [OTController::class, 'editOTRequest']);
Route::post('/OT_Module/ot_entry/{id}', [OTController::class, 'spoilOTRequest']);
Route::delete('/OT_Module/ot_entry/{id}', [OTController::class, 'deleteOTRequest'])->name('delete.ot');
//OT APPR
Route::get('/OT_Module/ot_appr_list', [OTController::class, 'OTApprList'])->middleware('auth')->name('otapprlist.show');
Route::post('/OT_Module/ot_appr_list', [OTController::class, 'updateAll'])->name('otupdate.all');
Route::post('/OT_Module/ot_appr_list/batch', [OTController::class, 'updateBatch'])->name('update.otbatch');
Route::post('/OT_Module/ot_appr_list/edit', [OTController::class, 'editOTApprRequest']);
//OT Reports
Route::get('/OT_Module/ot_reports_list', [OTController::class, 'OTReportsList'])->middleware('auth')->name('otreports.show');

//Leave
Route::get('/Leave_Module/leave_entry/', [LeaveController::class, 'index'])->middleware('auth');
Route::post('/Leave_Module/leave_entry/', [LeaveController::class, 'LeaveEntry']);
