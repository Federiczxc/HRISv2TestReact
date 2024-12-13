import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import { router } from '@inertiajs/react'
import { ActionIcon, Container, Box, Card, rem, Table, Textarea, Modal, Button, Tabs, TextInput, Select, Pagination } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconClock, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function ut_entry({ UTList, viewUTRequest, spoiledUTList }) {
    const [values, setValues] = useState({
        ut_date: '',
        ut_time: '',
        ut_reason: '',
    })
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 7;
    const totalPages = Math.ceil(UTList.length / itemsPerPage);
    const paginatedData = UTList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );
    const [activePage2, setActivePage2] = useState(1);
    const itemsPerPage2 = 7;
    const totalPages2 = Math.ceil(spoiledUTList.length / itemsPerPage2);
    const paginatedData2 = spoiledUTList.slice(
        (activePage2 - 1) * itemsPerPage2,
        activePage2 * itemsPerPage2
    );
    const [tabValue, setTabValue] = useState("utentry");
    const [selectedUT, setSelectedUT] = useState(viewUTRequest);
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
                closeForm();
            },
        });
    }

    function handleSpoil(utId) {
        const updatedValue = {
            ut_status_id: 4
        }
        router.post(`/UT_Module/ut_entry/${utId}`, updatedValue, {
            OnError: (errors) => {
                notifications.show({
                    title: 'Error',
                    message: `Failed to delete the entry: ${errors} `,
                    color: 'red',
                    position: 'top-center',
                    autoClose: 5000,
                });
                console.error('Submission Error', errors);
            },

            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Delete Success! You may check it in Spoiled Tab',
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
                notifications.show({
                    title: 'Error',
                    message: `Failed to delete the entry: ${errors} `,
                    color: 'red',
                    position: 'top-center',
                    autoClose: 5000,
                });
                console.error('Submission Error', errors);
            },

            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Edit Success!',
                    color: 'green',
                    position: 'top-center',
                    autoClose: 5000,
                });


            },


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
    const [openedForm, setOpenedForm] = useState(false);
    const openForm = () => setOpenedForm(true);
    const closeForm = () => setOpenedForm(false);
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container fluid className="mt-3">
                <Modal opened={openedForm} onClose={closeForm} title={<strong>Create UT </strong>} closeOnClickOutside={false} centered>

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
                            rightSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5}/>}
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

                </Modal>

                <Card withBorder className="mt-5">
                    <Box className="">
                        <Button onClick={() => openForm()} color='green'> Create UT</Button>
                    </Box>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="utentry">
                                UT Entry
                            </Tabs.Tab>
                            <Tabs.Tab value="utspoiled">
                                UT Spoiled
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="utentry">

                            <Card>
                                <Card.Section className="">Undertime List</Card.Section>

                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th w={70}>Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th>UT Date</Table.Th>
                                            <Table.Th>UT Time</Table.Th>
                                            <Table.Th>Reason</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Date File</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {UTList && UTList.length > 0 ? (
                                            paginatedData.map((ut) => {

                                                return (
                                                    <Table.Tr key={ut.id}>

                                                        <Table.Td>{ut.ut_no}</Table.Td>
                                                        <Table.Td>{ut.user?.name}</Table.Td>
                                                        <Table.Td>{ut.ut_date}</Table.Td>
                                                        <Table.Td>{formatTime(ut.ut_time)}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut.ut_reason}</Table.Td>
                                                        <Table.Td>{ut.status?.mf_status_name}</Table.Td>
                                                        <Table.Td>{formatDate(ut.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <ActionIcon onClick={() => handleViewClick(ut.id)} className="mt-2"><IconEye /></ActionIcon>
                                                            {!(ut.ut_status_id === 2 || ut.ut_status_id === 3 || ut.status?.mf_status_name === 'Approved' || ut.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleEditClick(ut.id)} color="lime" className="ms-2"><IconEdit /></ActionIcon>

                                                            )}
                                                            {!(ut.ut_status_id === 2 || ut.ut_status_id === 3 || ut.status?.mf_status_name === 'Approved' || ut.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleSpoil(ut.id)} color="red" className="ms-2"><IconTrash /></ActionIcon>


                                                            )}

                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            <p1> tite</p1>
                                        )}
                                        <Pagination w={200} total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm" />
                                    </Table.Tbody>
                                    {/* Pagination */}


                                </Table>
                                <Modal opened={opened} onClose={close} title="UT Request Details" centered>
                                    {selectedUT && (
                                        <>
                                            <TextInput label="Reference No." value={selectedUT.ut_no || ''} disabled />
                                            <Select label="UT Status" placeholder={selectedUT.status?.mf_status_name || ''} disabled />

                                            <DateInput label="UT Date Requested" placeholder={selectedUT.ut_date || ''} disabled />

                                            <TextInput label="UT Time Requested" placeholder={selectedUT.ut_time ? formatTime(selectedUT.ut_time) : ''} disabled />
                                            <Textarea label="UT Reason" value={selectedUT.ut_reason || ''} disabled />

                                            <DateInput label="Date Filed" placeholder={formatDate(selectedUT.created_date) || ''} disabled />

                                            <TextInput label="Approved by" placeholder={selectedUT.approver_name} disabled />

                                            <DateInput label="Approved Date" placeholder={formatDate(selectedUT.approved_date)} disabled />
                                        </>
                                    )}
                                </Modal>
                                <Modal opened={editOpened} onClose={close2} title="Edit Request Details" centered>
                                    <form onSubmit={handleEditSubmit}>


                                        {selectedUT && (
                                            <>
                                                <TextInput label="Reference No." value={selectedUT.ut_no || ''} disabled />

                                                <Select label="UT Status" placeholder={selectedUT.status?.mf_status_name || ''} disabled />

                                                <DateInput
                                                    label="Date"
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

                                                <TimeInput
                                                    label="Time"
                                                    name="ut_time"
                                                    value={values.ut_time}
                                                    ref={ref}
                                                    rightSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5}/>}
                                                    onChange={(event) => handleChange(event.target.name, event.target.value)}
                                                    style={{ width: 125 }}
                                                />
                                                <Textarea label="UT Reason" value={selectedUT.ut_reason || ''} onChange={(e) => setSelectedUT({ ...selectedUT, ut_reason: e.target.value })} />
                                                <Button type="submit" className="mt-3" color="teal">Submit</Button>
                                            </>
                                        )}
                                    </form>
                                </Modal>

                            </Card>
                        </Tabs.Panel>
                        <Tabs.Panel value="utspoiled">
                            <Card>
                                <Card.Section>Undertime List</Card.Section>
                                <Table striped>
                                    <Table.Thead>
                                    <Table.Tr>
                                            <Table.Th w={70}>Reference No.</Table.Th>
                                            <Table.Th>Employee Name</Table.Th>
                                            <Table.Th>UT Date</Table.Th>
                                            <Table.Th>UT Time</Table.Th>
                                            <Table.Th>Reason</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Date File</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {spoiledUTList && spoiledUTList.length > 0 ? (
                                            paginatedData2.map((ut2) => {

                                                return (
                                                    <Table.Tr key={ut2.id}>

                                                        <Table.Td>{ut2.ut_no}</Table.Td>
                                                        <Table.Td>{ut2.user?.name}</Table.Td>
                                                        <Table.Td>{ut2.ut_date}</Table.Td>
                                                        <Table.Td>{formatTime(ut2.ut_time)}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{ut2.ut_reason}</Table.Td>
                                                        <Table.Td>{ut2.status?.mf_status_name}</Table.Td>
                                                        <Table.Td>{formatDate(ut2.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <ActionIcon onClick={() => handleViewClick(ut2.id)} ><IconEye /></ActionIcon>
                                                            <ActionIcon onClick={() => handleDelete(ut2.id)} color="red" className="ms-2"><IconTrash /></ActionIcon>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            <p1> tite</p1>
                                        )}
                                    <Pagination w={200}  total={totalPages2} value={activePage2} onChange={setActivePage2} color="red.4" mt="sm" />

                                    </Table.Tbody>
                                    {/* Pagination */}

                                </Table>
                                <Modal opened={opened} onClose={close} title="UT Request Details" centered>
                                    {selectedUT && (
                                        <>
                                            <TextInput label="Reference No." value={selectedUT.ut_no || ''} disabled />
                                            <Select label="UT Status" placeholder={selectedUT.status?.mf_status_name || ''} disabled />

                                            <DateInput label="UT Date Requested" placeholder={selectedUT.ut_date || ''} disabled />

                                            <TextInput label="UT Time Requested" placeholder={selectedUT.ut_time ? formatTime(selectedUT.ut_time) : ''} disabled />
                                            <Textarea label="UT Reason" value={selectedUT.ut_reason || ''} disabled />

                                            <DateInput label="Date Filed" placeholder={formatDate(selectedUT.created_date) || ''} disabled />

                                            <TextInput label="Approved by" placeholder={selectedUT.approver_name} disabled />

                                            <DateInput label="Approved Date" placeholder={formatDate(selectedUT.approved_date)} disabled />
                                        </>
                                    )}
                                </Modal>
                            </Card>
                        </Tabs.Panel>
                    </Tabs>

                </Card>
            </Container>
        </AppLayout>
    )
}