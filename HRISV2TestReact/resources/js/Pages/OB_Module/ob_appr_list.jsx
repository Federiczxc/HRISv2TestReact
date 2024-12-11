import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Text, Select, Tabs, Table, Image, Pagination, Input, TextInput, Box } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';

import { IconClock } from '@tabler/icons-react';
import { router } from '@inertiajs/react'
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function ob_appr_list({ OBPendingList, OBUpdatedList, viewOBPendingRequest }) {

    const [requestData, setRequestData] = useState(OBPendingList);
    const [activePendingPage, setActivePendingPage] = useState(1);
    const itemsPerPendingPage = 5;
    const totalPendingPages = Math.ceil(OBPendingList.length / itemsPerPendingPage);
    const paginatedPending = OBPendingList.slice(
        (activePendingPage - 1) * itemsPerPendingPage,
        activePendingPage * itemsPerPendingPage
    );


    useEffect(() => {
        setRequestData(OBPendingList);
    }, [OBPendingList]);
    const [selectedPendingOB, setSelectedPendingOB] = useState(viewOBPendingRequest);
    const handleViewClick = (obId) => {
        const obData = OBPendingList.find((ob) => ob.ob_id === obId);
        setSelectedPendingOB(obData);
        open();
    }
    const handleViewClick2 = (obId) => {
        const obData = OBUpdatedList.find((ob) => ob.ob_id === obId);
        setSelectedPendingOB(obData);
        open2();
    }
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [opened2, setOpened2] = useState(false);
    const open2 = () => setOpened2(true);
    const close2 = () => setOpened2(false)
    const [activeUpdatedPage, setActiveUpdatedPage] = useState(1);
    const itemsPerUpdatedPage = 5;
    const totalUpdatedPages = Math.ceil(OBUpdatedList.length / itemsPerUpdatedPage);
    const paginatedUpdated = OBUpdatedList.slice(
        (activeUpdatedPage - 1) * itemsPerUpdatedPage,
        activeUpdatedPage * itemsPerUpdatedPage
    );


    const [tabValue, setTabValue] = useState("pending");
    const [editMode, setEditMode] = useState({});



    const handleSaveRow = async (requestID) => {    /* EDIT SAVE */
        const requestToUpdate = requestData.find((obRequest) => obRequest.ob_id === requestID);

        /*    const statusMapping = {
               2: "Approved",
               3: "Rejected",
           };
    */
        if (!requestToUpdate.ob_status_id || requestToUpdate.ob_status_id === '1') {
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
            ob_no: requestToUpdate.ob_no,
            ob_status_id: requestToUpdate.ob_status_id,
            /* mf_status_name: statusMapping[requestToUpdate.ut_status_id] || "Pending" */
        };
        try {
            router.post(`/OB_Module/ob_appr_list/edit/${requestID}`, updatedFields, {
                onSuccess: () => {
                    const updatedPendingList = OBPendingList.filter(
                        (obRequest) => obRequest.ob_id !== requestID
                    )
                    const updatedRequest = { ...requestToUpdate, ...updatedFields };
                    const updatedUpdatedList = [...OBUpdatedList, updatedRequest];
                    OBPendingList = updatedPendingList;
                    OBUpdatedList = updatedUpdatedList;
                    setEditMode((prev) => ({ ...prev, [requestID]: false }));
                    notifications.show({
                        title: 'Success',
                        message: `OB Request successfully updated`,
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
            return prevData.map((obRequest) =>
                obRequest.ob_id === requestID ? { ...obRequest, [field]: value } : obRequest
            );
        });
        console.log(`Updated ${field} to ${value} for request ID ${requestID}`);
    };
    function handleEditSubmit(e) {
        e.preventDefault();

        if (!selectedPendingOB.ob_status_id) {
            console.error('OB Status is required.');
            return;
        }

        const updatedFields = {
            ob_no: selectedPendingOB.ob_no,
            ob_status_id: selectedPendingOB.ob_status_id,
            appr_remarks: selectedPendingOB.appr_remarks,
        };
        console.log("updated", updatedFields);
        router.post('/OB_Module/ob_appr_list/edit', updatedFields, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `OB Request successfully updated`,
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
        router.post('ob_appr_list', { action }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `OB Request Batch Update Success`,
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
                                <Card.Title>Official Business Pending List</Card.Title>
                                <Box>
                                    <Button onClick={() => openModal()} color='green'> Approve all</Button>
                                    <Button onClick={() => openModal2()} color='red' ms={10}> Reject all</Button></Box>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> Reference No.</Table.Th>
                                            <Table.Th> Name</Table.Th>
                                            <Table.Th> Date Range</Table.Th>
                                            <Table.Th> Time Range</Table.Th>
                                            <Table.Th> Destination</Table.Th>
                                            <Table.Th> To Meet</Table.Th>
                                            <Table.Th> Purpose</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Date File</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {OBPendingList && OBPendingList.length > 0 ?
                                            (
                                                paginatedPending.map((ob) => {

                                                    return (
                                                        <Table.Tr key={ob.ob_id}>
                                                            <Table.Td>{ob.ob_no}</Table.Td>
                                                            <Table.Td>{ob.user?.name}</Table.Td>
                                                            <Table.Td>{ob.date_from} to {ob.date_to}</Table.Td>
                                                            <Table.Td>{formatTime(ob.time_from)} & {formatTime(ob.time_to)}</Table.Td>
                                                            <Table.Td>{ob.destination}</Table.Td>
                                                            <Table.Td>{ob.person_to_meet}</Table.Td>
                                                            <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ob.ob_purpose}</Table.Td>
                                                            <Table.Td>
                                                                {editMode[ob.ob_id] ? (
                                                                    <Form.Select
                                                                        value={requestData.find((obRequest) => obRequest.ob_id === ob.ob_id)?.ob_status_id || ''}
                                                                        onChange={(e) => handleFieldChange(ob.ob_id, 'ob_status_id', e.target.value)}
                                                                    >
                                                                        <option value=""> Please select</option>
                                                                        <option value="2">Approved</option>
                                                                        <option value="3">Disapproved</option>
                                                                    </Form.Select>
                                                                ) : (
                                                                    ob.status?.mf_status_name
                                                                )}
                                                            </Table.Td>
                                                            <Table.Td>{formatDate(ob.created_date)}</Table.Td>
                                                            <Table.Td>
                                                                {editMode[ob.ob_id] ?
                                                                    (
                                                                        <>
                                                                            <Button
                                                                                className="btn btn-success btn-sm" color='green'
                                                                                onClick={() => handleSaveRow(ob.ob_id)}
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                className="btn btn-secondary btn-sm" color='gray'
                                                                                onClick={() =>
                                                                                    setEditMode((prev) => ({
                                                                                        ...prev,
                                                                                        [ob.ob_id]: false,
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
                                                                                        [ob.ob_id]: true,
                                                                                    }))
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                            <Button onClick={() => handleViewClick(ob.ob_id)} className="btn btn-primary btn-sm">View</Button>
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
                                <Modal size="l" opened={opened} onClose={close} title="OB Request Details">
                                    <form onSubmit={handleEditSubmit}>

                                        {selectedPendingOB && (
                                            <>
                                                <Box style={{ display: 'flex', gap: '1rem' }}>

                                                    <TextInput label="Reference No." value={selectedPendingOB.ob_no || ''} disabled />
                                                    <DateInput
                                                        label="Date Filed"
                                                        placeholder={formatDate(selectedPendingOB.created_date) || ''}
                                                        disabled />
                                                </Box>
                                                <label>OB Status</label>
                                                <Form.Select
                                                    value={selectedPendingOB.ob_status_id || ''}
                                                    onChange={(e) =>
                                                        setSelectedPendingOB({
                                                            ...selectedPendingOB,
                                                            ob_status_id: e.target.value || '',

                                                        })
                                                    }
                                                >
                                                    <option value="">Please select</option>
                                                    <option value="2">Approved</option>
                                                    <option value="3">Rejected</option>
                                                </Form.Select>

                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <DateInput
                                                        label="OB Date From"
                                                        placeholder={selectedPendingOB.date_from || ''}
                                                        disabled />
                                                    <DateInput
                                                        label="OB Date To"
                                                        placeholder={selectedPendingOB.date_to || ''}
                                                        disabled />
                                                    <TextInput
                                                        label="OB Days"
                                                        name="ob_days"
                                                        value={selectedPendingOB.ob_days}
                                                        placeholder={selectedPendingOB.ob_days}
                                                        disabled
                                                        style={{ width: 100 }}
                                                    />
                                                </Box>
                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                                    <TextInput
                                                        label="OB Time Start"
                                                        placeholder={selectedPendingOB.time_from ? formatTime(selectedPendingOB.time_from) : ''}
                                                        disabled />

                                                    <TextInput
                                                        label="OB Time End"
                                                        placeholder={selectedPendingOB.time_to ? formatTime(selectedPendingOB.time_to) : ''}
                                                        disabled />
                                                </Box>

                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                                    <TextInput
                                                        label="Destination"
                                                        placeholder={selectedPendingOB.destination}
                                                        disabled />

                                                    <TextInput
                                                        label="Person To Meet"
                                                        placeholder={selectedPendingOB.person_to_meet}
                                                        disabled />
                                                </Box>


                                                <Textarea label="OB Purpose" value={selectedPendingOB.ob_purpose || ''} disabled />

                                                <Textarea
                                                    label="Remarks"
                                                    value={selectedPendingOB.appr_remarks || ''}
                                                    onChange={(e) => setSelectedPendingOB({ ...selectedPendingOB, appr_remarks: e.target.value })} />
                                                {selectedPendingOB.ob_attach ? (
                                                    <Box w={300}>

                                                        <Text truncate="start">{selectedPendingOB.ob_attach}</Text>
                                                        <Image
                                                            style={{ marginTop: '1rem' }}
                                                            w={256}
                                                            h={256}
                                                            
                                                            src={`/storage/${selectedPendingOB.ob_attach}`}
                                                        />
                                                    </Box>

                                                ) : (
                                                    <p>No attachment available.</p>
                                                )}

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
                                <Card.Title>Official Business Updated List</Card.Title>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> Reference No.</Table.Th>
                                            <Table.Th> Name</Table.Th>
                                            <Table.Th> Date Range</Table.Th>
                                            <Table.Th> Time Range</Table.Th>
                                            <Table.Th> Destination</Table.Th>
                                            <Table.Th> To Meet</Table.Th>
                                            <Table.Th> Purpose</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Date File</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>

                                        {OBUpdatedList && OBUpdatedList.length > 0 ? (

                                            paginatedUpdated.map((ob2) => {
                                                return (
                                                    <Table.Tr key={ob2.ob_id}>
                                                        <Table.Td>{ob2.ob_no}</Table.Td>
                                                        <Table.Td>{ob2.user?.name}</Table.Td>
                                                        <Table.Td>{ob2.date_from} to {ob2.date_to}</Table.Td>
                                                        <Table.Td>{formatTime(ob2.time_from)} & {formatTime(ob2.time_to)}</Table.Td>
                                                        <Table.Td>{ob2.destination}</Table.Td>
                                                        <Table.Td>{ob2.person_to_meet}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ob2.ob_purpose}</Table.Td>
                                                        <Table.Td>{ob2.status?.mf_status_name}</Table.Td>
                                                        <Table.Td>{formatDate(ob2.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <Button onClick={() => handleViewClick2(ob2.ob_id)} className="btn btn-primary btn-sm">View</Button>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            console.log("Updated List line471: ", OBUpdatedList)
                                        )}
                                    </Table.Tbody>
                                    {/* Pagination */}
                                    <Pagination total={totalUpdatedPages} value={activeUpdatedPage} onChange={setActiveUpdatedPage} mt="sm" />
                                </Table>
                                <Modal size="l" opened={opened2} onClose={close2} title="OB Request Details">

                                    {selectedPendingOB && (
                                        <>

                                            <Box style={{ display: 'flex', gap: '1rem', }}>

                                                <TextInput
                                                    label="Reference No"
                                                    value={selectedPendingOB.ob_no || ''}
                                                    disabled />
                                                <DateInput
                                                    label="Date Filed"
                                                    placeholder={formatDate(selectedPendingOB.created_date) || ''}
                                                    disabled />
                                            </Box>
                                            <TextInput
                                                label="OB Status"
                                                disabled
                                                style={{ marginTop: '1rem', gap: '1rem' }}
                                                value={selectedPendingOB.status?.mf_status_name || ''}
                                            />
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <DateInput
                                                    label="OB Date From"
                                                    placeholder={selectedPendingOB.date_from || ''}
                                                    disabled />
                                                <DateInput
                                                    label="OB Date To"
                                                    placeholder={selectedPendingOB.date_to || ''}
                                                    disabled />
                                                <TextInput
                                                    label="OB Days"
                                                    name="ob_days"
                                                    value={selectedPendingOB.ob_days}
                                                    placeholder={selectedPendingOB.ob_days}
                                                    disabled
                                                    style={{ width: 100 }}
                                                />
                                            </Box>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput
                                                    label="OB Time Start"
                                                    placeholder={selectedPendingOB.time_from ? formatTime(selectedPendingOB.time_from) : ''}
                                                    disabled />
                                                <TextInput
                                                    label="OB Time End"
                                                    placeholder={selectedPendingOB.time_to ? formatTime(selectedPendingOB.time_to) : ''}
                                                    disabled />
                                            </Box>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                                <TextInput
                                                    label="Destination"
                                                    placeholder={selectedPendingOB.destination}
                                                    disabled />

                                                <TextInput
                                                    label="Person To Meet"
                                                    placeholder={selectedPendingOB.person_to_meet}
                                                    disabled />
                                            </Box>
                                            <Textarea
                                                label="OB Purpose"
                                                value={selectedPendingOB.ob_purpose || ''}
                                                disabled
                                                style={{ marginTop: '1rem', gap: '1rem' }} />


                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                                <TextInput
                                                    label="Approved by"
                                                    placeholder={selectedPendingOB.approver_name}
                                                    disabled />

                                                <DateInput
                                                    label="Approved Date"
                                                    placeholder={formatDate(selectedPendingOB.approved_date)}
                                                    disabled />
                                            </Box>
                                            <Textarea
                                                label="Remarks"
                                                value={selectedPendingOB.appr_remarks || ''}
                                                disabled
                                            />

                                            {selectedPendingOB.ob_attach ? (
                                                <Box w={300}>

                                                    <Text truncate="start">{selectedPendingOB.ob_attach}</Text>
                                                    <Image
                                                        style={{ marginTop: '1rem' }}
                                                        w={256}
                                                        h={256}
                                                        
                                                        src={`/storage/${selectedPendingOB.ob_attach}`}
                                                    />
                                                </Box>

                                            ) : (
                                                <p>No attachment available.</p>
                                            )}


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