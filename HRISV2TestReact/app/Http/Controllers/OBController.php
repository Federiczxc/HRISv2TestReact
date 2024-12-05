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
    public function index()
    {
        $currentUser = Auth::user()->emp_no;
        $obList = OBModel::where('emp_no', $currentUser)->get();
        return Inertia::render('OB_Module/ob_entry', [
            'OBList' => $obList
        ]);
    }

    public function OBEntry(Request $request)
    {
        $request->validate([
            'destination' => 'required',
            'date_from' => 'required',
            'time_from' => 'required',
            'date_to' => 'required',
            'time_to' => 'required',
            'person_to_meet' => 'required',
            'ob_purpose' => 'required'
        ]);
        $user = Auth::user();
        $lastOBEntry = OBModel::orderBy('ob_no', 'desc')->first();
        $newOBNo = 'OB-' . sprintf('%09d', optional($lastOBEntry)->ob_no ? ((int) str_replace('OB-', '', $lastOBEntry->ob_no) + 1) : 1);
        if ($request->hasFile('ob_attach')){
            $file = $request->file('ob_attach');
            $filename = time(). '-' . $file->getClientOriginalName();
            $path = $file->storeAs('ob_attachments', $filename, 'public');
        }

        $obEntry = OBModel::create([
            'ob_status_id' => 1,
            'ob_no' => $newOBNo,
            'mf_status_name' => 'Pending',
            'ob_type_id' => 1,
            'ob_type_name' => 'Normal',
            'emp_no' => $user->emp_no,
            'destination' => $request->destination,
            'date_from' => $request->date_from,
            'time_from' => $request->time_from,
            'date_to' => $request->date_to,
            'time_to' => $request->time_to,
            'ob_days' => 5,
            'person_to_meet' => $request->person_to_meet,
            'ob_purpose' =>  $request->ob_purpose,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'ob_attach' =>$path,
        ]);
     
        return back()->with('success', 'Official Business Entry created successfully.');
    }
}
