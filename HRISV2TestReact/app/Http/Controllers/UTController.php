<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use App\Models\UTModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\CssSelector\Node\SelectorNode;
use Inertia\Inertia;

class UTController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user()->name;
        $utList = UTModel::where('emp_fullname', $currentUser)->get();
        return Inertia::render('UT_Module/ut_entry', [
            'UTList' => $utList
        ]);
    }

    public function UTEntry(Request $request): RedirectResponse
    {
        $request->validate([
            'ut_date' => 'required',
            'ut_time' => 'required',
            'ut_reason'
        ], [
            'ut_date.required' => 'Date is required',
            'ut_time.required' => 'Time is required',
        ]);
        $user = Auth::user();
        $lastUtEntry = UTModel::orderBy('ut_no', 'desc')->first();
        $newUtNo = 'UT-' . sprintf('%09d', optional($lastUtEntry)->ut_no ? ((int) str_replace('UT-', '', $lastUtEntry->ut_no) + 1) : 1);
        $ut_entry = UTModel::create([
            'emp_no' => $user->emp_no,
            'ut_no' => $newUtNo,
            'emp_fullname' => $user->name,
            'ut_date' => $request->ut_date,
            'ut_time' => $request->ut_time,
            'ut_reason' => $request->ut_reason,
            'first_apprv_no' => $user->first_apprv_no,
            'first_apprv_name' => $user->first_apprv_name,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'sec_apprv_name' => $user->sec_apprv2_name,
            'created_date' => Carbon::now(),
            'updated_date' => Carbon::now(),
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'ut_status_id' => 1,
            'mf_status_name' => 'Pending',

        ]);
        return redirect('/UT_Module/ut_entry')->with('success', 'dz');
    }
    public function editUTRequest(Request $request)
    {
        $ut = UTModel::where('ut_no', $request->ut_no)->first();
        $user = Auth::user()->emp_no;
        $request->validate([
            'ut_date' => 'required',
            'ut_time' => 'required',
            'ut_reason'
        ], [
            'ut_date.required' => 'date is required',
            'ut_time.required' => 'time is required',
        ]);
        $ut->ut_date = $request->ut_date;
        $ut->ut_time = $request->ut_time;
        $ut->ut_reason = $request->ut_reason;
        $ut->updated_by = $user;
        $ut->updated_date = Carbon::now();
        $ut->save();
        /* return response()->json(['message' => 'UT request updated successfully!', 'ut' => $ut]); */
        return redirect()->intended('/UT_Module/ut_entry');
    }

    public function viewUTRequest($id)
    {
        $viewUTRequest = UTModel::findorfail($id);
        /*  dd("puke", $id, $viewUTRequest); */
        return Inertia::render('UT_Module/ut_entry', [
            'viewUTRequest' => $viewUTRequest,
        ]);
    }

    public function deleteUTRequest($id)
    {
        $deleteUTRequest = UTModel::findorfail($id);
        $deleteUTRequest->delete();

        return redirect()->intended('/UT_Module/ut_entry');
    }


    /* APPROVERS */
    public function UTApprList()
    {
        $apprvID = Auth::user()->name;
        $appr_pendings = UTModel::where('first_apprv_name', $apprvID)->orWhere('sec_apprv_name', $apprvID)->where('ut_status_id', '1')->get();

        $appr_updated = UTModel::where(function ($query) use ($apprvID) {
            $query->where('first_apprv_name', $apprvID)
                ->orWhere('sec_apprv_name', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ut_status_id', '2')
                    ->orWhere('ut_status_id', '3');
            })
            ->get();
        return Inertia::render('UT_Module/ut_appr_list', [
            'UTPendingList' => $appr_pendings,
            'UTUpdatedList' => $appr_updated,
        ]);
    }


    public function updateUTRequest(Request $request, $id)
    {
        $validated = $request->validate([
            'ut_status_id' => 'required|in:2,3', // Validate that it is either 2 or 3
        ]);
        $currentUser = Auth::user()->emp_no;
        $ut_status_id = $validated['ut_status_id'];
        if ($ut_status_id == 2) {
            $statusname = 'Approved';
        } elseif ($ut_status_id == 3) {
            $statusname = 'Rejected';
        }

        $remarks = $request->input('remarks');
        $selectedUT = UTModel::findOrFail($id);
        $selectedUT->update([
            'ut_status_id' => $ut_status_id,
            'mf_status_name' => $statusname,
            'remarks' => $remarks,
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),

        ]);
    }

    public function updateAll(Request $request)
    {
        $currentUser = Auth::user()->emp_no;
        $validated = $request->validate(['action' => 'required',]);
        $action = $validated['action'];
        if ($action === 'approve') {
            UTModel::where('ut_status_id', '1')->update([
                'ut_status_id' => '2',
                'mf_status_name' => 'Approved',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        } elseif ($action === 'rejected') {
            UTModel::where('ut_status_id', '1')->update([
                'ut_status_id' => '3',
                'mf_status_name' => 'Rejected',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        }
        return redirect()->intended('/UT_Module/ut_appr_list');
    }

    public function viewUTPendingRequest($id)
    {
        $viewUTPendingRequest = UTModel::findorfail($id);
        /*  dd("puke", $id, $viewUTRequest); */
        return Inertia::render('UT_Module/ut_appr_list', [
            'viewUTPendingRequest' => $viewUTPendingRequest,
        ]);
    }
    public function editUTApprRequest(Request $request)
    {
        $ut = UTModel::where('ut_no', $request->ut_no)->first();
        $validated = $request->validate([
            'ut_status_id' => 'required|in:2,3',
            'remarks' => 'nullable|string' // Validate that it is either 2 or 3
        ]);
        $currentUser = Auth::user()->emp_no;
        $statusname = $validated['ut_status_id'] == 2 ? 'Approved' : 'Rejected';

        $ut->update([
            'ut_status_id' => $validated['ut_status_id'],
            'mf_status_name' => $statusname,
            'remarks' => $validated['remarks'],
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        /* return response()->json(['message' => 'UT request updated successfully!', 'ut' => $ut]); */
        return redirect()->intended('/UT_Module/ut_appr_list');
    }
    /* public function updateUTDisplayRequest($id)
    {

        $selectedRequest = UTModel::findorFail($id);
        return view('/UT_Module/ut_appr_pending', compact('selectedRequest'));
    }
   
    public function updatedUTDisplayRequest($id)
    {
        $selectedUpdatedRequest = UTModel::findorFail($id);
        return view('/UT_Module/ut_appr_updated', compact('selectedUpdatedRequest'));
    } */
}
