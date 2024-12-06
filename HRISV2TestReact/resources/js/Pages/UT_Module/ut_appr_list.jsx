import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Text, Select, Tabs, Table, Pagination, Input } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';

import { IconClock } from '@tabler/icons-react';
import { router } from '@inertiajs/react'
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function ut_entry({ UTPendingList, UTUpdatedList, viewUTPendingRequest }) {

    /* UT Pending List Declaration */
    /*     const { data: pendingData,
            current_page: pendingPage,
            last_page: pendingLastPage,
            next_page_url: pendingNextPageUrl,
            prev_page_url: pendingPrevPageUrl } = UTPendingList; */


    const [requestData, setRequestData] = useState(UTPendingList);
    const [activePendingPage, setActivePendingPage] = useState(1);
    const itemsPerPendingPage = 5;
    const totalPendingPages = Math.ceil(UTPendingList.length / itemsPerPendingPage);
    const paginatedPending = UTPendingList.slice(
        (activePendingPage - 1) * itemsPerPendingPage,
        activePendingPage * itemsPerPendingPage
    );


    useEffect(() => {
        setRequestData(UTPendingList);
    }, [UTPendingList]);
    const [selectedPendingUT, setSelectedPendingUT] = useState(viewUTPendingRequest);
    const handleViewClick = (utId) => {
        const utData = UTPendingList.find((ut) => ut.id === utId);
        setSelectedPendingUT(utData);
        open();
    }
    const handleViewClick2 = (utId) => {
        const utData = UTUpdatedList.find((ut) => ut.id === utId);
        setSelectedPendingUT(utData);
        open2();
    }
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [opened2, setOpened2] = useState(false);
    const open2 = () => setOpened2(true);
    const close2 = () => setOpened2(false)
    /* UT Updated List Declaration */
    /*  const { data: updatedData,
         current_page: updatedPage,
         last_page: updatedLastPage,
         next_page_url: updatedNextPageUrl,
         prev_page_url: updatedPrevPageUrl } = UTUpdatedList; */
    /*     const [requestData2, setRequestData2] = useState(updatedData || []);
        useEffect(() => {
            setRequestData2(updatedData);
        }, [UTUpdatedList]);
     */
    const [activeUpdatedPage, setActiveUpdatedPage] = useState(1);
    const itemsPerUpdatedPage = 5;
    const totalUpdatedPages = Math.ceil(UTUpdatedList.length / itemsPerUpdatedPage);
    const paginatedUpdated = UTUpdatedList.slice(
        (activeUpdatedPage - 1) * itemsPerUpdatedPage,
        activeUpdatedPage * itemsPerUpdatedPage
    );


    const [tabValue, setTabValue] = useState("pending");
    const [editMode, setEditMode] = useState({});



    const handleSaveRow = async (requestID) => {    /* EDIT SAVE */
        const requestToUpdate = requestData.find((utRequest) => utRequest.id === requestID);

        /*    const statusMapping = {
               2: "Approved",
               3: "Rejected",
           };
    */
        if (!requestToUpdate.ut_status_id || requestToUpdate.ut_status_id === '1') {
            notifications.show({
                title: 'Error',
                message: `Please select a valid option before saving`,
                position: 'top-center',
                color: 'red',
                autoClose: 2000,
            })
            return;
        }
        const updatedFields = {
            ut_status_id: requestToUpdate.ut_status_id,
            /* mf_status_name: statusMapping[requestToUpdate.ut_status_id] || "Pending" */
        };
        try {
            router.post(`/UT_Module/ut_appr_list/edit/${requestID}`, updatedFields, {
                onSuccess: () => {
                    const updatedPendingList = UTPendingList.filter(
                        (utRequest) => utRequest.id !== requestID
                    )
                    const updatedRequest = { ...requestToUpdate, ...updatedFields };
                    const updatedUpdatedList = [...UTUpdatedList, updatedRequest];
                    UTPendingList = updatedPendingList;
                    UTUpdatedList = updatedUpdatedList;
                    setEditMode((prev) => ({ ...prev, [requestID]: false }));
                    notifications.show({
                        title: 'Success',
                        message: `UT Request successfully updated`,
                        position: 'top-center',
                        color: 'green ',
                        autoClose: 2000,
                    })
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message: `Unable to make any changes. Please try again: ${error}`,
                        position: 'top-center',
                        color: 'red ',
                        autoClose: 2000,
                    })
                }
            });


        } catch (error) {
            console.error("Error updating details:", error);
            alert("An error occurred while updating the request.");
        }
    };


    const handleFieldChange = (requestID, field, value) => {
        setRequestData((prevData) => {
            return prevData.map((utRequest) =>
                utRequest.id === requestID ? { ...utRequest, [field]: value } : utRequest
            );
        });
        console.log(`Updated ${field} to ${value} for request ID ${requestID}`);
    };
    function handleEditSubmit(e) {
        e.preventDefault();
    
        if (!selectedPendingUT.ut_status_id) {
            console.error('UT Status is required.');
            return;
        }
    
        const updatedFields = {
            ut_no: selectedPendingUT.ut_no,      
            ut_status_id: selectedPendingUT.ut_status_id,
            remarks: selectedPendingUT.remarks,  
        };
    
        router.post('/UT_Module/ut_appr_list/edit', updatedFields, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `UT Request successfully updated`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message: `Unable to make any changes. Please try again: ${error}`,
                    position: 'top-center',
                    color: 'red ',
                    autoClose: 2000,
                })
            }
        });
    
        // Close the modal after submission
        close();
    }
    
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





    /* function handleChange(name, value) {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: name === "ut_date" ? new Date(value) : value, // Convert ut_date to Date object
        }));
    }
*/

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

    function handleAction(action) {
        router.post('ut_appr_list', { action }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `UT Request Batch Update Success`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })

            },
            onError: () => {
                notifications.show({
                    title: 'Success',
                    message: `Unable to make any changes. Please try again`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })


            },
        });

    };


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
                                    <Button onClick={() => openModal2()} color='red' ms={10}> Reject all</Button></div>
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
                                        {UTPendingList && UTPendingList.length > 0 ?
                                            (
                                                paginatedPending.map((ut) => {

                                                    return (
                                                        <Table.Tr key={ut.id}>
                                                            <Table.Td>{ut.ut_no}</Table.Td>
                                                            <Table.Td>{ut.user?.name}</Table.Td>
                                                            <Table.Td>{ut.ut_date}</Table.Td>
                                                            <Table.Td>{formatTime(ut.ut_time)}</Table.Td>
                                                            <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut.ut_reason}</Table.Td>
                                                            <Table.Td>
                                                                {editMode[ut.id] ? (
                                                                    <Form.Select
                                                                        value={requestData.find((utRequest) => utRequest.id === ut.id)?.ut_status_id || ''}
                                                                        onChange={(e) => handleFieldChange(ut.id, 'ut_status_id', e.target.value)}
                                                                    >
                                                                        <option value=""> Please select</option>
                                                                        <option value="2">Approved</option>
                                                                        <option value="3">Disapproved</option>
                                                                    </Form.Select>
                                                                ) : (
                                                                    ut.status?.mf_status_name
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
                                                <p1> Empty data</p1>
                                            )}
                                    </Table.Tbody>
                                    {/* Pagination */}
                                    <Pagination total={totalPendingPages} value={activePendingPage} onChange={setActivePendingPage} color="lime.4" mt="sm" />
                                </Table>
                                <Modal opened={opened} onClose={close} title="UT Request Details" centered>
                                    <form onSubmit={handleEditSubmit}>

                                        {selectedPendingUT && (
                                            <>
                                                <label>Reference No.</label>
                                                <Input value={selectedPendingUT.ut_no || ''} disabled />

                                                <label>UT Status</label>
                                                <Form.Select
                                                    value={selectedPendingUT.ut_status_id || ''}
                                                    onChange={(e) =>
                                                        setSelectedPendingUT({
                                                            ...selectedPendingUT,
                                                            ut_status_id: e.target.value || '',

                                                        })
                                                    }
                                                >
                                                    <option value="">Please select</option>
                                                    <option value="2">Approved</option>
                                                    <option value="3">Rejected</option>
                                                </Form.Select>

                                                <label>UT Date Requested</label>
                                                <DateInput placeholder={selectedPendingUT.ut_date || ''} disabled />

                                                <label>UT Time Requested</label>
                                                <Input placeholder={selectedPendingUT.ut_time ? formatTime(selectedPendingUT.ut_time) : ''} disabled />

                                                <label>UT Reason</label>
                                                <Textarea value={selectedPendingUT.ut_reason || ''} disabled />

                                                <label>Date Filed</label>
                                                <DateInput placeholder={formatDate(selectedPendingUT.created_date) || ''} disabled />

                                                <label>Approved by: </label>
                                                <Input placeholder={selectedPendingUT.approved_by} disabled />

                                                <label>Approved Date: </label>
                                                <DateInput placeholder={formatDate(selectedPendingUT.approved_date)} disabled />
                                                <label>Remarks</label>
                                                <Textarea value={selectedPendingUT.remarks || ''} onChange={(e) => setSelectedPendingUT({ ...selectedPendingUT, remarks: e.target.value })} />
                                                <Button type="submit" className="mt-3" color="teal"> Submit</Button>
                                            </>
                                        )}
                                    </form>

                                </Modal>


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
                                            <Table.Th>Remarks</Table.Th>
                                            <Table.Th>Date File</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>

                                        {UTUpdatedList && UTUpdatedList.length > 0 ? (

                                            paginatedUpdated.map((ut2) => {
                                                return (
                                                    <Table.Tr key={ut2.id}>
                                                        <Table.Td>{ut2.ut_no}</Table.Td>
                                                        <Table.Td>{ut2.user?.name}</Table.Td>
                                                        <Table.Td>{ut2.ut_date}</Table.Td>
                                                        <Table.Td>{formatTime(ut2.ut_time)}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut2.ut_reason}</Table.Td>
                                                        <Table.Td>{ut2.status?.mf_status_name}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut2.remarks}</Table.Td>
                                                        <Table.Td>{formatDate(ut2.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <Button onClick={() => handleViewClick2(ut2.id)} className="btn btn-primary btn-sm">View</Button>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            console.log(UTUpdatedList)
                                        )}
                                    </Table.Tbody>
                                    {/* Pagination */}
                                    <Pagination total={totalUpdatedPages} value={activeUpdatedPage} onChange={setActiveUpdatedPage} mt="sm" />
                                </Table>
                                <Modal opened={opened2} onClose={close2} title="UT Request Details" centered>

                                    {selectedPendingUT && (
                                        <>
                                            <label>Reference No.</label>
                                            <Input value={selectedPendingUT.ut_no || ''} disabled />

                                            <label>UT Status</label>
                                            <Input
                                                disabled value={selectedPendingUT.status?.mf_status_name || ''}
                                            > </Input>

                                            <label>UT Date Requested</label>
                                            <DateInput placeholder={selectedPendingUT.ut_date || ''} disabled />

                                            <label>UT Time Requested</label>
                                            <Input placeholder={selectedPendingUT.ut_time ? formatTime(selectedPendingUT.ut_time) : ''} disabled />

                                            <label>UT Reason</label>
                                            <Textarea value={selectedPendingUT.ut_reason || ''} disabled />

                                            <label>Date Filed</label>
                                            <DateInput placeholder={formatDate(selectedPendingUT.created_date) || ''} disabled />

                                            <label>Approved by: </label>
                                            <Input placeholder={selectedPendingUT.approved_by} disabled />

                                            <label>Approved Date: </label>
                                            <DateInput placeholder={formatDate(selectedPendingUT.approved_date)} disabled />
                                            <label>Remarks</label>
                                            <Textarea value={selectedPendingUT.remarks || ''} disabled />
                                        </>
                                    )}


                                </Modal>
                            </Card.Body>
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Container>
        </AppLayout>
    )
}