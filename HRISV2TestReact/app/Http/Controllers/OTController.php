<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use App\Models\OTModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\CssSelector\Node\SelectorNode;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class OTController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user()->emp_no;
        $otList = OTModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->whereIn('ot_status_id', [1, 2, 3])
            ->get()
            ->map(function ($ot) {
                $approver = User::where('emp_no', $ot->approved_by)->first();
                $ot->approver_name = $approver ? $approver->name : null;
                return $ot;
            });
        $spoiledOTList = OTModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->where('ot_status_id', 4)
            ->get();
        return Inertia::render('OT_Module/ot_entry', [
            'OTList' => $otList,
            'spoiledOTList' => $spoiledOTList
        ]);
    }

    public function OTEntry(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date|before_or_equal:date_to',
            'time_from' => 'required',
            'date_to' => 'required|date|after_or_equal:date_from',
            'time_to' => 'required',
            'task_title' => 'required',
            'task_done' => 'required',
        ]);
        $user = Auth::user();
        $lastOTEntry = OTModel::orderBy('ot_no', 'desc')->first();
        $newOTNo = 'OT-' . sprintf('%09d', optional($lastOTEntry)->ot_no ? ((int) str_replace('OT-', '', $lastOTEntry->ot_no) + 1) : 1);

        OTModel::create([
            'ot_status_id' => 1,
            'ot_no' => $newOTNo,
            'ot_type_id' => $request->ot_type_id,
            'emp_no' => $user->emp_no,
            'date_from' => $request->date_from,
            'time_from' => $request->time_from,
            'date_to' => $request->date_to,
            'time_to' => $request->time_to,
            'task_title' => $request->task_title,
            'task_done' => $request->task_done,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        return back()->with('success', 'Overtime Entry created successfully.');
    }

    public function viewOTRequest($id)
    {
        $viewOTRequest = OTModel::findorfail($id);
        return Inertia::render('OT_Module/ot_entry', [
            'viewOTRequest' => $viewOTRequest,
        ]);
    }
    public function spoilOTRequest(Request $request, $id)
    {
        $spoilOTRequest = OTModel::where('ot_id', $id)->where('ot_status_id', 1)->first(); //only pending can be deleted
        $validated = $request->validate([
            'ot_status_id' => 'required|in:4',
        ]);
        $currentUser = Auth::user()->emp_no;
        $spoilOTRequest->update([
            'ot_status_id' => $validated['ot_status_id'],
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/OT_Module/ot_entry');
    }
}
