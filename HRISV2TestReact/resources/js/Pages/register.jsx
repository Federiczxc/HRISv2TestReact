// resources/js/Pages/Register.jsx

import React, { useState } from 'react';

import { Container, Card} from 'react-bootstrap';
import { router } from '@inertiajs/react'

export default function register() {
    const [values, setValues] = useState({
        name: '',
        company: '',
        password: '',
    })

    // Handle input change
    function handleChange(e) {
        const { name, value } = e.target; // Destructure name and value from target
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value, // Update the state by the input name
        }));
    }


    function handleSubmit(e) {
        e.preventDefault()
        router.post('/register', values)
    }

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    
                    

                    <form onSubmit={handleSubmit}>
                        {/* Name input */}
                        <div className="form-floating mb-1">
                            <input type="text" className="form-control" id="floatingInput" name="name" placeholder="name" value={values.name} onChange={handleChange}/>
                                <label htmlFor="floatingInput">Name</label>
                        </div>
                        <div className="form-floating mt-3 mb-3">
                            <select className="form-select" name="company"  value={values.company} onChange={handleChange}>
                                <option value="Roadmax Marketing Corporation">Roadmax Marketing Corporation</option>
                                <option value="TSL Corporation">TSL Corporation</option>
                            </select>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingInput2" name="password" placeholder='password'  value={values.password} onChange={handleChange}/>
                                <label htmlFor="floatingInput3">Password</label>
                        </div>
                        <button className="btn btn-success" type="submit">Submit</button>
                    </form>
                </Card.Body>
            </Card>
        </Container>
    )
}

