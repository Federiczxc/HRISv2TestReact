import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import dayjs from 'dayjs';

import { useForm, router } from '@inertiajs/react'
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, Group, Text, Tabs, rem, Table, Image, Textarea, Modal, Box, Button, Input, Select, Pagination, TextInput, SimpleGrid, FileInput } from '@mantine/core';
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';

export default function ob_entry({ OBList, viewOBRequest }) {
    const [values, setValues] = useState({
        destination: '',
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        person_to_meet: '',
        ob_purpose: '',
        ob_attach: '',
        ob_days: '',
    });
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(OBList.length / itemsPerPage);
    const paginatedData = OBList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const [selectedOB, setSelectedOB] = useState(viewOBRequest);
    const handleFileChange = (acceptedFiles) => {

        if (acceptedFiles.length > 0) {
            setValues((prevValues) => ({
                ...prevValues,
                ob_attach: acceptedFiles[0],
            }));
            console.log("Att", acceptedFiles[0]);

        }
    };

    const [tabValue, setTabValue] = useState("obentry");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("ppasok", values);
        router.post('/OB_Module/ob_entry', values, {
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
        })
    }
    function handleChange(name, value) { //For inputting date
        setValues((prevValues) => {
            const updatedValues = {

                ...prevValues,
                [name]: value, // Convert ut_date to Date object
            };
            if (updatedValues.date_from && updatedValues.date_to) {
                const dateFrom = dayjs(updatedValues.date_from);
                const dateTo = dayjs(updatedValues.date_to);
                const days_count = dateTo.diff(dateFrom, 'day');
                updatedValues.ob_days = Math.max(days_count, 0);
            }
            return updatedValues;

        });
    }

    function handleDelete(obId) {
        console.log("del", obId);
        router.delete(`/OB_Module/ob_entry/${obId}`, {
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
    const preview = values.ob_attach && values.ob_attach instanceof File ? (
        <Image
            key={values.ob_attach.name}
            src={URL.createObjectURL(values.ob_attach)}
            onLoad={() => URL.revokeObjectURL(values.ob_attach)}
            alt="Preview"
        />
    ) : null;
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    const ref2 = useRef(null);
    const pickerControl2 = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref2.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconCalendar style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);

    function handleEditSubmit(e) {
        e.preventDefault();

        const updatedFields = {
            ob_no: selectedOB.ob_no,
            destination: selectedOB.destination,
            date_from: values.date_from,
            date_to: values.date_to,
            time_from: values.time_from,
            time_to: values.time_to,
            person_to_meet: selectedOB.person_to_meet,
            ob_purpose: selectedOB.ob_purpose,
            ob_days: values.ob_days,
            ob_attach: selectedOB.ob_attach,
        }
        router.post('/OB_Module/ob_entry/edit', updatedFields, {
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

    const handleViewClick = (obId) => {
        const obData = OBList.find((ob) => ob.ob_id === obId);
        setSelectedOB(obData);
        open();
    }

    const handleEditClick = (obId) => {
        const obData = OBList.find((ob) => ob.ob_id === obId);
        setSelectedOB(obData);
        open2();
    }

    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false);
    const [editOpened, setEditOpened] = useState(false);
    const open2 = () => setEditOpened(true);
    const close2 = () => setEditOpened(false);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="obentry">
                                OB Entry
                            </Tabs.Tab>
                            <Tabs.Tab value="ob_entry_list">
                                OB Entry List
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="obentry">

                            <Card.Body>
                                <Card.Title className="mt-3" style={{ color: "gray" }}> Official Business Entry</Card.Title>
                                <form onSubmit={handleSubmit}>
                                    <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                        <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>
                                            <TextInput
                                                name="destination"
                                                value={values.destination}
                                                label="Destination"
                                                placeholder="Destination"
                                                style={{ width: 500 }}
                                                onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                            <Box style={{ display: "flex", gap: "1rem" }}>
                                                <DateInput
                                                    name="date_from"
                                                    value={values.date_from ? new Date(values.date_from) : null}
                                                    label="Date from"
                                                    placeholder="Pick date"
                                                    rightSection={<IconCalendar />}
                                                    style={{ width: 175 }}
                                                    onChange={(value) => handleChange("date_from", dayjs(value).format('YYYY-MM-DD'))}
                                                />
                                                <DateInput
                                                    name="date_to"
                                                    value={values.date_to ? new Date(values.date_to) : null}
                                                    label="Date to"
                                                    placeholder="Pick date"
                                                    rightSection={<IconCalendar />}
                                                    style={{ width: 175 }}
                                                    onChange={(value) => handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))}
                                                />
                                                <TextInput
                                                    label="OB Days"
                                                    name="ob_days"
                                                    value={values.ob_days}
                                                    disabled
                                                    style={{ width: 100 }}
                                                />
                                            </Box>

                                            <Box style={{ display: "flex", gap: "1rem" }}>
                                                <TimeInput
                                                    label="Time From"
                                                    name="time_from"
                                                    value={values.time_from}
                                                    ref={ref}
                                                    rightSection={pickerControl}
                                                    style={{ width: 175 }}
                                                    onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                                <TimeInput label="Time To"
                                                    name="time_to"
                                                    value={values.time_to}
                                                    ref={ref2}
                                                    rightSection={pickerControl2}
                                                    style={{ width: 175 }}
                                                    onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                            </Box>
                                            <TextInput
                                                label="Person to Meet"
                                                name="person_to_meet"
                                                value={values.person_to_meet}
                                                placeholder="Person to Meet"
                                                style={{ width: 500 }}
                                                onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                            <Textarea
                                                label="Purpose"
                                                name="ob_purpose"
                                                value={values.ob_purpose}
                                                autosize
                                                minRows={2}
                                                maxRows={4}
                                                style={{ width: 500 }}
                                                onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                        </Box>


                                        <Box style={{ flex: "1 1 35%", minWidth: "300px" }}>
                                            <Dropzone
                                                onDrop={handleFileChange}
                                                onReject={(ob_attach) => console.log('rejected files', ob_attach)}
                                                maxSize={5 * 1024 ** 2}
                                                style={{ width: 500 }}>
                                                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                                                    <Dropzone.Accept>
                                                        <IconUpload
                                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Accept>
                                                    <Dropzone.Reject>
                                                        <IconX
                                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Reject>
                                                    <Dropzone.Idle>
                                                        <IconPhoto
                                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                                            stroke={1.5}
                                                        />
                                                    </Dropzone.Idle>

                                                    <Box>
                                                        <Text size="xl" inline>
                                                            Drag image or document here
                                                        </Text>
                                                        <Text size="sm" c="dimmed" inline mt={7}>
                                                            Each file should not exceed 5mb. Image will be previewed.
                                                        </Text>
                                                    </Box>
                                                </Group>
                                            </Dropzone>

                                            {preview}

                                        </Box>

                                    </Box>
                                    <Box style={{ display: "flex", justifyContent: "flex-end", marginRight: 90 }}><Button type="submit"> Submit </Button>
                                    </Box>
                                </form>

                            </Card.Body>
                        </Tabs.Panel>
                        <Tabs.Panel value="ob_entry_list">
                            <Card.Body>
                                <Card.Title className="mt-3" style={{ color: "gray" }}>
                                    OB Entry List
                                </Card.Title>
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
                                        {OBList && OBList.length > 0 ? (
                                            paginatedData.map((ob) => {
                                                return (
                                                    <Table.Tr key={ob.ob_id}>
                                                        <Table.Td> {ob.ob_no}</Table.Td>
                                                        <Table.Td> {ob.user?.name}</Table.Td>
                                                        <Table.Td> {ob.date_from} to {ob.date_to}</Table.Td>
                                                        <Table.Td> {formatTime(ob.time_from)} & {formatTime(ob.time_to)}</Table.Td>
                                                        <Table.Td> {ob.destination}</Table.Td>
                                                        <Table.Td> {ob.person_to_meet}</Table.Td>

                                                        <Table.Td> {ob.ob_purpose}</Table.Td>
                                                        <Table.Td> {ob.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(ob.created_date)}</Table.Td>
                                                        <Table.Td>   <Button onClick={() => handleViewClick(ob.ob_id)} className="btn btn-primary btn-sm">View</Button>
                                                            <Button onClick={() => handleEditClick(ob.ob_id)} color="yellow" className="ms-3">Edit</Button>
                                                            <Button onClick={() => handleDelete(ob.ob_id)} color="red" className="ms-3">Delete</Button></Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        ) : (
                                            <p1> Tite </p1>
                                        )}

                                    </Table.Tbody>
                                    <Pagination total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm" />
                                </Table>
                                <Modal size="l" opened={opened} onClose={close} title="OB Request Details" centered>
                                    {selectedOB && (
                                        <>
                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="Reference No." value={selectedOB.ob_no || ''} disabled />
                                                <Select label="OB Status" placeholder={selectedOB.status?.mf_status_name || ''} disabled />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <DateInput label="OB Date From" placeholder={selectedOB.date_from || ''} disabled />
                                                <DateInput label="OB Date To" placeholder={selectedOB.date_to || ''} disabled />
                                                <TextInput
                                                    label="OB Days"
                                                    name="ob_days"
                                                    value={selectedOB.ob_days}
                                                    placeholder={selectedOB.ob_days}
                                                    disabled
                                                    style={{ width: 100 }}
                                                />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="OB Time From" value={formatTime(selectedOB.time_from) || ''} disabled />
                                                <TextInput label="OB Time To" value={formatTime(selectedOB.time_to) || ''} disabled />
                                            </Box>

                                            <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                <TextInput label="Destination" value={selectedOB.destination || ''} disabled />
                                                <TextInput label="Person To Meet" value={selectedOB.person_to_meet || ''} disabled />
                                            </Box>

                                            <TextInput label="Purpose" value={selectedOB.ob_purpose || ''} disabled />
                                            <DateInput label="Date Filed" placeholder={formatDate(selectedOB.created_date) || ''} disabled />

                                            <Box style={{ display: 'flex', gap: '1rem'}}>
                                                <TextInput label="Approved by" placeholder={selectedOB.approved_by || ''} disabled />
                                                <TextInput label="Approved Date" placeholder={selectedOB.approved_by || ''} disabled />
                                            </Box>

                                        </>
                                    )}
                                </Modal>
                                <Modal size="xl" opened={editOpened} onClose={close2} title="Edit Request Details" centered>
                                    <form onSubmit={handleEditSubmit}>
                                        {selectedOB && (
                                            <>
                                                <TextInput
                                                    label="Reference No."
                                                    value={selectedOB.ob_no || ''}
                                                    disabled
                                                />
                                                <Select
                                                    label="OB Status"
                                                    placeholder={selectedOB.status?.mf_status_name || ''}
                                                    disabled
                                                />

                                                {/* Flexbox layout for Date From, Date To, and OB Days */}
                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <DateInput
                                                        name="date_from"
                                                        value={values.date_from ? new Date(values.date_from) : null}
                                                        label="Date From"
                                                        placeholder={selectedOB.date_from || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) =>
                                                            handleChange("date_from", dayjs(value).format('YYYY-MM-DD'))
                                                        }
                                                    />
                                                    <DateInput
                                                        name="date_to"
                                                        value={values.date_to ? new Date(values.date_to) : null}
                                                        label="Date To"
                                                        placeholder={selectedOB.date_to || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) =>
                                                            handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                        }
                                                    />
                                                    <TextInput
                                                        label="OB Days"
                                                        name="ob_days"
                                                        value={values.ob_days}
                                                        placeholder={selectedOB.ob_days}
                                                        disabled
                                                        style={{ width: 100 }}
                                                    />
                                                </Box>

                                                <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <TimeInput
                                                        label="Time From"
                                                        name="time_from"
                                                        value={values.time_from}
                                                        placeholder={selectedOB.time_from}
                                                        ref={ref}
                                                        rightSection={pickerControl}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) =>
                                                            handleChange(event.target.name, event.target.value)
                                                        }
                                                    />
                                                    <TimeInput
                                                        label="Time To"
                                                        name="time_to"
                                                        value={values.time_to}
                                                        placeholder={selectedOB.time_to}
                                                        ref={ref2}
                                                        rightSection={pickerControl2}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) =>
                                                            handleChange(event.target.name, event.target.value)
                                                        }
                                                    />
                                                </Box>

                                                <TextInput
                                                    label="Destination"
                                                    value={selectedOB.destination || ''}
                                                    onChange={(e) =>
                                                        setSelectedOB({ ...selectedOB, destination: e.target.value })
                                                    }
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                <TextInput
                                                    label="Person To Meet"
                                                    value={selectedOB.person_to_meet || ''}
                                                    onChange={(e) =>
                                                        setSelectedOB({ ...selectedOB, person_to_meet: e.target.value })
                                                    }
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                <TextInput
                                                    label="Purpose"
                                                    value={selectedOB.ob_purpose || ''}
                                                    onChange={(e) =>
                                                        setSelectedOB({ ...selectedOB, ob_purpose: e.target.value })
                                                    }
                                                    style={{ marginTop: '1rem' }}
                                                />
                                                <FileInput
                                                    label="Attachment"
                                                    onChange={(file) => setSelectedOB({ ...selectedOB, ob_attach: file })}
                                                    style={{ marginTop: '1rem' }}
                                                    placeholder={selectedOB.ob_attach}
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

                            </Card.Body>
                        </Tabs.Panel>


                    </Tabs>
                </Card>
            </Container>
        </AppLayout >
    )
}