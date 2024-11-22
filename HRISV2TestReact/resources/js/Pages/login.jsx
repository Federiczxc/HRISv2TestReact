import React, { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import { router } from '@inertiajs/react'

export default function login() {
    const [values, setValues] = useState({
        name: "",
        password: "",
    });

    function handleChange(e) {
        const {name, value} = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    };

    function handleSubmit(e) {
        e.preventDefault();
        router.post('/login', values)
    }

    return (
        <AppLayout>
        <div className="container d-flex justify-content-center mt-5">
            <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="card-body">
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                name="name"
                                placeholder="Your Name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            <label htmlFor="floatingInput">Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                name="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">
                                Login
                            </button>
                            <a href="/register" className="btn btn-danger">
                                Register
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </AppLayout>
    )
}
