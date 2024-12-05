import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import { router } from '@inertiajs/react'
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Table, Textarea, Modal, Button, Input, Select, Pagination } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { Inertia } from '@inertiajs/inertia';
import { notifications } from '@mantine/notifications';

export default function ut_entry({ UTList, viewUTRequest }) {
    const [values, setValues] = useState({
        ut_date: '',
        ut_time: '',
        ut_reason: '',
    })
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 2;
    const totalPages = Math.ceil(UTList.length / itemsPerPage);
    const paginatedData = UTList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const [selectedUT, setSelectedUT] = useState(viewUTRequest);
    /* const [UTListDisplay, setUTListDisplay] = useState({
        data: UTList,  // Initial empty array for storing the data
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
    });

    console.log(UTListDisplay.data); */
    function handleChange(name, value) {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log('Form Values:', values); // Log the form data
        router.post('/UT_Module/ut_entry', values, {
            onError: (errors) => {
                console.error('Submission Errors:', errors);
                notifications.show({
                    title: 'Error',
                    message: 'Failed to submit your request. Please try again.',
                    color: 'red',
                    position: 'top-center',
                    autoClose: 5000,
                });
            },
            onSuccess: () => {
                console.log('Form submitted successfully');
                notifications.show({
                    title: 'Success',
                    message: 'Entry Successful.',
                    color: 'green',
                    position: 'top-center',
                    autoClose: 5000,
                });
            },
        });
    }

    function handleDelete(utId) {
        router.delete(`/UT_Module/ut_entry/${utId}`, {
            onError: (errors) => {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to delete the entry.',
                    color: 'red',
                    position: 'top-center',
                    autoClose: 5000,
                });
                console.error('Error:', errors);
            },
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Delete Successful.',
                    color: 'green',
                    position: 'top-center',
                    autoClose: 5000,
                });


            },
        });
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        router.post('/UT_Module/ut_entry/edit', {
            ut_no: selectedUT.ut_no,
            ut_date: values.ut_date,
            ut_time: values.ut_time,
            ut_reason: selectedUT.ut_reason,
            OnError: (errors) => {
                console.error('Submission Error', errors);
            },
            OnSuccess: () => {
                console.log('Scucess');

            }
        });
        close2();
    }
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
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleViewClick = (utId) => {
        const utData = UTList.find((ut) => ut.id === utId);
        setSelectedUT(utData);
        open();
    }
    const handleEditClick = (utId) => {
        const utData = UTList.find((ut) => ut.id === utId);
        setSelectedUT(utData);
        open2();
    }

    function handleChange(name, value) { //For inputting date
        setValues((prevValues) => ({
            ...prevValues,
            [name]: name === "ut_date" ? new Date(value) : value, // Convert ut_date to Date object
        }));
    }

    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [editOpened, setEditOpened] = useState(false);
    const open2 = () => setEditOpened(true);
    const close2 = () => setEditOpened(false);
    const { current_page, last_page, next_page_url, prev_page_url } = UTList;
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card>
                    <Card.Title className="ms-3 mt-3" style={{ color: "gray" }}>Undertime Entry</Card.Title>
                    <Card.Body>
                        <form onSubmit={handleSubmit}>
                            <DateInput
                                label="Date"
                                name="ut_date"
                                value={values.ut_date}
                                placeholder="Pick date"
                                onChange={(value) => {
                                    if (value) {
                                        const selectedDate = new Date(value);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        if (selectedDate < today) {
                                            notifications.show({
                                                title: 'Warning',
                                                message: `You are currently late filing a UT Request`,
                                                position: 'top-center',
                                                color: 'yellow',
                                                autoClose: 5000,
                                            })
                                        }
                                        const formattedDate = value.toLocaleDateString('en-CA');
                                        handleChange("ut_date", formattedDate);
                                    } else {
                                        handleChange("ut_date", '');
                                    }
                                }}
                            />
                            <TimeInput
                                label="Time"
                                name="ut_time"
                                value={values.ut_time}
                                ref={ref}
                                rightSection={pickerControl}
                                onChange={(event) => handleChange(event.target.name, event.target.value)}
                                style={{ width: 125 }}
                            />
                            <Textarea
                                label="Reason"
                                name="ut_reason"
                                placeholder=""
                                autosize
                                minRows={2}
                                maxRows={4}
                                value={values.ut_reason}
                                onChange={(event) => handleChange(event.target.name, event.target.value)}
                            />
                            <Button className='mt-3' color='teal' type="submit">Submit</Button>
                        </form>
                    </Card.Body>
                </Card>

                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Undertime List</Card.Title>
                        <Table striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Reference No</Table.Th>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Time</Table.Th>
                                    <Table.Th>Reason</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Date File</Table.Th>
                                    <Table.Th>Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <tbody>
                                {UTList && UTList.length > 0 ? (
                                    paginatedData.map((ut) => {

                                        return (
                                            <Table.Tr key={ut.id}>

                                                <Table.Td>{ut.ut_no}</Table.Td>
                                                <Table.Td>{ut.emp_fullname}</Table.Td>
                                                <Table.Td>{ut.ut_date}</Table.Td>
                                                <Table.Td>{formatTime(ut.ut_time)}</Table.Td>
                                                <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut.ut_reason}</Table.Td>
                                                <Table.Td>{ut.mf_status_name}</Table.Td>
                                                <Table.Td>{formatDate(ut.created_date)}</Table.Td>
                                                <Table.Td>
                                                    <Button onClick={() => handleViewClick(ut.id)} className="btn btn-primary btn-sm">View</Button>
                                                    <Button onClick={() => handleEditClick(ut.id)} color="yellow" className="ms-3">Edit</Button>
                                                    <Button onClick={() => handleDelete(ut.id)} color="red" className="ms-3">Delete</Button>
                                                </Table.Td>
                                            </Table.Tr>
                                        );
                                    })
                                ) : (
                                    <p1> tite</p1>
                                )}
                            </tbody>
                            {/* Pagination */}
                                <Pagination total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm"/>
                        </Table>
                        <Modal opened={opened} onClose={close} title="UT Request Details" centered>
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
                        </Modal>
                        <Modal opened={editOpened} onClose={close2} title="Edit Request Details" centered>
                            <form onSubmit={handleEditSubmit}>


                                {selectedUT && (
                                    <>
                                        <label>Reference No.</label>
                                        <Input value={selectedUT.ut_no || ''} disabled />

                                        <label>UT Status</label>
                                        <Select placeholder={selectedUT.mf_status_name || ''} disabled />

                                        <label>UT Date Requested</label>
                                        <DateInput
                                            name="ut_date"
                                            value={values.ut_date}
                                            placeholder={selectedUT.ut_date || ''}
                                            onChange={(value) => {
                                                if (value) {
                                                    const formattedDate = value.toLocaleDateString('en-CA');
                                                    handleChange("ut_date", formattedDate);
                                                } else {
                                                    handleChange("ut_date", '');
                                                }
                                            }}
                                        />

                                        <label>UT Time Requested</label>

                                        <TimeInput
                                            label="Time"
                                            name="ut_time"
                                            value={values.ut_time}
                                            ref={ref}
                                            rightSection={pickerControl}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)}
                                            style={{ width: 125 }}
                                        />
                                        <label>UT Reason</label>
                                        <Textarea value={selectedUT.ut_reason || ''} onChange={(e) => setSelectedUT({ ...selectedUT, ut_reason: e.target.value })} />
                                        <Button type="submit" className="mt-3" color="teal">Submit</Button>
                                    </>
                                )}
                            </form>
                        </Modal>
          
                    </Card.Body>
                </Card>
            </Container>
        </AppLayout>
    )
}