import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Text, Select, Tabs, Table, Pagination } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { Inertia } from '@inertiajs/inertia';
import { modals } from '@mantine/modals';
import { Link } from '@inertiajs/react';
export default function ut_entry({ UTPendingList, UTUpdatedList }) {

    /* UT Pending List Declaration */
    const { data: pendingData,
        current_page: pendingPage,
        last_page: pendingLastPage,
        next_page_url: pendingNextPageUrl,
        prev_page_url: pendingPrevPageUrl } = UTPendingList;


    const [requestData, setRequestData] = useState(pendingData || []);

    useEffect(() => {
        setRequestData(pendingData);
    }, [UTPendingList]);

    /* UT Updated List Declaration */
    const { data: updatedData,
        current_page: updatedPage,
        last_page: updatedLastPage,
        next_page_url: updatedNextPageUrl,
        prev_page_url: updatedPrevPageUrl } = UTUpdatedList;
    const [requestData2, setRequestData2] = useState(updatedData || []);
    useEffect(() => {
        setRequestData2(updatedData);
    }, [UTUpdatedList]);



    const [tabValue, setTabValue] = useState("pending");
    const [editMode, setEditMode] = useState({});



    const handleSaveRow = async (requestID) => {    /* EDIT SAVE */
        const requestToUpdate = requestData.find((utRequest) => utRequest.id === requestID);

        const statusMapping = {
            2: "Approved",
            3: "Rejected",
        };

        if (!requestToUpdate) {
            alert("Not found");
            return;
        }
        const updatedFields = {
            ut_status_id: requestToUpdate.ut_status_id,
            mf_status_name: statusMapping[requestToUpdate.ut_status_id] || "Pending"
        };
        try {

            await axios.post(`/UT_Module/ut_appr_list/edit/${requestID}`, updatedFields);
            setRequestData((prevData) =>
                prevData.filter((utRequest) => utRequest.id !== requestID)
            );
            setRequestData2((prevData) => [
                ...prevData,
                { ...requestToUpdate, ...updatedFields },
            ]);

            setEditMode((prev) => ({ ...prev, [requestID]: false }));

        } catch (error) {
            console.error("Error updating details:", error);
            alert("An error occurred while updating the request.");
        }
    };


    const handleFieldChange = (requestID, field, value) => { /* DROPDOWN VALUE OF MF_STATUS_NAME */
        setRequestData((prevData) =>
            prevData.map((utRequest) =>
                utRequest.id === requestID ? { ...utRequest, [field]: value } : utRequest
            )
        );
        console.log(`huhu ${requestID}: Updated ${field} to ${value}`);
    };

    /* FORMAAAAAAAAAAAAAAAAAAAAT */
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
    /* FORMAAAAAAAAAAAAAAAAT */


    const handleViewClick = (utId) => {
        // Open the modal with the passed UT data
        const utData = UTList.data.find((ut) => ut.id === utId);
        setSelectedUT(utData);
        open();
    }


    /* function handleChange(name, value) {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: name === "ut_date" ? new Date(value) : value, // Convert ut_date to Date object
        }));
    }
*/
    const handlePendingPageChange = async (direction) => {
        const newPageUrl = direction === "next" ? pendingNextPageUrl : pendingPrevPageUrl;
        if (newPageUrl) {
            Inertia.get(newPageUrl, {}, {
                preserveState: true,
                preserveScroll: true,
            })
        }
    }

    const handleUpdatedPageChange = async (direction) => {
        const newPageUrl2 = direction === "next" ? updatedNextPageUrl : updatedPrevPageUrl;
        if (newPageUrl2) {
            Inertia.get(newPageUrl2, {}, {
                preserveState: true,
                preserveScroll: true,
            })
        }

    }
    const openModal = () => modals.openConfirmModal({
        title: 'Please Confirm',
        children: (
            <Text size="sm">
                Are you sure that you want to approve all requests?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: () => handleAction('approve'),
        onCancel: () => console.log('Cancel'),


    });

    const openModal2 = () => modals.openConfirmModal({
        title: 'Please Confirm',
        children: (
            <Text size="sm">
                Are you sure that you want to reject all requests?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: () => handleAction('rejected'),
        onCancel: () => console.log('Cancel'),

    });

    const handleAction = (action) => {

        Inertia.post('ut_appr_list', { action }, {
            onSuccess: () => {
                alert("yaa");
                console.log("puke2", action);

            },
            onError: () => {
                alert("waaa");
                console.log("puke3", action);

            },
        });

    };


    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [editOpened, setEditOpened] = useState(false);
    const open2 = () => setEditOpened(true);
    const close2 = () => setEditOpened(false);
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card className="mt-5">
                    <Tabs color="lime" radius="xs" defaultValue="pending" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="pending">
                                Pending
                                {tabValue}

                            </Tabs.Tab>
                            <Tabs.Tab value="updated">
                                Updated
                            </Tabs.Tab>
                        </Tabs.List>
                        {/* PENDING TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB */}
                        <Tabs.Panel value="pending">
                            <Card.Body>
                                <Card.Title>Undertime Pending List</Card.Title>
                                <div>
                                    <Button onClick={() => openModal()} color='green'> Approve all</Button>
                                    <Button onClick={() => openModal2()} color='red'> Reject all</Button></div>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>UT No</Table.Th>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Date</Table.Th>
                                            <Table.Th>Time</Table.Th>
                                            <Table.Th>Reason</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Date File</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {pendingData && pendingData.length > 0 ?
                                            (
                                                requestData.map((ut) => {

                                                    return (
                                                        <Table.Tr key={ut.id}>
                                                            <Table.Td>{ut.ut_no}</Table.Td>
                                                            <Table.Td>{ut.emp_fullname}</Table.Td>
                                                            <Table.Td>{ut.ut_date}</Table.Td>
                                                            <Table.Td>{formatTime(ut.ut_time)}</Table.Td>
                                                            <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut.ut_reason}</Table.Td>
                                                            <Table.Td>
                                                                {editMode[ut.id] ? (
                                                                    <Form.Select
                                                                        value={requestData.find((utRequest) => utRequest.id === ut.id)?.ut_status_id || ''}
                                                                        onChange={(e) => handleFieldChange(ut.id, 'ut_status_id', e.target.value)}
                                                                    >
                                                                        <option> Please select</option>
                                                                        <option value="2">Approved</option>
                                                                        <option value="3">Rejected</option>
                                                                    </Form.Select>
                                                                ) : (
                                                                    ut.mf_status_name
                                                                )}
                                                            </Table.Td>
                                                            <Table.Td>{formatDate(ut.created_date)}</Table.Td>
                                                            <Table.Td>
                                                                {editMode[ut.id] ?
                                                                    (
                                                                        <>
                                                                            <Button
                                                                                className="btn btn-success btn-sm" color='green'
                                                                                onClick={() => handleSaveRow(ut.id)}
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                className="btn btn-secondary btn-sm" color='gray'
                                                                                onClick={() =>
                                                                                    setEditMode((prev) => ({
                                                                                        ...prev,
                                                                                        [ut.id]: false,
                                                                                    }))
                                                                                }
                                                                                style={{ marginLeft: "10px" }}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </>
                                                                    ) :
                                                                    (
                                                                        <>
                                                                            <Button
                                                                                className="btn btn-warning btn-sm" color='yellow'
                                                                                onClick={() =>
                                                                                    setEditMode((prev) => ({
                                                                                        ...prev,
                                                                                        [ut.id]: true,
                                                                                    }))
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                            <Button onClick={() => handleViewClick(ut.id)} className="btn btn-primary btn-sm">View</Button>
                                                                        </>
                                                                    )
                                                                }
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    );

                                                })
                                            ) : (
                                                <p1> aaaaaaaaaaaaaaaaa</p1>
                                            )}
                                    </Table.Tbody>
                                    {/* Pagination */}
                                </Table>


                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        disabled={!pendingPrevPageUrl}
                                        onClick={() => handlePendingPageChange("prev")}
                                    >
                                        Previous
                                    </Button>
                                    <span>Pagdade {pendingPage} of {pendingLastPage}</span>
                                    <Button
                                        disabled={!pendingNextPageUrl}
                                        onClick={() => handlePendingPageChange("next")}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </Card.Body>
                        </Tabs.Panel>












                        {/* UPDATED TAAAAAAAAAAAAAAAAAAAAAAAAB */}
                        <Tabs.Panel value="updated">
                            <Card.Body>
                                <Card.Title>Undertime Updated List</Card.Title>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>UT No</Table.Th>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Date</Table.Th>
                                            <Table.Th>Time</Table.Th>
                                            <Table.Th>Reason</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Date File</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {requestData2 && requestData2.length > 0 ? (
                                            requestData2.map((ut2) => {
                                                return (
                                                    <Table.Tr key={ut2.id}>
                                                        <Table.Td>{ut2.ut_no}</Table.Td>
                                                        <Table.Td>{ut2.emp_fullname}</Table.Td>
                                                        <Table.Td>{ut2.ut_date}</Table.Td>
                                                        <Table.Td>{formatTime(ut2.ut_time)}</Table.Td>
                                                        <Table.Td>{ut2.ut_reason}</Table.Td>
                                                        <Table.Td>{ut2.mf_status_name}</Table.Td>
                                                        <Table.Td>{formatDate(ut2.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <Button onClick={() => handleViewClick(ut2.id)} className="btn btn-primary btn-sm">View</Button>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            console.log(UTUpdatedList)
                                        )}
                                    </Table.Tbody>
                                    {/* Pagination */}
                                </Table>
                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        disabled={!updatedPrevPageUrl}
                                        onClick={() => handleUpdatedPageChange("prev")}
                                    >
                                        Previous
                                    </Button>
                                    <span>Page {updatedPage} of {updatedLastPage}</span>
                                    <Button
                                        disabled={!updatedNextPageUrl}
                                        onClick={() => handleUpdatedPageChange("next")}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </Card.Body>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Container>
        </AppLayout>
    )
}