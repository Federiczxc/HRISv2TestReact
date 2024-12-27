import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import dayjs from 'dayjs';
import { router } from '@inertiajs/react'
import { ActionIcon, Card, Container, Group, Text, Tabs, rem, Title, Table, Textarea, Modal, Box, Button, Select, Pagination, TextInput } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { IconClock, IconEye, IconEdit, IconTrash, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function ot_entry({ OTList, viewOTRequest, spoiledOTList }) {
    const [values, setValues] = useState({
        ot_type_id: '',
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        task_title: '',
        task_done: '',
    });
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(OTList.length / itemsPerPage);
    const paginatedData = OTList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const [activePage2, setActivePage2] = useState(1);
    const itemsPerPage2 = 5;
    const totalPages2 = Math.ceil(spoiledOTList.length / itemsPerPage2);
    const paginatedData2 = spoiledOTList.slice(
        (activePage2 - 1) * itemsPerPage2,
        activePage2 * itemsPerPage2
    );
    const [selectedOT, setSelectedOT] = useState(viewOTRequest);


    const [tabValue, setTabValue] = useState("ot_entry_list");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("ppasok", values);
        router.post('/OT_Module/ot_entry', values, {
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
                setValues('');
                closeForm();

            },
        })
    }

    function handleChange(name, value) {
        setValues((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [name]: value,
            };

            const today = dayjs().startOf('day');  // Today's date without time

            const minDate = today.subtract(1, 'month');

            const dateFrom = updatedValues.date_from && updatedValues.time_from
                ? dayjs(updatedValues.date_from).hour(updatedValues.time_from.split(':')[0]).minute(updatedValues.time_from.split(':')[1])
                : null;

            if (dateFrom && dateFrom.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an OT request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_from = '';
            }

            const dateTo = updatedValues.date_to && updatedValues.time_to
                ? dayjs(updatedValues.date_to).hour(updatedValues.time_to.split(':')[0]).minute(updatedValues.time_to.split(':')[1])
                : null;

            if (dateTo && dateTo.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an OT request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_to = '';
            }



            return updatedValues;
        });
    }

    function handleSelectedOTChange(name, value) {
        setSelectedOT((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [name]: value,
            };

            const today = dayjs().startOf('day');  // Today's date without time
            const minDate = today.subtract(1, 'month');

            const dateFrom = updatedValues.date_from && updatedValues.time_from
                ? dayjs(updatedValues.date_from).hour(updatedValues.time_from.split(':')[0]).minute(updatedValues.time_from.split(':')[1])
                : null;

            if (dateFrom && dateFrom.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an OT request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_from = '';
            }

            const dateTo = updatedValues.date_to && updatedValues.time_to
                ? dayjs(updatedValues.date_to).hour(updatedValues.time_to.split(':')[0]).minute(updatedValues.time_to.split(':')[1])
                : null;

            if (dateTo && dateTo.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an OT request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_to = '';
            }



            return updatedValues;
        });
    }
    function handleSpoil(otId) {
        const updatedValue = {
            ot_status_id: 4
        }
        router.post(`/OT_Module/ot_entry/${otId}`, updatedValue, {
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
    function handleDelete(otId) {
        console.log("del", otId);
        router.delete(`/OT_Module/ot_entry/${otId}`, {
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
        }

        )
    }



    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    const ref2 = useRef(null);
    const pickerControl2 = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref2.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);

    function handleEditSubmit(e) {
        e.preventDefault();

        const updatedFields = {
            ot_no: selectedOT.ot_no,
            date_from: selectedOT.date_from,
            date_to: selectedOT.date_to,
            time_from: selectedOT.time_from,
            time_to: selectedOT.time_to,
            task_title: selectedOT.task_title,
            task_done: selectedOT.task_done,
        }
        router.post('/OT_Module/ot_entry/edit', updatedFields, {
            onError: (errors) => {
                console.error('Submission Errors:', errors);
                notifications.show({
                    title: 'Error',
                    message: 'Failed to edit your request. Please try again.',
                    color: 'red',
                    position: 'top-center',
                    autoClose: 5000,
                });
            },
            onSuccess: () => {
                console.log('Form edited successfully');
                notifications.show({
                    title: 'Success',
                    message: 'Edit Successful.',
                    color: 'green',
                    position: 'top-center',
                    autoClose: 5000,
                })
            }
        });
        setValues(initialFormState);
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

    const handleViewClick = (otId) => {
        const otData = OTList.find((ot) => ot.ot_id === otId);
        setSelectedOT(otData);
        open();
    }

    const handleEditClick = (otId) => {
        const otData = OTList.find((ot) => ot.ot_id === otId);
        setSelectedOT(otData);
        open2();
    }

    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false);
    const [editOpened, setEditOpened] = useState(false);
    const open2 = () => setEditOpened(true);
    const close2 = () => setEditOpened(false);
    const [openedForm, setOpenedForm] = useState(false);
    const openForm = () => setOpenedForm(true);
    const closeForm = () => setOpenedForm(false);
    return (
        <AppLayout>
            <Container fluid className="mt-5">
                <Card withBorder>
                    <Box className="">
                        <Button onClick={() => openForm()} color='green'> Create OT</Button>
                    </Box>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="ot_entry_list">
                                OT Entry List
                            </Tabs.Tab>
                            <Tabs.Tab value="otspoiled">
                                OT Spoiled
                            </Tabs.Tab>
                        </Tabs.List>
                        <Modal size="auto" opened={openedForm} onClose={closeForm} title={<strong>Create OT </strong>} closeOnClickOutside={false} centered>
                            <form onSubmit={handleSubmit}>
                                <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                    <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>
                                        <Select
                                            placeholder="Pick status"
                                            label="Overtime Type"
                                            name="ot_type_id"
                                            value={values.ot_type_id || ''}
                                            onChange={(value) => handleChange('ot_type_id', value)}
                                            data={[
                                                { value: '1', label: 'OVERTIME-IN / OVERTIME-OUT' },
                                                { value: '2', label: 'EARLY TIME-IN / EARLY TIME-OUT' },
                                                { value: '3', label: 'DAY-OFF OVERTIME' },
                                                { value: '4', label: 'LATE FILING' }
                                            ]}
                                        />
                                        <TextInput
                                            required
                                            name="task_title"
                                            value={values.task_title}
                                            label="Task Title"
                                            placeholder="Task Title"
                                            style={{ width: 500 }}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                        <Box style={{ display: "flex", gap: "1rem" }}>
                                            <DateInput
                                                required
                                                name="date_from"
                                                value={values.date_from ? new Date(values.date_from) : null}
                                                label="Date from"
                                                placeholder="Pick date"
                                                rightSection={<IconCalendar />}
                                                style={{ width: 175 }}
                                                onChange={(value) => {
                                                    if (value) {

                                                        const selectedDate = new Date(value);
                                                        const today = new Date();
                                                        const dateTo = new Date(values.date_to);
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

                                                        if (selectedDate > dateTo) {
                                                            handleChange("date_from", dayjs(value).format('YYYY-MM-DD'))

                                                            handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                        } else {
                                                            handleChange("date_from", dayjs(value).format('YYYY-MM-DD'))
                                                            if (!values.date_to) {
                                                                handleChange("date_to", dayjs(value).format('YYYY-MM-DD'));
                                                            }
                                                        }
                                                    } else {
                                                        handleChange("date_from", '');
                                                        handleChange("date_to", '');
                                                    }
                                                }}

                                            />
                                            <DateInput
                                                required
                                                name="date_to"
                                                value={values.date_to ? new Date(values.date_to) : null}
                                                label="Date to"
                                                placeholder="Pick date"
                                                rightSection={<IconCalendar />}
                                                style={{ width: 175 }}
                                                onChange={(value) => {
                                                    if (value) {
                                                        const dateFrom = new Date(values.date_from);
                                                        const selectedDate = new Date(value);
                                                        if (selectedDate < dateFrom) {
                                                            handleChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                            handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))


                                                        } else {
                                                            handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                            if (!values.date_to) {
                                                                handleChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        handleChange("date_to", '');
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box style={{ display: "flex", gap: "1rem" }}>
                                            <TimeInput
                                                required
                                                label="Time From"
                                                name="time_from"
                                                value={values.time_from}
                                                ref={ref}
                                                rightSection={pickerControl}
                                                style={{ width: 175 }}
                                                onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                            <TimeInput label="Time To"
                                                required
                                                name="time_to"
                                                value={values.time_to}
                                                ref={ref2}
                                                rightSection={pickerControl2}
                                                style={{ width: 175 }}
                                                onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                        </Box>
                                        <TextInput
                                            required
                                            label="Task Done"
                                            name="task_done"
                                            value={values.task_done}
                                            placeholder="Task Done"
                                            style={{ width: 500 }}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                    </Box>
                                </Box>
                                <Box style={{ display: "flex", justifyContent: "flex-end" }}><Button color="teal" type="submit"> Submit </Button>
                                </Box>
                            </form>

                        </Modal>
                        <Tabs.Panel value="ot_entry_list">
                            <Card>
                                <Card.Section>
                                    OT Entry List
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th w={75}> Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Time From</Table.Th>
                                            <Table.Th> Time To</Table.Th>
                                            <Table.Th> Task Title</Table.Th>
                                            <Table.Th > Task Done</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Date File</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {OTList && OTList.length > 0 ? (
                                            paginatedData.map((ot) => {
                                                return (
                                                    <Table.Tr key={ot.ot_id}>
                                                        <Table.Td > {ot.ot_no}</Table.Td>
                                                        <Table.Td> {ot.user?.name}</Table.Td>
                                                        <Table.Td> {ot.date_from}</Table.Td>
                                                        <Table.Td> {ot.date_to}</Table.Td>
                                                        <Table.Td> {formatTime(ot.time_from)} </Table.Td>
                                                        <Table.Td> {formatTime(ot.time_to)} </Table.Td>
                                                        <Table.Td> {ot.task_title}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {ot.task_done}</Table.Td>
                                                        <Table.Td> {ot.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(ot.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <ActionIcon onClick={() => handleViewClick(ot.ot_id)} ><IconEye /></ActionIcon>
                                                            {!(ot.ot_status_id === 2 || ot.ot_status_id === 3 || ot.status?.mf_status_name === 'Approved' || ot.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleEditClick(ot.ot_id)} color="yellow" className="ms-2"><IconEdit /></ActionIcon>
                                                            )}
                                                            {!(ot.ot_status_id === 2 || ot.ot_status_id === 3 || ot.status?.mf_status_name === 'Approved' || ot.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleSpoil(ot.ot_id)} color="red" className="ms-2"><IconTrash /></ActionIcon>

                                                            )}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            <p1> Tite </p1>
                                        )}

                                    </Table.Tbody>
                                </Table>
                                <Pagination total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm" />

                                <Modal size="l" opened={opened} onClose={close} title="OT Request Details">
                                    {selectedOT && (
                                        <>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="Reference No." value={selectedOT.ot_no || ''} disabled />
                                                <Select label="OT Status" placeholder={selectedOT.status?.mf_status_name || ''} disabled />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <DateInput label="OT Date From" placeholder={selectedOT.date_from || ''} disabled />
                                                <DateInput label="OT Date To" placeholder={selectedOT.date_to || ''} disabled />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="OT Time From" value={formatTime(selectedOT.time_from) || ''} disabled />
                                                <TextInput label="OT Time To" value={formatTime(selectedOT.time_to) || ''} disabled />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="Task Title" value={selectedOT.task_title || ''} disabled />
                                                <TextInput label="Task Done" value={selectedOT.task_done || ''} disabled />
                                            </Box>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <DateInput label="Date Filed" placeholder={formatDate(selectedOT.created_date) || ''} disabled />
                                            </Box>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }} className="mb-5 " >
                                                <TextInput label="Approved by" placeholder={selectedOT.approver_name || ''} disabled />
                                                <TextInput label="Approved Date" placeholder={selectedOT.approved_date || ''} disabled />
                                            </Box>

                                        </>
                                    )}
                                </Modal>
                                <Modal size="xl" opened={editOpened} onClose={close2} title="Edit Request Details" centered>
                                    <form onSubmit={handleEditSubmit}>
                                        {selectedOT && (
                                            <>
                                                <TextInput
                                                    label="Reference No."
                                                    value={selectedOT.ot_no || ''}
                                                    disabled
                                                />
                                                <Select
                                                    label="OT Status"
                                                    placeholder={selectedOT.status?.mf_status_name || ''}
                                                    disabled
                                                />

                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <DateInput
                                                        name="date_from"
                                                        value={selectedOT.date_from ? new Date(selectedOT.date_from) : null}
                                                        label="Date From"
                                                        placeholder={selectedOT.date_from || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) => {
                                                            if (value) {

                                                                const selectedDate = new Date(value);
                                                                const today = new Date();
                                                                const dateTo = new Date(selectedOT.date_to);
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

                                                                if (selectedDate > dateTo) {
                                                                    handleSelectedOTChange("date_from", dayjs(value).format('YYYY-MM-DD'))

                                                                    handleSelectedOTChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                } else {
                                                                    handleSelectedOTChange("date_from", dayjs(value).format('YYYY-MM-DD'))
                                                                    if (!selectedOT.date_to) {
                                                                        handleSelectedOTChange("date_to", dayjs(value).format('YYYY-MM-DD'));
                                                                    }
                                                                }
                                                            } else {
                                                                handleSelectedOTChange("date_from", '');
                                                                handleSelectedOTChange("date_to", '');
                                                            }
                                                        }}
                                                    />
                                                    <DateInput
                                                        name="date_to"
                                                        value={selectedOT.date_to ? new Date(selectedOT.date_to) : null}
                                                        label="Date To"
                                                        placeholder={selectedOT.date_to || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) => {
                                                            if (value) {
                                                                const dateFrom = new Date(selectedOT.date_from);
                                                                const selectedDate = new Date(value);
                                                                if (selectedDate < dateFrom) {
                                                                    handleSelectedOTChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                    handleSelectedOTChange("date_to", dayjs(value).format('YYYY-MM-DD'))


                                                                } else {
                                                                    handleSelectedOTChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                    if (!selectedOT.date_to) {
                                                                        handleSelectedOTChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                handleSelectedOTChange("date_to", '');
                                                            }
                                                        }}
                                                    />

                                                </Box>

                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <TimeInput
                                                        label="Time From"
                                                        name="time_from"
                                                        value={selectedOT.time_from}
                                                        placeholder={selectedOT.time_from}
                                                        ref={ref}
                                                        rightSection={pickerControl}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) => handleSelectedOTChange('time_from', event.target.value)}
                                                    />
                                                    <TimeInput
                                                        label="Time To"
                                                        name="time_to"
                                                        value={selectedOT.time_to}
                                                        placeholder={selectedOT.time_to}
                                                        ref={ref2}
                                                        rightSection={pickerControl2}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) => handleSelectedOTChange('time_to', event.target.value)}
                                                    />
                                                </Box>


                                                <TextInput
                                                    label="Task Title"
                                                    value={selectedOT.task_title || ''}
                                                    onChange={(e) =>
                                                        setSelectedOT({ ...selectedOT, task_title: e.target.value })
                                                    }
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                <TextInput
                                                    label="Task Done"
                                                    value={selectedOT.task_done || ''}
                                                    onChange={(e) =>
                                                        setSelectedOT({ ...selectedOT, task_done: e.target.value })
                                                    }
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                <Button
                                                    type="submit"
                                                    className="mt-3"
                                                    color="teal"
                                                    style={{ marginTop: '1rem' }}
                                                >
                                                    Submit
                                                </Button>
                                            </>
                                        )}
                                    </form>
                                </Modal>

                            </Card>
                        </Tabs.Panel>
                        <Tabs.Panel value="otspoiled">
                            <Card>
                                <Card.Section>
                                    OT Spoiled
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Time From</Table.Th>
                                            <Table.Th> Time To</Table.Th>
                                            <Table.Th> Task Title</Table.Th>
                                            <Table.Th> Task Done</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Deleted on</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {spoiledOTList && spoiledOTList.length > 0 ? (
                                            paginatedData2.map((ot) => {
                                                return (
                                                    <Table.Tr key={ot.ot_id}>
                                                        <Table.Td> {ot.ot_no}</Table.Td>
                                                        <Table.Td> {ot.user?.name}</Table.Td>
                                                        <Table.Td> {ot.date_from}</Table.Td>
                                                        <Table.Td> {ot.date_to}</Table.Td>
                                                        <Table.Td> {formatTime(ot.time_from)} </Table.Td>
                                                        <Table.Td>  {formatTime(ot.time_to)} </Table.Td>
                                                        <Table.Td> {ot.task_title}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {ot.task_done}</Table.Td>
                                                        <Table.Td> {ot.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(ot.updated_date)}</Table.Td>
                                                        <Table.Td>
                                                            {!(ot.ot_status_id === 2 || ot.ot_status_id === 3 || ot.status?.mf_status_name === 'Approved' || ot.status?.mf_status_name === 'Disapproved') && (
                                                                <Button onClick={() => handleDelete(ot.ot_id)} color="red" className="ms-2"><IconTrash /></Button>
                                                            )}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            <p1> Tite </p1>
                                        )}

                                    </Table.Tbody>
                                    <Pagination total={totalPages2} value={activePage2} onChange={setActivePage2} color="lime.4" mt="sm" />
                                </Table>



                            </Card>
                        </Tabs.Panel>

                    </Tabs>
                </Card>
            </Container>
        </AppLayout >
    )
}