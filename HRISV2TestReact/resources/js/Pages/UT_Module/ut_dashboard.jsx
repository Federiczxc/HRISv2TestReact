import AppLayout from "@/Layout/AppLayout";
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { createTheme, MantineProvider } from '@mantine/core';

export default function ut_dashboard({ users, companies, approvers }) {

    const { data, current_page, last_page, next_page_url, prev_page_url } = users;
    const [editMode, setEditMode] = useState({});
    const [userData, setUserData] = useState(data);
    const approverOptions = users.data.filter((user) => user.is_approver === 1);

    useEffect(() => {
        setUserData(users.data,);
    }, [users]);

    const toggleApproverStatus = async (userId, setUserStatus) => {
        console.log(approverOptions);

        try {
            const response = await axios.post(`/UT_Module/ut_dashboard/setApprove/${userId}`, {
                _method: 'POST',
            });
            setUserStatus(Number(response.data.isApprover));
        } catch (error) {
            console.error('Error updating approver status:', error);
            alert('An error occurred while updating the status.');
        }
    };

    const handleSaveRow = async (userId) => {
        const userToUpdate = userData.find((user) => user.id === userId);
        if (!userToUpdate) {
            alert("User not found.");
            return;
        }

        const updatedFields = {
            name: userToUpdate.name,
            company: userToUpdate.company,
            first_appr: userToUpdate.first_appr,
            second_appr: userToUpdate.second_appr,
        };
        try {
            const response = await axios.post(
                `/UT_Module/ut_dashboard/edit/${userId}`,
                updatedFields
            );
            setUserData((prevData) =>
                prevData.map((user) =>
                    user.id === userId
                        ? {
                            ...user,
                            ...updatedFields,
                            first_apprv_name: approvers.find((app) => app.name === updatedFields.first_appr)?.name,
                            sec_apprv2_name: approvers.find((app) => app.name === updatedFields.second_appr)?.name,
                        }
                        : user
                )
            );
            // Update the user data in the state after saving the changes
            /* setUserData((prevData) =>
                prevData.map((user) =>
                    user.id === userId ? { ...user, ...updatedFields } : user
                )
            ); */
            setEditMode((prev) => ({ ...prev, [userId]: false })); // Exit edit mode
            console.log("titietetete" + response.data);

        } catch (error) {
            console.error("Error updating user details:", error);
            alert("An error occurred while updating user details.");
        }
    };

    const handleFieldChange = (userId, field, value) => {
        setUserData((prevData) =>
            prevData.map((user) =>
                user.id === userId ? { ...user, [field]: value } : user
            )
        );
    };

    return (
        <AppLayout>
            <Container className="mt-5">
                <Card>
                    <Card.Body>
                        <Card.Title>Users Dashboard</Card.Title>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Emp No</th>
                                    <th>Company</th>
                                    <th>First Approver</th>
                                    <th>Second Approver</th>
                                    <th>Is Approver?</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((user) => {
                                    const [isApprover, setIsApprover] = useState(Number(user.is_approver));
                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                {editMode[user.id] ? (
                                                    <Form.Control
                                                        type="text"
                                                        value={user.name}
                                                        onChange={(e) => handleFieldChange(user.id, 'name', e.target.value)}
                                                    />
                                                ) : (
                                                    user.name
                                                )}
                                            </td>
                                            <td>{user.emp_no}</td>
                                            <td>
                                                {editMode[user.id] ? (
                                                    <Form.Control
                                                        type="text"
                                                        value={user.company}
                                                        onChange={(e) => handleFieldChange(user.id, 'company', e.target.value)}
                                                    />
                                                ) : (
                                                    user.company
                                                )}
                                            </td>
                                            <td>
                                                {editMode[user.id] ? (
                                                    <Form.Select
                                                        value={user.first_appr}
                                                        onChange={(e) => handleFieldChange(user.id, 'first_appr', e.target.value)}
                                                    >   <option> Please select</option>
                                                        {approvers.map((option) => (
                                                            <option key={option.id} value={option.name}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    user.first_apprv_name
                                                )}
                                            </td>
                                            <td>
                                                {editMode[user.id] ? (
                                                    <Form.Select
                                                        value={user.second_appr}
                                                        onChange={(e) => handleFieldChange(user.id, 'second_appr', e.target.value)}
                                                    > <option> Please select</option>
                                                        {approvers.map((option) => (
                                                            <option key={option.id} value={option.name}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    user.sec_apprv2_name
                                                )}
                                            </td>
                                            <td>{isApprover === 1 ? 'Yes' : 'No'}</td>
                                            <td className="text-center">
                                                {editMode[user.id] ? (
                                                    <>
                                                        <Button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() =>
                                                                handleSaveRow(user.id, {
                                                                    name: user.name,
                                                                    company: user.company,
                                                                    first_appr: user.first_appr,
                                                                    second_appr: user.second_appr,
                                                                })
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() =>
                                                                setEditMode((prev) => ({
                                                                    ...prev,
                                                                    [user.id]: false,
                                                                }))
                                                            }
                                                            style={{ marginLeft: "10px" }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() =>
                                                                setEditMode((prev) => ({
                                                                    ...prev,
                                                                    [user.id]: true,
                                                                }))
                                                            }
                                                        >
                                                            Edit
                                                        </Button>

                                                        {/* Set Approver Button */}
                                                        <Button
                                                            className={`btn btn-sm ${isApprover === 1 ? 'btn-danger' : 'btn-success'}`}
                                                            style={{ color: 'black', width: '155px', marginLeft: '10px' }}
                                                            onClick={() =>
                                                                toggleApproverStatus(user.id, setIsApprover)
                                                            }
                                                        >
                                                            {isApprover === 1 ? 'Unset Approver' : 'Set Approver'}
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        {/* Pagination */}
                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                disabled={!prev_page_url}
                                onClick={() => (window.location.href = prev_page_url)}
                            >
                                Previous
                            </Button>
                            <span>Page {current_page} of {last_page}</span>
                            <Button
                                disabled={!next_page_url}
                                onClick={() => (window.location.href = next_page_url)}
                            >
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </AppLayout>
    );
}
