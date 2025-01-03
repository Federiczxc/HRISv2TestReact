<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use App\Models\User;
use App\Models\LeaveModel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\CssSelector\Node\SelectorNode;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class LeaveController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user()->emp_no;
        $leaveList = LeaveModel::with(['user', 'status', 'leavetype'])
            ->where('emp_no', $currentUser)
            ->whereIn('leave_status_id', [1, 2, 3])
            ->get()
            ->map(function ($leave) {
                $approver = User::where('emp_no', $leave->approved_by)->first();
                $leave->approver_name = $approver ? $approver->name : null;
                return $leave;
            });
        $spoiledLeaveList = LeaveModel::with(['user', 'status'])
            ->where('emp_no', $currentUser)
            ->where('leave_status_id', 4)
            ->get();
        return Inertia::render('Leave_Module/leave_entry', [
            'LeaveList' => $leaveList,
            'spoiledLeaveList' => $spoiledLeaveList
        ]);
    }

    public function LeaveEntry(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date|before_or_equal:date_to',
            'date_to' => 'required|date|after_or_equal:date_from',
            'reason' => 'required',
            'leave_attach.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'leave_type_id' => 'required|in:1,2,3,4,5,6,8,9,10'
        ]);

        $user = Auth::user();
        $leaveTypeId = $request->leave_type_id;
        $leaveDays = $request->leave_days;
        if ($leaveTypeId == 1) {
            $today = \Carbon\Carbon::today();
            $dateFrom = \Carbon\Carbon::parse($request->date_from);

            $daysDifference = 0;
            $currentDate = $today->copy();

            while ($currentDate->lte($dateFrom)) {
                if (!$currentDate->isSunday()) {
                    $daysDifference++;
                }
                $currentDate->addDay();
            }

            if ($daysDifference < 4) {
                return back()->withErrors([
                    'date_from' => 'For Vacation Leave, both the start and end dates must be at least 4 working days (excluding Sundays) from today.',
                ]);
            }
        }
        if ($leaveTypeId == 2 && $leaveDays >= 3) { // Sick Leave
            if (!$request->hasFile('leave_attach') || count($request->file('leave_attach')) === 0) {
                return back()->withErrors(['leave_attach' => 'File attachment is required for Sick Leave if leave days are 3 or more.']);
            }
        }
        if ($request->date_from === $request->date_to && !$request->halfday) {
            return back()->withErrors(['halfday' => 'Please specify whether it is a half-day leave.']);
        }
        $leaveTypeCodes = [
            1 => 'VL', // Vacation Leave
            2 => 'SL', // Sick Leave
            3 => 'ML', // Emergency Leave
            4 => 'PL', // Maternity Leave
            5 => 'MCL', // Paternity Leave
            6 => 'SPL', // Bereavement Leave
            8 => 'EL', // Casual Leave
            9 => 'BL', // Annual Leave
            10 => 'FL', // Other Leave
        ];

        $leaveCode = $leaveTypeCodes[$leaveTypeId] ?? 'ERR';

        // Get the latest leave_no regardless of the prefix
        $lastLeaveEntry = LeaveModel::select('leave_no')
            ->orderByRaw("CAST(RIGHT(leave_no, CHARINDEX('-', REVERSE(leave_no)) - 1) AS INT) DESC")
            ->first();


        if ($lastLeaveEntry) {
            // Extract and increment the numeric part
            $lastLeaveNumber = (int) substr($lastLeaveEntry->leave_no, strrpos($lastLeaveEntry->leave_no, '-') + 1);
            $newLeaveNumber = $lastLeaveNumber + 1;
        } else {
            $newLeaveNumber = 1;
        }

        // Construct the new leave number
        $newLeaveNo = $leaveCode . '-' . sprintf('%09d', $newLeaveNumber);

        $today = now()->startOfDay();
        $dateFrom = \Carbon\Carbon::parse($request->date_from);

        $isLate = $dateFrom->lt($today) ? "Late Filing" : null;

        $filePaths = [];
        if ($request->hasFile('leave_attach')) {
            foreach ($request->file('leave_attach') as $file) {
                $filename = time() . '-' . $file->getClientOriginalName();
                $path = $file->storeAs('leave_attachments', $filename, 'public');
                $filePaths[] = $path;
            }
        }

        $attachmentsJson = json_encode($filePaths);

        LeaveModel::create([
            'leave_status_id' => 1,
            'leave_no' => $newLeaveNo,
            'leave_type_id' => $leaveTypeId,
            'emp_no' => $user->emp_no,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'reason' => $request->reason,
            'halfday' => $request->halfday,
            'leave_days' => $request->leave_days,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'updated_date' => Carbon::now(),
            'leave_attach' => $attachmentsJson,
            'is_late' => $isLate,
        ]);

        return back()->with('success', 'Official Business Entry created successfully.');
    }


    public function editLeaveRequest(Request $request)
    {
        $leave = LeaveModel::where('leave_no', $request->leave_no) //Can only edit Pending
            ->where('leave_status_id', 1)
            ->first();
        $user = Auth::user()->emp_no;
        $leaveTypeId = $request->leave_type_id;
        $leaveDays = $request->leave_days;
        $request->validate([
            'date_from' => 'required|date|before_or_equal:date_to',
            'date_to' => 'required|date|after_or_equal:date_from',
            'reason' => 'required',
            'leave_attach.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'leave_type_id' => 'required|in:1,2,3,4,5,6,8,9,10'
        ]);
        if ($leaveTypeId == 1) {
            $today = \Carbon\Carbon::today();
            $dateFrom = \Carbon\Carbon::parse($request->date_from);

            $daysDifference = 0;
            $currentDate = $today->copy();

            while ($currentDate->lte($dateFrom)) {
                if (!$currentDate->isSunday()) {
                    $daysDifference++;
                }
                $currentDate->addDay();
            }

            if ($daysDifference < 4) {
                return back()->withErrors([
                    'date_from' => 'For Vacation Leave, both the start and end dates must be at least 4 working days (excluding Sundays) from today.',
                ]);
            }
        }
        if ($leaveTypeId == 2 && $leaveDays >= 3) { // Sick Leave
            if (!$request->hasFile('leave_attach') || count($request->file('leave_attach')) === 0) {
                return back()->withErrors(['leave_attach' => 'File attachment is required for Sick Leave if leave days are 3 or more.']);
            }
        }
        if ($request->date_from === $request->date_to && !$request->halfday) {
            return back()->withErrors(['halfday' => 'Please specify whether it is a half-day leave.']);
        }
        $leaveTypeCodes = [
            1 => 'VL', // Vacation Leave
            2 => 'SL', // Sick Leave
            3 => 'ML', // Emergency Leave
            4 => 'PL', // Maternity Leave
            5 => 'MCL', // Paternity Leave
            6 => 'SPL', // Bereavement Leave
            8 => 'EL', // Casual Leave
            9 => 'BL', // Annual Leave
            10 => 'FL', // Other Leave
        ];
        $leaveCode = $leaveTypeCodes[$leaveTypeId] ?? 'ERR';
        $lastLeaveEntry = LeaveModel::select('leave_no')
            ->orderByRaw("CAST(RIGHT(leave_no, CHARINDEX('-', REVERSE(leave_no)) - 1) AS INT) DESC")
            ->first();


        if ($lastLeaveEntry) {
            // Extract and increment the numeric part
            $lastLeaveNumber = (int) substr($lastLeaveEntry->leave_no, strrpos($lastLeaveEntry->leave_no, '-') + 1);
            $newLeaveNumber = $lastLeaveNumber;
        } else {
            $newLeaveNumber = 1;
        }
        $newLeaveNo = $leaveCode . '-' . sprintf('%09d', $newLeaveNumber);
        $today = now()->startOfDay();
        $dateFrom = \Carbon\Carbon::parse($request->date_from);
        $isLate = $dateFrom->lt($today) ? "Late Filing" : null;


        $filePaths = [];
        if ($request->hasFile('leave_attach')) {
            foreach ($request->file('leave_attach') as $file) {
                $filename = time() . '-' . $file->getClientOriginalName();
                $path = $file->storeAs('leave_attachments', $filename, 'public');
                $filePaths[] = $path;
            }
        }
        $attachmentsJson = json_encode($filePaths);
        $leave->leave_no = $newLeaveNo;
        $leave->date_from = $request->date_from;
        $leave->date_to = $request->date_to;
        $leave->reason = $request->reason;
        $leave->leave_days = $request->leave_days;
        $leave->halfday = $request->halfday;
        $leave->updated_by = $user;
        $leave->updated_date = Carbon::now();
        $leave->leave_attach = $attachmentsJson;
        $leave->is_late = $isLate;
        $leave->save();
        return redirect()->intended('/Leave_Module/leave_entry');
    }

    public function spoilLeaveRequest(Request $request, $id)
    {
        $spoiledLeaveRequest = LeaveModel::where('leave_id', $id)->where('leave_status_id', 1)->first(); //only pending can be deleted
        $validated = $request->validate([
            'leave_status_id' => 'required|in:4',
        ]);
        $currentUser = Auth::user()->emp_no;
        $spoiledLeaveRequest->update([
            'leave_status_id' => $validated['leave_status_id'],
            'updated_by' => $currentUser,
            'updated_date' => Carbon::now(),
        ]);
        return redirect()->intended('/Leave_Module/leave_entry');
    }

    public function deleteLeaveRequest($id)
    {
        $deleteLeaveRequest = LeaveModel::where('leave_id', $id)->where('leave_status_id', 4)->first(); //only pending can be deleted

        if ($deleteLeaveRequest) {
            $deleteLeaveRequest->delete();
        }
        return redirect()->intended('/Leave_Module/leave_entry');
    }
}
