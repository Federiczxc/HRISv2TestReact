import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

const Navbar = () => {
  const { post } = useForm();
  const { auth } = usePage().props;
  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="">

        {auth.user ? `Welcome, ${auth.user.name}` : null}


      </a>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">

          <li className="nav-item">
            <a className="nav-link" href="/UT_Module/ut_dashboard">Dashboard</a>
          </li>

          <li className="nav-item active">
            <a className="nav-link" href="/UT_Module/ut_entry"> UT Entry</a>
          </li>

          <li className="nav-item active">
            <a className="nav-link" href="/UT_Module/ut_appr_list"> UT Approval</a>
          </li>

          <li className="nav-item active">
            <a className="nav-link" href="/UT_Module/ut_reports_list"> UT Reports</a>
          </li>

          {/* Logout link */}
          {auth.user ? <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={handleLogout}  // Handle logout click
            >
              Logout
            </a>
          </li> : null}


        </ul>
      </div>

    </nav>
  );
};

export default Navbar;
