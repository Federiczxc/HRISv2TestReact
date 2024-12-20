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
        $obList = OBModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->whereIn('ob_status_id', [1, 2, 3])
            ->get()
            ->map(function ($ob) {
                $approver = User::where('emp_no', $ob->approved_by)->first();
                $ob->approver_name = $approver ? $approver->name : null;
                return $ob;
            });
        $spoiledOBList = OBModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->where('ob_status_id', 4)
            ->get();
        return Inertia::render('OB_Module/ob_entry', [
            'OBList' => $obList,
            'spoiledOBList' => $spoiledOBList
        ]);
    }

    public function OBEntry(Request $request)
    {
        $request->validate([
            'destination' => 'required',
            'date_from' => 'required|date|before_or_equal:date_to',
            'time_from' => 'required',
            'date_to' => 'required|date|after_or_equal:date_from',
            'time_to' => 'required',
            'person_to_meet' => 'required',
            'ob_purpose' => 'required',
            'ob_attach.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);
        $user = Auth::user();
        $lastOBEntry = OBModel::orderBy('ob_no', 'desc')->first();
        $newOBNo = 'OB-' . sprintf('%09d', optional($lastOBEntry)->ob_no ? ((int) str_replace('OB-', '', $lastOBEntry->ob_no) + 1) : 1);

        $today = now()->startOfDay(); // Start of today for comparison
        $dateFrom = \Carbon\Carbon::parse($request->date_from);

        $obTypeId = $dateFrom->lt($today) ? 2 : 1;
        $filePaths = [];
        if ($request->hasFile('ob_attach')) {
            foreach ($request->file('ob_attach') as $file) {
                $filename = time() . '-' . $file->getClientOriginalName();
                $path = $file->storeAs('ob_attachments', $filename, 'public');
                $filePaths[] = $path;
            }
        }

        // Save file paths as JSON
        $attachmentsJson = json_encode($filePaths);
        $obEntry = OBModel::create([
            'ob_status_id' => 1,
            'ob_no' => $newOBNo,
            'ob_type_id' => $obTypeId,
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
            'ob_attach' => $attachmentsJson,
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

    public function editOBRequest(Request $request)
    {
        $ob = OBModel::where('ob_no', $request->ob_no) //Can only edit Pending
            ->where('ob_status_id', 1)
            ->first();
        $user = Auth::user()->emp_no;
        $request->validate([
            'destination' => 'required',
            'date_from' => 'required|date|before_or_equal:date_to', //Can only input dates before or equal "date to"
            'time_from' => 'required',
            'date_to' => 'required|date|after_or_equal:date_from', //Can only input dates after or equal "date from"
            'time_to' => 'required',
            'person_to_meet' => 'required',
            'ob_purpose' => 'required'
        ]);
        $filePaths = [];
        if ($request->hasFile('ob_attach')) {
            foreach ($request->file('ob_attach') as $file) {
                $filename = time() . '-' . $file->getClientOriginalName();
                $path = $file->storeAs('ob_attachments', $filename, 'public');
                $filePaths[] = $path;
            }
        }
        $attachmentsJson = json_encode($filePaths);

        $ob->destination = $request->destination;
        $ob->date_from = $request->date_from;
        $ob->date_to = $request->date_to;
        $ob->time_from = $request->time_from;
        $ob->time_to = $request->time_to;
        $ob->person_to_meet = $request->person_to_meet;
        $ob->ob_purpose = $request->ob_purpose;
        $ob->updated_by = $user;
        $ob->updated_date = Carbon::now();
        $ob->ob_attach = $attachmentsJson;
        $ob->save();
        return redirect()->intended('/OB_Module/ob_entry');
    }

    public function spoilOBRequest(Request $request, $id)
    {
        $spoilOBRequest = OBModel::where('ob_id', $id)->where('ob_status_id', 1)->first(); //only pending can be deleted
        $validated = $request->validate([
            'ob_status_id' => 'required|in:4',
        ]);
        $currentUser = Auth::user()->emp_no;
        $spoilOBRequest->update([
            'ob_status_id' => $validated['ob_status_id'],
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/OB_Module/ob_entry');
    }

    public function deleteOBRequest($id)
    {
        $deleteOBRequest = OBModel::where('ob_id', $id)->where('ob_status_id', 4)->first(); //only pending can be deleted

        if ($deleteOBRequest) {
            $deleteOBRequest->delete();
        }
        return redirect()->intended('/OB_Module/ob_entry');
    }

    public function OBApprList()
    {
        $apprvID = Auth::user()->emp_no;
        $appr_pendings = OBModel::with(['user', 'status'])->where(function ($query) use ($apprvID) { //Can view requests regardless if 1st or 2nd appr
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ob_status_id', '1');
            })
            ->get()
            ->map(function ($ob) {
                $approver = User::where('emp_no', $ob->approved_by)->first();
                $ob->approver_name = $approver ? $approver->name : null; //match emp_no approved by to user emp_no get name
                $first_appr = User::where('emp_no', $ob->first_apprv_no)->first();
                $ob->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ob->sec_apprv_no)->first();
                $ob->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no

                return $ob;
            });
        $appr_updated = OBModel::with(['user', 'status'])->where(function ($query) use ($apprvID) {
            $query->where('first_apprv_no', $apprvID)
                ->orWhere('sec_apprv_no', $apprvID);
        })
            ->where(function ($query) {
                $query->where('ob_status_id', '2') //approved
                    ->orWhere('ob_status_id', '3'); //disapproved
            })
            ->get()
            ->map(function ($ob) {
                $approver = User::where('emp_no', $ob->approved_by)->first();
                $ob->approver_name = $approver ? $approver->name : null;
                $first_appr = User::where('emp_no', $ob->first_apprv_no)->first();
                $ob->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ob->sec_apprv_no)->first();
                $ob->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no
                return $ob;
            });
        return Inertia::render('OB_Module/ob_appr_list', [
            'OBPendingList' => $appr_pendings,
            'OBUpdatedList' => $appr_updated,
        ]);
    }

    public function updateAll(Request $request) //Batch update
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
    public function updateBatch(Request $request)
    {
        $validated = $request->validate([
            'rows.*.ob_id' => 'required',
            'rows.*.ob_status_id' => 'required|in:1,2,3',
        ]);

        $currentUser = Auth::user()->emp_no;
        foreach ($validated['rows'] as $row) {
            $ob = OBModel::find($row['ob_id']);
            if ($ob) {
                $ob->update([
                    'ob_status_id' => $row['ob_status_id'],
                    'approved_by' => $row['ob_status_id'] === 1 ? null : $currentUser,
                    'approved_date' => $row['ob_status_id'] === 1 ? null : Carbon::now(),
                    'updated_by' => Auth::user()->emp_no,
                    'updated_date' => Carbon::now(),
                ]);
            }
        }
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

    public function editOBApprRequest(Request $request) //MODAL EDIT
    {
        $ob = OBModel::where('ob_no', $request->ob_no)
            ->first();
        $validated = $request->validate([
            'ob_status_id' => 'required|in:1,2,3',
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
        return redirect()->intended('/OB_Module/ob_appr_list');
    }


    public function OBReportsList()
    {
        $apprvID = Auth::user()->emp_no;

        $appr_list = OBModel::with(['user', 'status'])
            ->where('first_apprv_no', $apprvID)
            ->orWhere('sec_apprv_no', $apprvID)
            ->get()
            ->map(function ($ob) {
                $approver = User::where('emp_no', $ob->approved_by)->first();
                $ob->approver_name = $approver ? $approver->name : null; //Can see requests under him
                $first_appr = User::where('emp_no', $ob->first_apprv_no)->first();
                $ob->first_approver = $first_appr ? $first_appr->name : null; //match first_apprv_no to emp_no
                $sec_appr = User::where('emp_no', $ob->sec_apprv_no)->first();
                $ob->sec_approver = $sec_appr ? $sec_appr->name : null; //match sec_apprv_no to emp_no

                return $ob;
            });
        return Inertia::render('OB_Module/ob_reports_list', [
            'OBReportsList' => $appr_list,
        ]);
    }
    public function uploadOBReport(Request $request)
    {
        $currentUser = Auth::user()->emp_no;

        $request->validate([
            'ob_upload' => 'required|array'
        ]);
        $csvData = $request->input('ob_upload');
        $errors = [];
        foreach ($csvData as $index => $row) {
            $employeeName = User::where('name', 'LIKE', '%' . $row['Employee Name'] . '%')->first();
            $employeeNo = User::where('emp_no', $row['Employee No.'])->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $dateFrom = Carbon::parse($row['Date From'])->setTimezone('Asia/Manila');
            $dateTo = Carbon::parse($row['Date To'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');
            $obDays = $dateFrom->diffInDays($dateTo);
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
                $errors[] = "$index '{$row['Approved By']}' doesn't exist in the database";
            }
            if (!empty($errors)) {
                return response()->json(['errorWarning' => $errors], 422);
            }
        }
        foreach ($csvData as $index => $row) {
            $employeeName = User::where('name', 'LIKE', '%' . $row['Employee Name'] . '%')->first();
            //validate employee name and emp no
            $employeeNo = User::where('emp_no', $row['Employee No.'])->first();
            $approved_by = User::where('name', 'LIKE', '%' . $row['Approved By'] . '%')->first();
            $dateFrom = Carbon::parse($row['Date From'])->setTimezone('Asia/Manila');
            $dateTo = Carbon::parse($row['Date To'])->setTimezone('Asia/Manila');
            $approvedDate = Carbon::parse($row['Approved Date'])->setTimezone('Asia/Manila');
            $obDays = $dateFrom->diffInDays($dateTo);
            OBModel::create([
                'emp_no' => $employeeName->emp_no,
                'ob_no' => 'Manual',
                'ob_status_id' => 2,
                'ob_type_id' => 1,
                'date_from' => $dateFrom,
                'date_to' =>  $dateTo,
                'time_from' => $row['Time From'],
                'time_to' => $row['Time To'],
                'ob_days' => $obDays,
                'destination' => $row['Destination'],
                'person_to_meet' => $row['Person To Meet'],
                'ob_purpose' => $row['Purpose'],
                'first_apprv_no' => $employeeName->first_apprv_no,
                'sec_apprv_no' => $employeeName->sec_apprv2_no,
                'approved_by' => $approved_by->emp_no,
                'approved_date' => $approvedDate,
                'created_by' => $currentUser,
                'created_date' => $row['Date Filed'],
                'updated_by' => $currentUser,
                'updated_date' => Carbon::now(),
            ]);
        }
        return response()->json(['message' => 'Entry Successful']);

    }
}
