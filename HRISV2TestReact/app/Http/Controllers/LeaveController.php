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
        $leaveList = LeaveModel::with(['user', 'status'])
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
        ]);
        $user = Auth::user();
        $lastLeaveEntry = LeaveModel::orderBy('leave_no', 'desc')->first();
        $newLeaveNo = 'VL-' . sprintf('%09d', optional($lastLeaveEntry)->leave_no ? ((int) str_replace('VL-', '', $lastLeaveEntry->leave_no) + 1) : 1);

        $today = now()->startOfDay(); // Start of today for comparison
        $dateFrom = \Carbon\Carbon::parse($request->date_from);

        $leaveTypeId = $dateFrom->lt($today) ? 7 : 1;
        $filePaths = [];
        if ($request->hasFile('leave_attach')) {
            foreach ($request->file('leave_attach') as $file) {
                $filename = time() . '-' . $file->getClientOriginalName();
                $path = $file->storeAs('leave_attachments', $filename, 'public');
                $filePaths[] = $path;
            }
        }

        // Save file paths as JSON
        $attachmentsJson = json_encode($filePaths);
        LeaveModel::create([
            'leave_status_id' => 1,
            'leave_no' => $newLeaveNo,
            'leave_type_id' => $leaveTypeId,
            'emp_no' => $user->emp_no,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'reason' =>  $request->reason,
            'first_apprv_no' => $user->first_apprv_no,
            'sec_apprv_no' => $user->sec_apprv2_no,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'leave_attach' => $attachmentsJson,
        ]);

        return back()->with('success', 'Official Business Entry created successfully.');
    }
}
