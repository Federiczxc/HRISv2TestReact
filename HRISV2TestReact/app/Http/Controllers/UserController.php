<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /* return view('/login'); */
        return Inertia::render('login');

    }

    public function loginForm()
    {
        /* return view('/login'); */
        return Inertia::render('login');
    }
    public function login(Request $request): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $request->validate([
            'name' => 'required',
            'password' => 'required',
        ]);

        if (Auth::attempt(['name' => $request->name, 'password' => $request->password])) {

            return redirect()->intended('/UT_Module/ut_dashboard');
        }
       
        return Inertia::render('login', [
            'errors' => ['authError' => 'The provided credentials are incorrect.']
        ]);
      
        
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function create()
    {
        return Inertia::render('register');
    }
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required',
            'company' => 'required',
            'password' => 'required|min:4',
        ], [
            'name.required' => 'Name is required',
            'company.required' => 'Company is required',
            'password.required' => 'Password is required',
            'password.min' => 'Password should be at least 4 characters long',
        ]);
        $hashedPassword = bcrypt($request->password);

        // Create the new user
        $user = User::create([
            'emp_no' => 99999,
            'name' => $request->name,
            'company' => $request->company,
            'password' => $hashedPassword, // Ensure the password is hashed
            'created_at' => Carbon::now()
        ]);
        $user->emp_no = $user->id;
        $user->save();
        return redirect('/')->with('success', 'User registered successfully!');
    }

    public function DisplayUTDashboard()
    {
        $users = User::paginate(5);
        $approvers = User::where('is_approver', 1)->get();
        $companies = User::select('company')->distinct()->get();
        return Inertia::render('UT_Module/ut_dashboard', [
            'users' => $users,
            'approvers' => $approvers,
            'company'=> $companies
        ]);
        
    }
    function update(Request $request, $id)
    {

        $currentUser = Auth::user();
        $selectedUser = User::findOrFail($id);

        $name = $request->input('name');
        $firstApprover = $request->input('first_appr');
        $secondApprover = $request->input('second_appr');
        $company = $request->input('company');
        $updatedAt = Carbon::now();

        $firstApproverNo = User::where('name', $firstApprover)->first();
        $secApproverNo = User::where('name', $secondApprover)->first();
        $sel_firstApprvNo = $firstApproverNo ? $firstApproverNo->emp_no : null;
        $sel_secApprvNo = $secApproverNo ? $secApproverNo->emp_no : null;
        
        $selectedUser->update([
            'name' => $name,
            'first_apprv_no' => $sel_firstApprvNo,
            'first_apprv_name' => $firstApprover,
            'sec_apprv2_no' => $sel_secApprvNo,
            'sec_apprv2_name' => $secondApprover,
            'company' => $company,
            'updated_by' => $currentUser->emp_no,
            '
            updated_at' => $updatedAt
        ]);



        return response()->json(['message' => 'User details updated successfully!']);
    }
    public function setApprover(Request $request, $id)
    {
        $currentUser = Auth::user();


        $user = User::findOrFail($id);


        /* $user->is_approver = !$user->is_approver; */
        $user->is_approver = $user->is_approver ? 0 : 1; // Toggle between 0 and 1

        $user->updated_by = $currentUser->emp_no;
        $user->save();


        return response()->json([
            'isApprover' => $user->is_approver, // Return 0 or 1
            'message' => $user->is_approver ? 'User set as approver.' : 'Approver status removed.',
        ]);    }
}
