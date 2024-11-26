import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React, { useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { router } from '@inertiajs/react'
import { Container, Card, Table } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Input, Select, Tabs } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
export default function ut_entry({ UTPendingList, UTUpdatedList }) {
    /* const [selectedUT, setSelectedUT] = useState(viewUTRequest); */
    const handleDelete = (utId) => {
        Inertia.delete(`/UT_Module/ut_entry/${utId}`, {
            preserveState: true, // Prevents full page reload
            onSuccess: () => {
                console.log('Record deleted successfully');
                // Filter out the deleted item from the state
                setUTList((prevUTList) => ({
                    ...prevUTList,
                    data: prevUTList.data.filter((ut) => ut.id !== utId),
                }));
            },
            onError: (error) => {
                console.error('Error deleting record:', error);
            },
        });
    };
    const { data, current_page, last_page, next_page_url, prev_page_url } = UTPendingList;
    const [editMode, setEditMode] = useState({});
    const [requestData, setRequestData] = useState(data);
    const handleSaveRow = async (requestID) => {
        const requestToUpdate = requestData.find((utRequest) => utRequest.id === requestID);
        if (!requestToUpdate) {
            alert("Not found");
            return;
        }
        const updatedFields = {
            mf_status_name: requestToUpdate.mf_status_name,
        };
        try {
            const resposne = await axios.post(`/UT_Module/ut_appr_list/edit/${requestID}`,
                updatedFields
            );
            setRequestData((prevData) =>
                prevData.map((utRequest) =>
                    utRequest.id === requestID
                        ? {
                            ...utRequest,
                            ...updatedFields,
                        }
                        : utRequest));
        } catch (error) {
            console.error("Error updating a details:", error);
            alert("An error occurred while updating user details.");
        }
    };
    const formatTime = (time) => {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const isPM = hours >= 12;
        const hours12 = hours % 12 || 12;
        const period = isPM ? 'PM' : 'AM';
        return `${hours12.toString().padStart(2, '0')}:${minutes} ${period}`;
    };

    const formatDate = (date) => {
        if (!date) return ''; // Return an empty string if no date is provided
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleViewClick = (utId) => {
        // Open the modal with the passed UT data
        const utData = UTList.data.find((ut) => ut.id === utId);
        setSelectedUT(utData);
        open();
    }

    function handleChange(name, value) {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: name === "ut_date" ? new Date(value) : value, // Convert ut_date to Date object
        }));
    }
    const handleFieldChange = (requestID, field, value) => {
        setUserData((prevData) =>
            prevData.map((utRequest) =>
                utRequest.id === requestID ? { ...utRequest, [field]: value } : utRequest
            )
        );
    };
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [editOpened, setEditOpened] = useState(false);
    const open2 = () => setEditOpened(true);
    const close2 = () => setEditOpened(false);
    const { data2, current_page2, last_page2, next_page_url2, prev_page_url2 } = UTUpdatedList;
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card className="mt-5">
                    <Tabs color="lime" radius="xs" defaultValue="pending">
                        <Tabs.List>
                            <Tabs.Tab value="pending">
                                Pending
                            </Tabs.Tab>
                            <Tabs.Tab value="updated">
                                Updated
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* PENDING TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB */}
                        <Tabs.Panel value="pending">
                            <Card.Body>
                                <Card.Title>Undertime Pending List</Card.Title>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>UT No</th>
                                            <th>Name</th>
                                            <th>Request Date</th>
                                            <th>Request Time</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Date File</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data.length > 0 ? (
                                            data.map((ut) => {

                                                return (
                                                    <tr key={ut.id}>

                                                        <td>{ut.ut_no}</td>
                                                        <td>{ut.emp_fullname}</td>
                                                        <td>{ut.ut_date}</td>
                                                        <td>{formatTime(ut.ut_time)}</td>
                                                        <td>{ut.ut_reason}</td>
                                                        <td>
                                                            {editMode[ut.id] ? (
                                                                <Form.Select
                                                                    value={ut.mf_status_name}
                                                                    onChange={(e) => handleFieldChange(ut.id, 'mf_status_name', e.target.value)}
                                                                >   <option value="2">Approved</option>
                                                                    <option value="3">Disapproved</option>

                                                                </Form.Select>
                                                            ) : (
                                                                ut.mf_status_name
                                                            )}
                                                        </td>
                                                        <td>{formatDate(ut.created_date)}</td>
                                                        <td>
                                                            <Button onClick={() => handleViewClick(ut.id)} className="btn btn-primary btn-sm">View</Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <p1> tite</p1>
                                        )}
                                    </tbody>
                                    {/* Pagination */}

                                </Table>
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
                                {/* <Modal opened={opened} onClose={close} title="UT Request Details" centered>
                            {selectedUT && (
                                <>
                                    <label>Reference No.</label>
                                    <Input value={selectedUT.ut_no || ''} disabled />

                                    <label>UT Status</label>
                                    <Select placeholder={selectedUT.mf_status_name || ''} disabled />

                                    <label>UT Date Requested</label>
                                    <DateInput placeholder={selectedUT.ut_date || ''} disabled />

                                    <label>UT Time Requested</label>
                                    <Input placeholder={selectedUT.ut_time ? formatTime(selectedUT.ut_time) : ''} disabled />

                                    <label>UT Reason</label>
                                    <Textarea value={selectedUT.ut_reason || ''} disabled />

                                    <label>Date Filed</label>
                                    <DateInput placeholder={formatDate(selectedUT.created_date) || ''} disabled />

                                    <label>Approved by: </label>
                                    <Input placeholder={selectedUT.approved_by} disabled />

                                    <label>Approved Date: </label>
                                    <DateInput placeholder={formatDate(selectedUT.approved_date)} disabled />
                                </>
                            )}
                        </Modal> */}

                            </Card.Body>
                        </Tabs.Panel>




                        {/* UPDATED TAAAAAAAAAAAAAAAAAAAAAAAAB */}
                        <Tabs.Panel value="updated">
                            <Card.Body>
                                <Card.Title>Undertime Updated List</Card.Title>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>UT No</th>
                                            <th>Name</th>
                                            <th>Request Date</th>
                                            <th>Request Time</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Date File</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data2 && data.length > 0 ? (
                                            data2.map((ut2) => {

                                                return (
                                                    <tr key={ut2.id}>

                                                        <td>{ut2.ut_no}</td>
                                                        <td>{ut2.emp_fullname}</td>
                                                        <td>{ut2.ut_date}</td>
                                                        <td>{formatTime(ut2.ut_time)}</td>
                                                        <td>{ut2.ut_reason}</td>
                                                        <td>{ut2.mf_status_name}</td>
                                                        <td>{formatDate(ut2.created_date)}</td>
                                                        <td>
                                                            <Button onClick={() => handleViewClick(ut2.id)} className="btn btn-primary btn-sm">View</Button>
                                                            {/*  <Button onClick={() => handleEditClick(ut.id)} color="yellow" className="ms-3">Approve</Button>
                                                    <Button onClick={() => handleDelete(ut.id)} color="red" className="ms-3">Reject</Button> */}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <p1> tite</p1>
                                        )}
                                    </tbody>
                                    {/* Pagination */}

                                </Table>
                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        disabled={!prev_page_url2}
                                        onClick={() => (window.location.href = prev_page_url2)}
                                    >
                                        Previous
                                    </Button>
                                    <span>Page {current_page2} of {last_page2}</span>
                                    <Button
                                        disabled={!next_page_url2}
                                        onClick={() => (window.location.href = next_page_url2)}
                                    >
                                        Next
                                    </Button>
                                </div>
                                {/* <Modal opened={opened} onClose={close} title="UT Request Details" centered>
                            {selectedUT && (
                                <>
                                    <label>Reference No.</label>
                                    <Input value={selectedUT.ut_no || ''} disabled />

                                    <label>UT Status</label>
                                    <Select placeholder={selectedUT.mf_status_name || ''} disabled />

                                    <label>UT Date Requested</label>
                                    <DateInput placeholder={selectedUT.ut_date || ''} disabled />

                                    <label>UT Time Requested</label>
                                    <Input placeholder={selectedUT.ut_time ? formatTime(selectedUT.ut_time) : ''} disabled />

                                    <label>UT Reason</label>
                                    <Textarea value={selectedUT.ut_reason || ''} disabled />

                                    <label>Date Filed</label>
                                    <DateInput placeholder={formatDate(selectedUT.created_date) || ''} disabled />

                                    <label>Approved by: </label>
                                    <Input placeholder={selectedUT.approved_by} disabled />

                                    <label>Approved Date: </label>
                                    <DateInput placeholder={formatDate(selectedUT.approved_date)} disabled />
                                </>
                            )}
                        </Modal> */}

                            </Card.Body>
                        </Tabs.Panel>
                    </Tabs>

                </Card>
            </Container>
        </AppLayout>
    )
}