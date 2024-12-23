import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import dayjs from 'dayjs';
import Zoom from "react-medium-image-zoom";
import { useForm, router } from '@inertiajs/react'
import { Form } from 'react-bootstrap';
import { ActionIcon, SimpleGrid, Card, Container, Group, Text, Tabs, rem, Title, Table, Image, Textarea, Modal, Box, Button, Select, Pagination, TextInput, FileInput } from '@mantine/core';
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock, IconEye, IconEdit, IconTrash, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';

export default function ob_entry({ OBList, viewOBRequest, spoiledOBList }) {
    const [values, setValues] = useState({
        destination: '',
        date_from: '',
        date_to: '',
        ob_days: '',
        time_from: '',
        time_to: '',
        person_to_meet: '',
        ob_purpose: '',
        ob_attach: '',
    });
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(OBList.length / itemsPerPage);
    const paginatedData = OBList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const [activePage2, setActivePage2] = useState(1);
    const itemsPerPage2 = 5;
    const totalPages2 = Math.ceil(spoiledOBList.length / itemsPerPage2);
    const paginatedData2 = spoiledOBList.slice(
        (activePage2 - 1) * itemsPerPage2,
        activePage2 * itemsPerPage2
    );
    const [selectedOB, setSelectedOB] = useState(viewOBRequest);


    const [tabValue, setTabValue] = useState("ob_entry_list");

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
                    message: `You cannot file an OB request earlier than ${minDate.format('MMMM D, YYYY')}.`,
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
                    message: `You cannot file an OB request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_to = '';
            }

            if (dateFrom && dateTo) {
                const daysDiff = dateTo.diff(dateFrom, 'days');

                let excludedSundays = 0;
                let currentDate = dateFrom;

                // Loop through the days between dateFrom and dateTo, excluding Sundays
                while (currentDate.isBefore(dateTo) || currentDate.isSame(dateTo, 'day')) {
                    if (currentDate.day() === 0) {
                        excludedSundays++;
                    }
                    currentDate = currentDate.add(1, 'day');
                }

                // Calculate the final days count after excluding Sundays
                let daysCount = Math.max(daysDiff - excludedSundays, 0);

                updatedValues.ob_days = daysCount;
            }

            return updatedValues;
        });
    }

    function handleSelectedOBChange(name, value) {
        setSelectedOB((prevValues) => {
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
                    message: `You cannot file an OB request earlier than ${minDate.format('MMMM D, YYYY')}.`,
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
                    message: `You cannot file an OB request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_to = '';
            }

            if (dateFrom && dateTo) {
                const daysDiff = dateTo.diff(dateFrom, 'days');

                let excludedSundays = 0;
                let currentDate = dateFrom;

                // Loop through the days between dateFrom and dateTo, excluding Sundays
                while (currentDate.isBefore(dateTo) || currentDate.isSame(dateTo, 'day')) {
                    if (currentDate.day() === 0) {
                        excludedSundays++;
                    }
                    currentDate = currentDate.add(1, 'day');
                }

                // Calculate the final days count after excluding Sundays
                let daysCount = Math.max(daysDiff - excludedSundays, 0);

                updatedValues.ob_days = daysCount;
            }

            return updatedValues;
        });
    }
    function handleSpoil(obId) {
        const updatedValue = {
            ob_status_id: 4
        }
        router.post(`/OB_Module/ob_entry/${obId}`, updatedValue, {
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
    const handleFileChange = (acceptedFiles) => {

        if (acceptedFiles.length > 0) {
            setValues((prevValues) => ({
                ...prevValues,
                ob_attach: acceptedFiles,
            }));
            console.log("Att", acceptedFiles);

        }
        else {
            setSelectedOB((prev) => ({
                ...prev,
                ob_attach: [],
            }));
        }
    };
    const handleRemoveFile = (fileToRemove) => {
        setValues((prevValues) => ({
            ...prevValues,
            ob_attach: prevValues.ob_attach.filter((file) => file !== fileToRemove),
        }));
    };


    const preview = values.ob_attach && Array.isArray(values.ob_attach) ? (
        values.ob_attach.map((file) => (
            <Zoom key={`${file.name}-${file.lastModified}`}>

                <Box style={{ alignItems: "center" }}>

                    {file.type.startsWith('image/') ? (
                        <Image
                            w={128}
                            h={128}
                            src={URL.createObjectURL(file)}
                            onLoad={() => URL.revokeObjectURL(file)}
                            alt={`Preview of ${file.name}`}
                        />
                    ) : (
                        <Box style={{ width: 128, height: 128, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text size="xl" color="dimmed">File</Text>
                        </Box>
                    )}
                    <Text truncate style={{ marginTop: '8px', textAlign: 'center' }}>
                        {file.name}
                    </Text>
                    <Button color="red" size="xs" onClick={() => handleRemoveFile(file)}>
                        <IconTrash />
                    </Button>
                </Box>
            </Zoom>

        ))
    ) : null;

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
            ob_no: selectedOB.ob_no,
            destination: selectedOB.destination,
            date_from: selectedOB.date_from,
            date_to: selectedOB.date_to,
            time_from: selectedOB.time_from,
            time_to: selectedOB.time_to,
            person_to_meet: selectedOB.person_to_meet,
            ob_purpose: selectedOB.ob_purpose,
            ob_days: selectedOB.ob_days,
            ob_attach: values.ob_attach,
        }
        console.log("dede", updatedFields.ob_days);
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
    const [openedForm, setOpenedForm] = useState(false);
    const openForm = () => setOpenedForm(true);
    const closeForm = () => setOpenedForm(false);
    return (
        <AppLayout>
            <Container fluid className="mt-3">
                <Card withBorder w={1300}>
                    <Box className="">
                        <Button onClick={() => openForm()} color='green'> Create OB</Button>
                    </Box>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="ob_entry_list">
                                OB Entry List
                            </Tabs.Tab>
                            <Tabs.Tab value="obspoiled">
                                OB Spoiled
                            </Tabs.Tab>
                        </Tabs.List>
                        <Modal size="auto" opened={openedForm} onClose={closeForm} title={<strong>Create OB </strong>} closeOnClickOutside={false} centered>
                            <form onSubmit={handleSubmit}>
                                <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                    <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>
                                        <TextInput
                                            required
                                            name="destination"
                                            value={values.destination}
                                            label="Destination"
                                            placeholder="Destination"
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
                                            < TextInput
                                                label="OB Days"
                                                name="ob_days"
                                                value={values.ob_days}
                                                disabled
                                                style={{ width: 100 }
                                                }
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
                                            label="Person to Meet"
                                            name="person_to_meet"
                                            value={values.person_to_meet}
                                            placeholder="Person to Meet"
                                            style={{ width: 500 }}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                        <Textarea
                                            required
                                            label="Purpose"
                                            name="ob_purpose"
                                            value={values.ob_purpose}
                                            autosize
                                            minRows={2}
                                            maxRows={4}
                                            style={{ width: 500 }}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)} />

                                    </Box>


                                    <Box style={{ flex: "1 1 35%", }}>
                                        <Dropzone
                                            onDrop={handleFileChange}
                                            onReject={(ob_attach) => console.log('rejected files', ob_attach)}
                                            maxSize={5 * 1024 ** 2}
                                            multiple
                                            style={{ width: "100%" }}>
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

                                        <Box>
                                            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                {preview}
                                            </SimpleGrid>
                                        </Box>


                                    </Box>

                                </Box>
                                <Box style={{ display: "flex", justifyContent: "flex-end" }}><Button color="teal" type="submit"> Submit </Button>
                                </Box>
                            </form>

                        </Modal>
                        <Tabs.Panel value="ob_entry_list">
                            <Card>
                                <Card.Section>
                                    OB Entry List
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th w={25}> Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Time From</Table.Th>
                                            <Table.Th> Time To</Table.Th>
                                            <Table.Th> Destination</Table.Th>
                                            <Table.Th w={100}> Person To Meet</Table.Th>
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
                                                        <Table.Td width={150}> {ob.ob_no}</Table.Td>
                                                        <Table.Td> {ob.user?.name}</Table.Td>
                                                        <Table.Td> {ob.date_from}</Table.Td>
                                                        <Table.Td> {ob.date_to}</Table.Td>
                                                        <Table.Td> {formatTime(ob.time_from)} </Table.Td>
                                                        <Table.Td> {formatTime(ob.time_to)} </Table.Td>
                                                        <Table.Td> {ob.destination}</Table.Td>
                                                        <Table.Td> {ob.person_to_meet}</Table.Td>

                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {ob.ob_purpose}</Table.Td>
                                                        <Table.Td> {ob.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(ob.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <ActionIcon onClick={() => handleViewClick(ob.ob_id)} ><IconEye /></ActionIcon>
                                                            {!(ob.ob_status_id === 2 || ob.ob_status_id === 3 || ob.status?.mf_status_name === 'Approved' || ob.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleEditClick(ob.ob_id)} color="yellow" className="ms-2"><IconEdit /></ActionIcon>
                                                            )}
                                                            {!(ob.ob_status_id === 2 || ob.ob_status_id === 3 || ob.status?.mf_status_name === 'Approved' || ob.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleSpoil(ob.ob_id)} color="red" className="ms-2"><IconTrash /></ActionIcon>

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

                                <Modal size="xl" opened={opened} onClose={close} title="OB Request Details">
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

                                            <Box style={{ display: 'flex', gap: '1rem', }} className="mb-5 " >
                                                <TextInput label="Approved by" placeholder={selectedOB.approver_name || ''} disabled />
                                                <TextInput label="Approved Date" placeholder={selectedOB.approved_date || ''} disabled />
                                            </Box>
                                            {
                                                selectedOB.ob_attach && Array.isArray(JSON.parse(selectedOB.ob_attach)) ? (

                                                    <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                        {JSON.parse(selectedOB.ob_attach).map((file, index) => (

                                                            <Box key={index} w={100} style={{ marginBottom: '1rem' }}>
                                                                <Text truncate="start">{file}</Text>
                                                                {file && file.match(/\.(jpeg|jpg|png|gif)$/i) ? (

                                                                    <Zoom>
                                                                        <Image
                                                                            w={128}
                                                                            h={128}
                                                                            src={`/storage/${file}`}
                                                                            alt={`Preview of ${file}`}
                                                                        />
                                                                    </Zoom>

                                                                ) : (
                                                                    <Box style={{ width: 256, height: 256, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text size="xl" color="dimmed">File</Text>
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                        ))}
                                                    </SimpleGrid>

                                                ) : (
                                                    <p>No attachment available.</p>
                                                )
                                            }

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
                                                        value={selectedOB.date_from ? new Date(selectedOB.date_from) : null}
                                                        label="Date From"
                                                        placeholder={selectedOB.date_from || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) => {
                                                            if (value) {

                                                                const selectedDate = new Date(value);
                                                                const today = new Date();
                                                                const dateTo = new Date(selectedOB.date_to);
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
                                                                    handleSelectedOBChange("date_from", dayjs(value).format('YYYY-MM-DD'))

                                                                    handleSelectedOBChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                } else {
                                                                    handleSelectedOBChange("date_from", dayjs(value).format('YYYY-MM-DD'))
                                                                    if (!selectedOB.date_to) {
                                                                        handleSelectedOBChange("date_to", dayjs(value).format('YYYY-MM-DD'));
                                                                    }
                                                                }
                                                            } else {
                                                                handleSelectedOBChange("date_from", '');
                                                                handleSelectedOBChange("date_to", '');
                                                            }
                                                        }}
                                                    />
                                                    <DateInput
                                                        name="date_to"
                                                        value={selectedOB.date_to ? new Date(selectedOB.date_to) : null}
                                                        label="Date To"
                                                        placeholder={selectedOB.date_to || ''}
                                                        rightSection={<IconCalendar />}
                                                        style={{ flex: 1 }}
                                                        onChange={(value) => {
                                                            if (value) {
                                                                const dateFrom = new Date(selectedOB.date_from);
                                                                const selectedDate = new Date(value);
                                                                if (selectedDate < dateFrom) {
                                                                    handleSelectedOBChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                    handleSelectedOBChange("date_to", dayjs(value).format('YYYY-MM-DD'))


                                                                } else {
                                                                    handleSelectedOBChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                    if (!selectedOB.date_to) {
                                                                        handleSelectedOBChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                handleSelectedOBChange("date_to", '');
                                                            }
                                                        }}
                                                    />
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
                                                    <TimeInput
                                                        label="Time From"
                                                        name="time_from"
                                                        value={selectedOB.time_from}
                                                        placeholder={selectedOB.time_from}
                                                        ref={ref}
                                                        rightSection={pickerControl}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) => handleSelectedOBChange('time_from', event.target.value)}
                                                    />
                                                    <TimeInput
                                                        label="Time To"
                                                        name="time_to"
                                                        value={selectedOB.time_to}
                                                        placeholder={selectedOB.time_to}
                                                        ref={ref2}
                                                        rightSection={pickerControl2}
                                                        style={{ flex: 1 }}
                                                        onChange={(event) => handleSelectedOBChange('time_to', event.target.value)}
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
                                                <Box style={{ flex: "1 1 35%", }}>
                                                    <Dropzone
                                                        onDrop={handleFileChange}
                                                        onReject={(ob_attach) => console.log('rejected files', ob_attach)}
                                                        maxSize={5 * 1024 ** 2}
                                                        multiple
                                                        style={{ width: "100%" }}>
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

                                                    <Box>
                                                        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                            {preview}
                                                        </SimpleGrid>
                                                    </Box>


                                                </Box>
                                                {
                                                    selectedOB.ob_attach && Array.isArray(JSON.parse(selectedOB.ob_attach)) ? (

                                                        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                            {JSON.parse(selectedOB.ob_attach).map((file, index) => (

                                                                <Box key={index} w={100} style={{ marginBottom: '1rem' }}>
                                                                    <Text truncate="start">{file}</Text>
                                                                    {file && file.match(/\.(jpeg|jpg|png|gif)$/i) ? (

                                                                        <Zoom>
                                                                            <Image
                                                                                w={128}
                                                                                h={128}
                                                                                src={`/storage/${file}`}
                                                                                alt={`Preview of ${file}`}
                                                                            />
                                                                        </Zoom>

                                                                    ) : (
                                                                        <Box style={{ width: 256, height: 256, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text size="xl" color="dimmed">File</Text>
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                            ))}
                                                        </SimpleGrid>

                                                    ) : (
                                                        <p>No attachment available.</p>
                                                    )
                                                }
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
                        <Tabs.Panel value="obspoiled">
                            <Card>
                                <Card.Section>
                                    OB Spoiled
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Destination</Table.Th>
                                            <Table.Th> Person To Meet</Table.Th>
                                            <Table.Th> Purpose</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Deleted on</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {spoiledOBList && spoiledOBList.length > 0 ? (
                                            paginatedData2.map((ob) => {
                                                return (
                                                    <Table.Tr key={ob.ob_id}>
                                                        <Table.Td> {ob.ob_no}</Table.Td>
                                                        <Table.Td> {ob.user?.name}</Table.Td>
                                                        <Table.Td> {ob.date_from} to {ob.date_to}</Table.Td>
                                                        <Table.Td> {formatTime(ob.time_from)} & {formatTime(ob.time_to)}</Table.Td>
                                                        <Table.Td> {ob.destination}</Table.Td>
                                                        <Table.Td> {ob.person_to_meet}</Table.Td>

                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {ob.ob_purpose}</Table.Td>
                                                        <Table.Td> {ob.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(ob.updated_date)}</Table.Td>
                                                        <Table.Td>
                                                            {!(ob.ob_status_id === 2 || ob.ob_status_id === 3 || ob.status?.mf_status_name === 'Approved' || ob.status?.mf_status_name === 'Disapproved') && (
                                                                <Button onClick={() => handleDelete(ob.ob_id)} color="red" className="ms-2">Delete</Button>

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