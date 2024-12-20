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
        $currentUser = Auth::user()->emp_no;
        $utList = UTModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->whereIn('ut_status_id', [1, 2, 3])
            ->get()
            ->map(function ($ut) {
                $approver = User::where('emp_no', $ut->approved_by)->first();
                $ut->approver_name = $approver ? $approver->name : null;
                return $ut;
            });
        $spoiledUTList = UTModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->where('ut_status_id', 4)
            ->get();
        return Inertia::render('UT_Module/ut_entry', [
            'UTList' => $utList,
            'spoiledUTList' => $spoiledUTList,
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
            'ut_date' => $request->ut_date,
            'ut_time' => $request->ut_time,
            'ut_reason' => $request->ut_reason,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_date' => Carbon::now(),
            'updated_date' => Carbon::now(),
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'ut_status_id' => 1,

        ]);
        return redirect('/UT_Module/ut_entry')->with('success', 'dz');
    }

    public function viewUTRequest($id)
    {
        $viewUTRequest = UTModel::findorfail($id);
        /*  dd("puke", $id, $viewUTRequest); */
        return Inertia::render('UT_Module/ut_entry', [
            'viewUTRequest' => $viewUTRequest,
        ]);
    }

    public function editUTRequest(Request $request)
    {
        $ut = UTModel::where('ut_no', $request->ut_no) //Can only edit Pending
            ->where('ut_status_id', 1)
            ->first();
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

    public function spoilUTRequest(Request $request, $id)
    {
        $spoilUTRequest = UTModel::where('id', $id)->where('ut_status_id', 1)->first(); //only pending can be deleted
        $validated = $request->validate([
            'ut_status_id' => 'required|in:4',
        ]);
        $currentUser = Auth::user()->emp_no;
        $spoilUTRequest->update([
            'ut_status_id' => $validated['ut_status_id'],
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/UT_Module/ut_entry');
    }
    public function deleteUTRequest($id)
    {
        $deleteUTRequest = UTModel::where('id', $id)->where('ut_status_id', 4)->first(); //only pending can be deleted

        if ($deleteUTRequest) {
            $deleteUTRequest->delete();
        }

        return redirect()->intended('/UT_Module/ut_entry');
    }


    /* APPROVERS */
    public function UTApprList()
    {
        $apprvID = Auth::user()->emp_no;
        $appr_pendings = UTModel::with(['user', 'status'])->where(function ($query) use ($apprvID) { //Can view requests regardless if 1st or 2nd appr
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ut_status_id', '1');
            })
            ->get()
            ->map(function ($ut) {
                $approver = User::where('emp_no', $ut->approved_by)->first();
                $ut->approver_name = $approver ? $approver->name : null; //match emp_no approved by to user emp_no get name

                return $ut;
            });
        $appr_updated = UTModel::with(['user', 'status'])->where(function ($query) use ($apprvID) {
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ut_status_id', '2') //approved
                    ->orWhere('ut_status_id', '3'); //disappored
            })
            ->get()
            ->map(function ($ut) {
                $approver = User::where('emp_no', $ut->approved_by)->first();
                $ut->approver_name = $approver ? $approver->name : null;
                return $ut;
            });
        return Inertia::render('UT_Module/ut_appr_list', [
            'UTPendingList' => $appr_pendings,
            'UTUpdatedList' => $appr_updated,
            'apprvID' => $apprvID
        ]);
    }


    public function updateAll(Request $request) //Batch Update
    {
        $currentUser = Auth::user()->emp_no;
        $validated = $request->validate(['action' => 'required',]);
        $action = $validated['action'];
        if ($action === 'approve') {
            UTModel::where('ut_status_id', '1')->update([
                'ut_status_id' => '2',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        } elseif ($action === 'rejected') {
            UTModel::where('ut_status_id', '1')->update([
                'ut_status_id' => '3',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        }
        return redirect()->intended('/UT_Module/ut_appr_list');
    }
    public function updateBatch(Request $request)
    {
        $validated = $request->validate([
            'rows.*.id' => 'required',
            'rows.*.ut_status_id' => 'required|in:1,2,3',
        ]);

        $currentUser = Auth::user()->emp_no;
        foreach ($validated['rows'] as $row) {
            $ut = UTModel::find($row['id']);
            if ($ut) {
                $ut->update([
                    'ut_status_id' => $row['ut_status_id'],
                    'approved_by' => $row['ut_status_id'] === 1 ? null : $currentUser,
                    'approved_date' => $row['ut_status_id'] === 1 ? null : Carbon::now(),
                    'updated_by' => Auth::user()->emp_no,
                    'updated_date' => Carbon::now(),
                ]);
            }
        }
        return redirect()->intended('/UT_Module/ut_appr_list');
    }

    public function updateUTRequest(Request $request, $id) //Quickedit
    {
        $validated = $request->validate([
            'ut_status_id' => 'required|in:2,3', // Validate that it is either 2 or 3
        ]);
        $currentUser = Auth::user()->emp_no;
        $ut_status_id = $validated['ut_status_id'];


        $selectedUT = UTModel::findOrFail($id);
        $selectedUT->update([
            'ut_status_id' => $ut_status_id,
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),

        ]);
        $selectedUT->refresh();
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
    public function editUTApprRequest(Request $request) //MODAL Edit
    {
        $ut = UTModel::where('ut_no', $request->ut_no)
            ->first();
        $validated = $request->validate([
            'ut_status_id' => 'required|in:1,2,3',
            'remarks' => 'nullable|string' // Validate that it is either 2 or 3
        ]);
        $currentUser = Auth::user()->emp_no;

        $ut->update([
            'ut_status_id' => $validated['ut_status_id'],
            'remarks' => $validated['remarks'],
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/UT_Module/ut_appr_list');
    }


    public function UTReportsList()
    {
        $apprvID = Auth::user()->emp_no;

        $appr_list = UTModel::with(['user', 'status'])
            ->where('first_apprv_no', $apprvID)
            ->orWhere('sec_apprv_no', $apprvID)
            ->get()->map(function ($ut) {
                $approver = User::where('emp_no', $ut->approved_by)->first();
                $ut->approver_name = $approver ? $approver->name : null; //matahthacmah
                $first_appr = User::where('emp_no', $ut->first_apprv_no)->first();
                $ut->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ut->sec_apprv_no)->first();
                $ut->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no
                return $ut;
            });
        return Inertia::render('UT_Module/ut_reports_list', [
            'UTReportsList' => $appr_list,
        ]);
    }
    /*    public function viewUTReportRequest($id)
    {
        $viewUTReportRequest = UTModel::findorfail($id);
        return Inertia::render('UT_Module/ut_reports_list', [
            'viewUTReportRequest' => $viewUTReportRequest,
        ]);
    } */
    public function uploadUTReport(Request $request)
    {
        $currentUser = Auth::user()->emp_no;

        $request->validate([
            'ut_upload' => 'required|array'
        ]);
        $csvData = $request->input('ut_upload');
        $errors = [];
        
        foreach ($csvData as $index => $row) {
            $index = $index + 1;
            $employeeNo = User::where('emp_no', $row['Employee No.'])->first();
            $employeeName = User::where('name', 'LIKE', '%' . $row['Employee Name'] . '%')->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $utDate = Carbon::parse($row['UT Date'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');
            if (!$employeeNo) {
                $errors[] = "$index emp_no '{$row['Employee No.']}' not found in the database.";
            }

            if (!$employeeName) {
                $errors[] = "$index emp_name '{$row['Employee Name']}' not found in the database.";
            }
            if ($employeeNo && $employeeName && $employeeNo->name !== $row['Employee Name']) {
                $errors[] = "$index emp_no '{$row['Employee No.']}' does not match the name '{$row['Employee Name']}'";
            }
            if ($approved_by) {
                
                if ($employeeName && $approved_by->name !== $employeeName->first_apprv_name && $approved_by->name !== $employeeName->sec_apprv2_name) {
                    $errors[] = "$index '{$row['Approved By']}' is not the approver for Employee '{$row['Employee Name']}'";
                }
                if ($employeeName && $approved_by->emp_no !== $employeeName->first_apprv_no && $approved_by->emp_no !== $employeeName->sec_apprv2_no) {
                    $errors[] = "$index '{$row['Approved By']}' does not match the first or second appr's emp_no for Employee '{$row['Employee Name']}'";
                }
                if ($approved_by->is_approver == 0){
                    $errors[] = "$index '{$row['Approved By']}' is not set as an approver";
                }
                
            }
            if (!$approved_by){
                $errors[] = "$index '{$row['Approved By']}' doesn't exist in the database";
            }
        }

        if (!empty($errors)) {
            return response()->json(['errorWarning' => $errors], 422);
        }

        foreach ($csvData as $index => $row) {
            $employeeName = User::where('emp_no', $row['Employee No.'])->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $utDate = Carbon::parse($row['UT Date'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');

            UTModel::create([
                'ut_no' => 'Manual',
                'emp_no' => $employeeName->emp_no,
                'ut_status_id' => 2,
                'ut_date' => $utDate,
                'ut_time' => $row['UT Time'],
                'ut_reason' => $row['UT Reason'],
                'first_apprv_no' => $employeeName->first_apprv_no,
                'sec_apprv_no' => $employeeName->sec_apprv2_no,
                'approved_by' => $approved_by->emp_no,
                'approved_date' => $approvedDate,
                'created_by' => $currentUser,
                'created_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now(),
            ]);
        }

        return response()->json(['message' => 'Entry Successful']);
    }
}
