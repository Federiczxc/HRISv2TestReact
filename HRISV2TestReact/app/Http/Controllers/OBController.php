<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use App\Models\OBModel;
use App\Models\UTModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\CssSelector\Node\SelectorNode;
use Inertia\Inertia;


class OBController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user()->emp_no;
        $obList = OBModel::with(['user', 'status'])->where('emp_no', $currentUser)->get();
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
        if ($request->hasFile('ob_attach')) {
            $file = $request->file('ob_attach');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('ob_attachments', $filename, 'public');
        } else {
            $path = NULL;
        }

        $obEntry = OBModel::create([
            'ob_status_id' => 1,
            'ob_no' => $newOBNo,
            'ob_type_id' => 1,
            'emp_no' => $user->emp_no,
            'destination' => $request->destination,
            'date_from' => $request->date_from,
            'time_from' => $request->time_from,
            'date_to' => $request->date_to,
            'time_to' => $request->time_to,
            'ob_days' => $request->ob_days,
            'person_to_meet' => $request->person_to_meet,
            'ob_purpose' =>  $request->ob_purpose,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'ob_attach' => $path,
        ]);

        return back()->with('success', 'Official Business Entry created successfully.');
    }

    public function viewOBRequest($id)
    {
        $viewOBRequest = OBModel::findorfail($id);
        return Inertia::render('OB_Module/ob_entry', [
            'viewOBRequest' => $viewOBRequest,
        ]);
    }
    public function deleteOBRequest($id)
    {
        $deleteOBRequest = OBModel::findorfail($id);
        $deleteOBRequest->delete();
        return redirect()->intended('/OB_Module/ob_entry');
    }
    public function editOBRequest(Request $request)
    {
        $ob = OBModel::where('ob_no', $request->ob_no)->first();
        $user = Auth::user()->emp_no;
        $request->validate([
            'destination' => 'required',
            'date_from' => 'required',
            'time_from' => 'required',
            'date_to' => 'required',
            'time_to' => 'required',
            'person_to_meet' => 'required',
            'ob_purpose' => 'required'
        ]);
        if ($request->hasFile('ob_attach')) {
            $file = $request->file('ob_attach');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('ob_attachments', $filename, 'public');
        } else {
            $path = NULL;
        }
        $ob->destination = $request->destination;
        $ob->date_from = $request->date_from;
        $ob->date_to = $request->date_to;
        $ob->time_from = $request->time_from;
        $ob->time_to = $request->time_to;
        $ob->person_to_meet = $request->person_to_meet;
        $ob->ob_purpose = $request->ob_purpose;
        $ob->updated_by = $user;
        $ob->updated_date = Carbon::now();
        $ob->ob_attach = $path;
        $ob->save();
        return redirect()->intended('/OB_Module/ob_entry');
    }

    public function OBApprList()
    {
        $apprvID = Auth::user()->emp_no;
        $appr_pendings = OBModel::with(['user', 'status'])->where(function ($query) use ($apprvID) {
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ob_status_id', '1');
            })
            ->get();
        $appr_updated = OBModel::with(['user', 'status'])->where(function ($query) use ($apprvID) {
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ob_status_id', '2')
                    ->orWhere('ob_status_id', '3');
            })
            ->get();
        return Inertia::render('OB_Module/ob_appr_list', [
            'OBPendingList' => $appr_pendings,
            'OBUpdatedList' => $appr_updated,
        ]);
    }

    public function updateAll(Request $request)
    {
        $currentUser = Auth::user()->emp_no;
        $validated = $request->validate(['action' => 'required',]);
        $action = $validated['action'];
        if ($action === 'approve') {
            OBModel::where('ob_status_id', '1')->update([
                'ob_status_id' => '2',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        } elseif ($action === 'rejected') {
            OBModel::where('ob_status_id', '1')->update([
                'ob_status_id' => '3',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        }
        return redirect()->intended('/OB_Module/ob_appr_list');
    }

    public function editOBApprRequest(Request $request) //MODAL EDIT
    {
        $ob = OBModel::where('ob_no', $request->ob_no)->first();
        $validated = $request->validate([
            'ob_status_id' => 'required|in:2,3',
            'appr_remarks' => 'nullable|string' // Validate that it is either 2 or 3

        ]);
        $currentUser = Auth::user()->emp_no;

        $ob->update([
            'ob_status_id' => $validated['ob_status_id'],
            'appr_remarks' => $validated['appr_remarks'],
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        /* return response()->json(['message' => 'UT request updated successfully!', 'ut' => $ut]); */
        return redirect()->intended('/OB_Module/ob_appr_list');
    }
    public function updateOBRequest(Request $request, $id) //QuickEdit
    {
        $validated = $request->validate([
            'ob_status_id' => 'required|in:2,3', // Validate that it is either 2 or 3
        ]);
        $currentUser = Auth::user()->emp_no;
        $ob_status_id = $validated['ob_status_id'];
        $selectedOB = OBModel::findOrFail($id);
        $selectedOB->update([
            'ob_status_id' => $ob_status_id,
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),

        ]);
        $selectedOB->refresh();
        return redirect()->intended('/OB_Module/ob_appr_list');
    }
}
