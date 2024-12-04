<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use App\Models\OBModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\CssSelector\Node\SelectorNode;
use Inertia\Inertia;


class OBController extends Controller
{
    public function index(){
        $currentUser = Auth::user()->emp_no;
        $obList = OBModel::where('emp_no', $currentUser)->get();
        return Inertia::render('OB_Module/ob_entry', [
            'OBList' => $obList
        ]);
    }


}
