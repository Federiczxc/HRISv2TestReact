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
        $utList = UTModel::where('emp_fullname', $currentUser)->paginate(5);
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
            'ut_date.required' => 'Name is required',
            'ut_time.required' => 'Company is required',
        ]);
        $user = Auth::user();
        $lastUtEntry = UTModel::orderBy('ut_no', 'desc')->first();
        $newUtNo = 'UT-' . (optional($lastUtEntry)->ut_no ? ((int) str_replace('UT-', '', $lastUtEntry->ut_no) + 1) : 1001);
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

    public function UTApprList()
    {
        $apprvID = Auth::user()->name;
        $appr_pendings = UTModel::where('first_apprv_name', $apprvID)->orWhere('sec_apprv_name', $apprvID)->where('ut_status_id', '1')->paginate(10);
        $appr_updated = UTModel::where(function ($query) use ($apprvID) {
            $query->where('first_apprv_name', $apprvID)
                ->orWhere('sec_apprv_name', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ut_status_id', '2')
                    ->orWhere('ut_status_id', '3');
            })
            ->paginate(10);
        return view('/UT_Module/ut_appr_list', compact('appr_pendings', 'appr_updated'));
    }
    public function updateUTDisplayRequest($id)
    {

        $selectedRequest = UTModel::findorFail($id);
        return view('/UT_Module/ut_appr_pending', compact('selectedRequest'));
    }
    public function updateUTRequest(Request $request, $id)
    {
        $currentUser = Auth::user()->emp_no;
        $ut_status_id = $request->input('ut_status_id');
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
            'updated_date' => Carbon::now(),
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser
        ]);
    }

    public function updatedUTDisplayRequest($id)
    {
        $selectedUpdatedRequest = UTModel::findorFail($id);
        return view('/UT_Module/ut_appr_updated', compact('selectedUpdatedRequest'));
    }
}