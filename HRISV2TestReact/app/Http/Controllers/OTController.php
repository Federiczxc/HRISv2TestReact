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
            'updated_date' => Carbon::now(),
        ]);

        return back()->with('success', 'Overtime Entry created successfully.');
    }
    public function editOTRequest(Request $request)
    {
        $ot = OTModel::where('ot_no', $request->ot_no) //Can only edit Pending
            ->where('ot_status_id', 1)
            ->first();

        $user = Auth::user()->emp_no;
        $request->validate([
            'date_from' => 'required|date|before_or_equal:date_to', //Can only input dates before or equal "date to"
            'time_from' => 'required',
            'date_to' => 'required|date|after_or_equal:date_from', //Can only input dates after or equal "date from"
            'time_to' => 'required',
            'task_title' => 'required',
            'task_done' => 'required',
        ]);
        $ot->date_from = $request->date_from;
        $ot->time_from = $request->time_from;
        $ot->date_to = $request->date_to;
        $ot->time_to = $request->time_to;
        $ot->task_title = $request->task_title;
        $ot->task_done = $request->task_done;
        $ot->updated_by = $user;
        $ot->updated_date = Carbon::now();
        $ot->save();
        /* return response()->json(['message' => 'UT request updated successfully!', 'ot' => $ot]); */
        return redirect()->intended('/OT_Module/ot_entry');
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
    public function deleteOTRequest($id)
    {
        $deleteOTRequest = OTModel::where('ot_id', $id)->where('ot_status_id', 4)->first(); //only pending can be deleted

        if ($deleteOTRequest) {
            $deleteOTRequest->delete();
        }

        return redirect()->intended('/OT_Module/ot_entry');
    }

    public function OTApprList()
    {
        $apprvID = Auth::user()->emp_no;
        $appr_pendings = OTModel::with(['user', 'status'])->where(function ($query) use ($apprvID) { //Can view requests regardless if 1st or 2nd appr
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ot_status_id', '1');
            })
            ->get()
            ->map(function ($ot) {
                $approver = User::where('emp_no', $ot->approved_by)->first();
                $ot->approver_name = $approver ? $approver->name : null; //match emp_no approved by to user emp_no get name
                $first_appr = User::where('emp_no', $ot->first_apprv_no)->first();
                $ot->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ot->sec_apprv_no)->first();
                $ot->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no

                return $ot;
            });
        $appr_updated = OTModel::with(['user', 'status'])->where(function ($query) use ($apprvID) {
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ot_status_id', '2') //approved
                    ->orWhere('ot_status_id', '3'); //disapproved
            })
            ->get()
            ->map(function ($ot) {
                $approver = User::where('emp_no', $ot->approved_by)->first();
                $ot->approver_name = $approver ? $approver->name : null;
                $first_appr = User::where('emp_no', $ot->first_apprv_no)->first();
                $ot->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ot->sec_apprv_no)->first();
                $ot->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no
                return $ot;
            });
        return Inertia::render('OT_Module/ot_appr_list', [
            'OTPendingList' => $appr_pendings,
            'OTUpdatedList' => $appr_updated,
        ]);
    }
    public function updateAll(Request $request) //Batch update
    {
        $currentUser = Auth::user()->emp_no;
        $validated = $request->validate(['action' => 'required',]);
        $action = $validated['action'];
        if ($action === 'approve') {
            OTModel::where('ot_status_id', '1')->update([
                'ot_status_id' => '2',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        } elseif ($action === 'rejected') {
            OTModel::where('ot_status_id', '1')->update([
                'ot_status_id' => '3',
                'approved_by' => $currentUser,
                'approved_date' => Carbon::now(),
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now()
            ]);
        }
        return redirect()->intended('/OT_Module/ot_appr_list');
    }
    public function updateBatch(Request $request)
    {
        $validated = $request->validate([
            'rows.*.ot_id' => 'required',
            'rows.*.ot_status_id' => 'required|in:1,2,3',
        ]);

        $currentUser = Auth::user()->emp_no;
        foreach ($validated['rows'] as $row) {
            $ot = OTModel::find($row['ot_id']);
            if ($ot) {
                $ot->update([
                    'ot_status_id' => $row['ot_status_id'],
                    'approved_by' => $row['ot_status_id'] === 1 ? null : $currentUser,
                    'approved_date' => $row['ot_status_id'] === 1 ? null : Carbon::now(),
                    'updated_by' => Auth::user()->emp_no,
                    'updated_date' => Carbon::now(),
                ]);
            }
        }
        return redirect()->intended('/OT_Module/ot_appr_list');
    }
    public function editOTApprRequest(Request $request) //MODAL EDIT
    {
        $ot = OTModel::where('ot_no', $request->ot_no)
            ->first();
        $validated = $request->validate([
            'ot_status_id' => 'required|in:1,2,3',
            'appr_remarks' => 'nullable|string' // Validate that it is either 2 or 3

        ]);
        $currentUser = Auth::user()->emp_no;

        $ot->update([
            'ot_status_id' => $validated['ot_status_id'],
            'appr_remarks' => $validated['appr_remarks'],
            'approved_by' => $currentUser,
            'approved_date' => Carbon::now(),
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/OT_Module/ot_appr_list');
    }
    public function OTReportsList()
    {
        $apprvID = Auth::user()->emp_no;

        $appr_list = OTModel::with(['user', 'status'])
            ->where('first_apprv_no', $apprvID)
            ->orWhere('sec_apprv_no', $apprvID)
            ->get()
            ->map(function ($ot) {
                $approver = User::where('emp_no', $ot->approved_by)->first();
                $ot->approver_name = $approver ? $approver->name : null; //Can see requests under him
                $first_appr = User::where('emp_no', $ot->first_apprv_no)->first();
                $ot->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ot->sec_apprv_no)->first();
                $ot->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no

                return $ot;
            });
        return Inertia::render('OT_Module/ot_reports_list', [
            'OTReportsList' => $appr_list,
        ]);
    }
    public function uploadOTReport(Request $request)
    {
        $currentUser = Auth::user()->emp_no;

        $request->validate([
            'ot_upload' => 'required|array'
        ]);
        $csvData = $request->input('ot_upload');
        $errors = [];
        $expectedColumns = [
            'Employee No.',
            'Employee Name',
            'Date From',
            'Time From',
            'Date To',
            'Time To',
            'Task Title',
            'Task Done',
            'Date Filed',
            'Approved By',
            'Approved Date',

        ];
        $columns = array_keys($csvData[0]);
        foreach ($expectedColumns as $expectedColumn) {
            if (!in_array($expectedColumn, $columns)) {
                $errors[] = "Column '$expectedColumn' is missing or misspelled in the uploaded file.";
                return response()->json(['errorWarning' => $errors], 422);
            }
        }
        foreach ($csvData as $index => $row) {
            $index = $index + 1;
            $employeeName = User::where('name', 'LIKE', '%' . $row['Employee Name'] . '%')->first();
            $employeeNo = User::where('emp_no', $row['Employee No.'])->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $dateFrom = Carbon::parse($row['Date From'])->setTimezone('Asia/Manila');
            $dateTo = Carbon::parse($row['Date To'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');
            Log::info($csvData);

            if (!$employeeNo) {
                $errors[] = "$index Employee No '{$row['Employee No.']}' not found in the database.";
            }

            if (!$employeeName) {
                $errors[] = "$index Employee Name '{$row['Employee Name']}' not found in the database.";
            }

            if ($employeeNo && $employeeName && $employeeNo->name !== $row['Employee Name']) {
                $errors[] = "$index Employee No '{$row['Employee No.']}' does not match the name '{$row['Employee Name']}'";
            }
            if ($approved_by) {

                if ($employeeName && $approved_by->name !== $employeeName->first_apprv_name && $approved_by->name !== $employeeName->sec_apprv2_name) {
                    $errors[] = "$index '{$row['Approved By']}' is not the approver for Employee '{$row['Employee Name']}'";
                }
                if ($employeeName && $approved_by->emp_no !== $employeeName->first_apprv_no && $approved_by->emp_no !== $employeeName->sec_apprv2_no) {
                    $errors[] = "$index '{$row['Approved By']}' does not match the first or second appr's emp_no for Employee '{$row['Employee Name']}'";
                }
                if ($approved_by->is_approver == 0) {
                    $errors[] = "$index '{$row['Approved By']}' is not set as an approver";
                }
            }
            if (!$approved_by) {
                $errors[] = "$index Approver Name '{$row['Approved By']}' doesn't exist in the database";
            }
        }
        if (!empty($errors)) {
            return response()->json(['errorWarning' => $errors], 422);
        }
        foreach ($csvData as $index => $row) {
            $employeeName = User::where('name', 'LIKE', '%' . $row['Employee Name'] . '%')->first();
            //validate employee name and emp no
            $employeeNo = User::where('emp_no', $row['Employee No.'])->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $dateFrom = Carbon::parse($row['Date From'])->setTimezone('Asia/Manila');
            $dateTo = Carbon::parse($row['Date To'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');
            $filedDate = Carbon::parse($row['Date Filed'])->setTimezone('Asia/Manila');
            OTModel::create([
                'emp_no' => $employeeName->emp_no,
                'ot_no' => 'Manual',
                'ot_status_id' => 2,
                'ot_type_id' => 5,
                'date_from' => $dateFrom,
                'date_to' =>  $dateTo,
                'time_from' => $row['Time From'],
                'time_to' => $row['Time To'],
                'task_title' => $row['Task Title'],
                'task_done' => $row['Task Done'],
                'first_apprv_no' => $employeeName->first_apprv_no,
                'sec_apprv_no' => $employeeName->sec_apprv2_no,
                'approved_by' => $approved_by->emp_no,
                'approved_date' => $approvedDate,
                'created_by' => $currentUser,
                'created_date' => $filedDate,
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now(),
            ]);
        }
        return response()->json(['message' => 'Entry Successful']);
    }
}
