import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import dayjs from 'dayjs';
import Zoom from "react-medium-image-zoom";
import { router } from '@inertiajs/react'
import { ActionIcon, SimpleGrid, Card, Container, Group, Text, Radio, Tabs, rem, Title, Table, Image, Textarea, Modal, Box, Button, Select, Pagination, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconClock, IconEye, IconEdit, IconTrash, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';

export default function leave_entry({ LeaveList, viewLeaveRequest, spoiledLeaveList }) {
    const [values, setValues] = useState({
        leave_type_id: '',
        date_from: '',
        date_to: '',
        halfday: '',
        leave_days: '',
        reason: '',
        leave_attach: '',
    });
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(LeaveList.length / itemsPerPage);
    const paginatedData = LeaveList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const [activePage2, setActivePage2] = useState(1);
    const itemsPerPage2 = 5;
    const totalPages2 = Math.ceil(spoiledLeaveList.length / itemsPerPage2);
    const paginatedData2 = spoiledLeaveList.slice(
        (activePage2 - 1) * itemsPerPage2,
        activePage2 * itemsPerPage2
    );
    const [selectedLeave, setSelectedLeave] = useState(viewLeaveRequest);


    const [tabValue, setTabValue] = useState("leave_entry_list");
    function validateForm() {
        const isSameDate = values.date_from && values.date_to && values.date_from === values.date_to;
        if (isSameDate && !values.halfday) {
            notifications.show({
                title: 'Halfday Required',
                message: 'Please select either AM or PM for halfday.',
                position: 'top-center',
                color: 'red',
                autoClose: 5000,
            });
            return false; // Stop form submission
        }
        const validateSickLeaveFile = () => {
            if (values.leave_type_id === '2' && values.leave_days >= 3) {
                return !Array.isArray(values.leave_attach) || values.leave_attach.length === 0;
            }
            return false;
        };
        const sickLeaveFileError = validateSickLeaveFile();
        if (sickLeaveFileError) {
            notifications.show({
                title: 'File Attachment Required',
                message: 'For Sick Leave with 3 or more leave days, a file attachment is required.',
                position: 'top-center',
                color: 'red',
                autoClose: 5000,
            });
            return false; // Stop form submission
        }
        return true;
    }
    function handleSubmit(e) {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;
        console.log("ppasok", values);
        router.post('/Leave_Module/leave_entry', values, {
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

            const today = dayjs().startOf('day');

            const minDate = today.subtract(1, 'month');

            const dateFrom = updatedValues.date_from
                ? dayjs(updatedValues.date_from)
                : null;

            if (dateFrom && dateFrom.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an leave request earlier than ${minDate.format('MMMM D, YYYY')}.`,
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

                updatedValues.date_from = '';
            }

            const dateTo = updatedValues.date_to
                ? dayjs(updatedValues.date_to)
                : null;

            if (dateTo && dateTo.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file a leave request earlier than ${minDate.format('MMMM D, YYYY')}.`,
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

                while (currentDate.isBefore(dateTo) || currentDate.isSame(dateTo, 'day')) {
                    if (currentDate.day() === 0) {
                        excludedSundays++;
                    }
                    currentDate = currentDate.add(1, 'day');
                }

                let daysCount = Math.max(daysDiff - excludedSundays, 0);

                updatedValues.leave_days = daysCount;
            }

            return updatedValues;
        });
    }

    function handleSelectedLeaveChange(name, value) {
        setSelectedLeave((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [name]: value,
            };

            const today = dayjs().startOf('day');
            const minDate = today.subtract(1, 'month');
            const calculateVacationMinDate = () => {
                let daysBefore = 0;
                let currentDate = dayjs().startOf('day');

                while (daysBefore < 4) {
                    currentDate = currentDate.add(1, 'day');
                    if (currentDate.day() !== 0) { // Exclude Sundays
                        daysBefore++;
                    }
                }

                return currentDate;
            };
            const dateFrom = updatedValues.date_from
                ? dayjs(updatedValues.date_from)
                : null;

            const dateTo = updatedValues.date_to
                ? dayjs(updatedValues.date_to)
                : null;
            if (updatedValues.leave_type_id === '1' && dateFrom) {
                const vacationMinDate = calculateVacationMinDate();

                if (dateFrom.isBefore(vacationMinDate, 'day')) {
                    notifications.show({
                        title: 'Invalid Date',
                        message: 'Vacation Leave must be at least 4 working days before the selected date, excluding Sundays.',
                        position: 'top-center',
                        color: 'red',
                        autoClose: 5000,
                    });

                    updatedValues.date_from = '';
                    updatedValues.date_to = '';
                }
            }

            const isSameDate = dateFrom && dateTo && dateFrom.isSame(dateTo, 'day');
            if (isSameDate && !updatedValues.halfday) {
                notifications.show({
                    title: 'Halfday Required',
                    message: 'Please select either AM or PM for halfday.',
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });

            }

            if (!isSameDate && updatedValues.halfday) {
                updatedValues.halfday = null;
            }

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

            console.log("half", updatedValues.halfday);

            if (dateTo && dateTo.isBefore(minDate, 'day')) {
                notifications.show({
                    title: 'Error',
                    message: `You cannot file an leave request earlier than ${minDate.format('MMMM D, YYYY')}.`,
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

                while (currentDate.isBefore(dateTo) || currentDate.isSame(dateTo, 'day')) {
                    if (currentDate.day() === 0) {
                        excludedSundays++;
                    }
                    currentDate = currentDate.add(1, 'day');
                }

                let daysCount = Math.max(daysDiff - excludedSundays, 0);

                updatedValues.leave_days = daysCount;
            }

            return updatedValues;
        });
    }
    function handleSpoil(leaveId) {
        const updatedValue = {
            leave_status_id: 4
        }
        router.post(`/Leave_Module/leave_entry/${leaveId}`, updatedValue, {
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
    function handleDelete(leaveId) {
        console.log("del", leaveId);
        router.delete(`/Leave_Module/leave_entry/${leaveId}`, {
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
                leave_attach: acceptedFiles,
            }));
            console.log("Att", acceptedFiles);

        }
        else {
            setSelectedLeave((prev) => ({
                ...prev,
                leave_attach: [],
            }));
        }
    };
    const handleRemoveFile = (fileToRemove) => {
        setValues((prevValues) => ({
            ...prevValues,
            leave_attach: prevValues.leave_attach.filter((file) => file !== fileToRemove),
        }));
    };


    const preview = values.leave_attach && Array.isArray(values.leave_attach) ? (
        values.leave_attach.map((file) => (
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
            leave_no: selectedLeave.leave_no,
            leave_type_id: selectedLeave.leave_type_id,
            date_from: selectedLeave.date_from,
            date_to: selectedLeave.date_to,
            halfday: selectedLeave.halfday,
            leave_days: selectedLeave.leave_days,
            reason: selectedLeave.reason,
            leave_attach: values.leave_attach,
        }
        if (updatedFields.leave_type_id === '2' && updatedFields.leave_days >= 3) {
            if (!Array.isArray(updatedFields.leave_attach) || updatedFields.leave_attach.length === 0) {
                notifications.show({
                    title: 'File Attachment Required',
                    message: 'For Sick Leave with 3 or more leave days, a file attachment is required.',
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });
                updatedFields.leave_attach = [];
                return false;

            }
        }
        router.post('/Leave_Module/leave_entry/edit', updatedFields, {
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
                close2();
                setValues(prevValues => ({
                    ...prevValues,      // Spread the previous state
                    leave_attach: null  // Set leave_attach to null
                }));

            }
        });

    }


    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleViewClick = (leaveId) => {
        const leaveData = LeaveList.find((leave) => leave.leave_id === leaveId);
        setSelectedLeave(leaveData);
        open();
    }

    const handleEditClick = (leaveId) => {
        const leaveData = LeaveList.find((leave) => leave.leave_id === leaveId);
        setSelectedLeave(leaveData);
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
    const calculateMinDate = () => {
        let minDate = new Date();
        let workingDaysCount = 0;

        // Add 4 working days excluding Sundays
        while (workingDaysCount < 4) {
            minDate.setDate(minDate.getDate() + 1);
            if (minDate.getDay() !== 0) {  // Skip Sunday (day 0)
                workingDaysCount++;
            }
        }
        return minDate;
    };
    useEffect(() => {
        if (values.leave_type_id === '1' && values.date_from) {
            const selectedDate = new Date(values.date_from);
            const minDate = calculateMinDate();

            if (selectedDate < minDate) {
                notifications.show({
                    title: 'Invalid Date',
                    message: 'Vacation Leave must be at least 4 working days before the selected date, excluding Sundays.',
                    position: 'top-center',
                    color: 'red',
                    autoClose: 5000,
                });
                handleChange("date_from", '');
                handleChange("date_to", '');
            }
        }
    }, [values.leave_type_id, values.date_from]);



    return (
        <AppLayout>
            <Container fluid className="mt-5">
                <Card withBorder>
                    <Box className="">
                        <Button onClick={() => openForm()} color='green'> Create Leave</Button>
                    </Box>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="leave_entry_list">
                                Leave Entry List
                            </Tabs.Tab>
                            <Tabs.Tab value="leavespoiled">
                                Leave Spoiled
                            </Tabs.Tab>
                        </Tabs.List>
                        <Modal size="auto" opened={openedForm} onClose={closeForm} title={<strong>Create Leave </strong>} closeOnClickOutside={false} centered>
                            <form onSubmit={handleSubmit}>
                                <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                    <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>
                                        <Select
                                            placeholder="Pick status"
                                            label="Leave Type"
                                            name="leave_type_id"
                                            value={values.leave_type_id || ''}
                                            onChange={(value) => handleChange('leave_type_id', value)}
                                            data={[
                                                { value: '1', label: 'Vacation Leave' },
                                                { value: '2', label: 'Sick Leave' },
                                                { value: '3', label: 'Maternity Leave' },
                                                { value: '4', label: 'Paternity Leave' },
                                                { value: '5', label: 'Magna Carta Leave' },
                                                { value: '6', label: 'Solo Parent Leave' },
                                                { value: '8', label: 'Emergency Leave' },
                                                { value: '9', label: 'Birthday Leave' },
                                                { value: '10', label: 'Flood Leave' }
                                            ]}
                                            style={{ width: 366 }}
                                        />
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
                                                        today.setHours(0, 0, 0, 0);
                                                        const dateTo = new Date(values.date_to);

                                                        const minDate = new Date(today);
                                                        let workingDaysCount = 0;
                                                        while (workingDaysCount < 4) {
                                                            minDate.setDate(minDate.getDate() + 1);
                                                            if (minDate.getDay() !== 0) {
                                                                workingDaysCount++;
                                                            }
                                                        }

                                                        if (values.leave_type_id === '1' && selectedDate < minDate) {
                                                            notifications.show({
                                                                title: 'Invalid Date',
                                                                message: 'Vacation Leave must be at least 4 working days before the selected date, excluding Sundays.',
                                                                position: 'top-center',
                                                                color: 'red',
                                                                autoClose: 5000,
                                                            });
                                                            handleChange("date_from", '');
                                                            handleChange("date_to", '');

                                                        } else {
                                                            handleChange("date_from", dayjs(value).format('YYYY-MM-DD'));

                                                            // Ensure date_to is synced if not already set
                                                            if (!values.date_to) {
                                                                handleChange("date_to", dayjs(value).format('YYYY-MM-DD'));
                                                            }

                                                            // Check if the date_from is a past date (late filing)
                                                            if (selectedDate < today) {
                                                                notifications.show({
                                                                    title: 'Warning',
                                                                    message: `You are currently late filing a Leave Request.`,
                                                                    position: 'top-center',
                                                                    color: 'yellow',
                                                                    autoClose: 5000,
                                                                });
                                                            }
                                                            if (selectedDate > dateTo) {
                                                                handleChange("date_from", dayjs(value).format('YYYY-MM-DD'))

                                                                handleChange("date_to", dayjs(value).format('YYYY-MM-DD'))
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


                                                        }
                                                        else {
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


                                            <Radio.Group
                                                name="halfday"
                                                label="Halfday"
                                                value={values.halfday}
                                                onChange={(value) => handleChange('halfday', value)}
                                                disabled={values.date_from !== values.date_to || !values.date_from || !values.date_to}

                                            >
                                                <Group >
                                                    <Radio value="AM" label="AM" disabled={values.date_from !== values.date_to || !values.date_from || !values.date_to} />
                                                    <Radio value="PM" label="PM" disabled={values.date_from !== values.date_to || !values.date_from || !values.date_to} />
                                                </Group>
                                            </Radio.Group>
                                            < TextInput
                                                label="Leave Days"
                                                name="leave_days"
                                                size="sm"
                                                value={values.leave_days}
                                                disabled
                                                style={{ width: 100 }
                                                }
                                            />
                                        </Box>
                                        <Textarea
                                            required
                                            label="Reason For Leave"
                                            name="reason"
                                            value={values.reason}
                                            placeholder=""
                                            style={{ width: 300 }}
                                            onChange={(event) => handleChange(event.target.name, event.target.value)} />
                                    </Box>
                                    <Box style={{ flex: "1 1 35%", marginLeft: 10 }}>
                                        <Dropzone
                                            onDrop={handleFileChange}
                                            onReject={(leave_attach) => console.log('rejected files', leave_attach)}
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
                        <Tabs.Panel value="leave_entry_list">
                            <Card>
                                <Card.Section>
                                    Leave Entry List
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th w={75}> Reference No.</Table.Th>
                                            <Table.Th> Leave Type</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Leave Days</Table.Th>
                                            <Table.Th> Reason</Table.Th>
                                            <Table.Th w={80}> Half Day</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Date File</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {LeaveList && LeaveList.length > 0 ? (
                                            paginatedData.map((leave) => {
                                                return (
                                                    <Table.Tr key={leave.leave_id}>
                                                        <Table.Td > {leave.leave_no}</Table.Td>
                                                        <Table.Td> {leave.leavetype?.leave_type_name}</Table.Td>
                                                        <Table.Td> {leave.user?.name}</Table.Td>
                                                        <Table.Td> {leave.date_from}</Table.Td>
                                                        <Table.Td> {leave.date_to}</Table.Td>
                                                        <Table.Td style={{ textAlign: "center" }}> {leave.leave_days}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {leave.reason}</Table.Td>
                                                        <Table.Td style={{ textAlign: "center" }}> {leave.halfday}</Table.Td>
                                                        <Table.Td> {leave.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(leave.created_date)}</Table.Td>
                                                        <Table.Td>
                                                            <ActionIcon onClick={() => handleViewClick(leave.leave_id)} ><IconEye /></ActionIcon>
                                                            {!(leave.leave_status_id === 2 || leave.leave_status_id === 3 || leave.status?.mf_status_name === 'Approved' || leave.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleEditClick(leave.leave_id)} color="yellow" className="ms-2"><IconEdit /></ActionIcon>
                                                            )}
                                                            {!(leave.leave_status_id === 2 || leave.leave_status_id === 3 || leave.status?.mf_status_name === 'Approved' || leave.status?.mf_status_name === 'Disapproved') && (
                                                                <ActionIcon onClick={() => handleSpoil(leave.leave_id)} color="red" className="ms-2"><IconTrash /></ActionIcon>

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

                                <Modal size="l" opened={opened} onClose={close} title="Leave Request Details">
                                    {selectedLeave && (
                                        <>
                                            <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                                <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>

                                                    <TextInput label="Reference No." value={selectedLeave.leave_no || ''} disabled />
                                                    <Select label="Leave Status" placeholder={selectedLeave.status?.mf_status_name || ''} disabled />
                                                    <Select
                                                        label="Leave Type"
                                                        name="leave_type_id"
                                                        placeholder={selectedLeave.leavetype?.leave_type_name || ''} disabled />


                                                    <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                        <DateInput label="Date From" placeholder={selectedLeave.date_from || ''} disabled />
                                                        <DateInput label="Date To" placeholder={selectedLeave.date_to || ''} disabled />
                                                    </Box>
                                                    <Box style={{ display: "flex", gap: "1rem" }}>

                                                        {
                                                            selectedLeave.halfday && (
                                                                <TextInput
                                                                    label="Half day"
                                                                    value={selectedLeave.halfday || ''}
                                                                    disabled
                                                                />
                                                            )
                                                        }

                                                        <TextInput
                                                            label="Leave Days"
                                                            name="leave_days"
                                                            size="sm"
                                                            value={selectedLeave.leave_days}
                                                            disabled
                                                            style={{ width: 100 }
                                                            }
                                                        />
                                                    </Box>
                                                    <Textarea label="Reason For Leave" value={selectedLeave.reason || ''} disabled />
                                                </Box>
                                                <Box style={{ flex: "1 1 35%", marginLeft: 10 }}>
                                                    <DateInput label="Date Filed" placeholder={formatDate(selectedLeave.created_date) || ''} disabled />
                                                    {
                                                        selectedLeave.approved_date && selectedLeave.approver_name && (
                                                            <>
                                                                <TextInput label="Approved by" placeholder={selectedLeave.approver_name || ''} disabled />
                                                                <TextInput label="Approved Date" placeholder={selectedLeave.approved_date || ''} disabled />
                                                            </>
                                                        )
                                                    }

                                                    <Box >


                                                        {
                                                            selectedLeave.leave_attach && Array.isArray(JSON.parse(selectedLeave.leave_attach)) ? (

                                                                <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                                    {JSON.parse(selectedLeave.leave_attach).map((file, index) => (

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


                                                    </Box>
                                                </Box>

                                            </Box>
                                        </>
                                    )}
                                </Modal>
                                <Modal size="auto" opened={editOpened} onClose={close2} title="Edit Request Details" centered>
                                    <form onSubmit={handleEditSubmit}>
                                        {selectedLeave && (
                                            <>
                                                <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                                    <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>

                                                        <TextInput
                                                            label="Reference No."
                                                            value={selectedLeave.leave_no || ''}
                                                            disabled
                                                        />
                                                        <Select
                                                            label="Leave Status"
                                                            placeholder={selectedLeave.status?.mf_status_name || ''}
                                                            disabled
                                                        />
                                                        <Select
                                                            placeholder="Pick status"
                                                            label="Leave Type"
                                                            name="leave_type_id"
                                                            value={selectedLeave.leave_type_id || ''}
                                                            onChange={(value) => handleSelectedLeaveChange('leave_type_id', value)}
                                                            data={[
                                                                { value: '1', label: 'Vacation Leave' },
                                                                { value: '2', label: 'Sick Leave' },
                                                                { value: '3', label: 'Maternity Leave' },
                                                                { value: '4', label: 'Paternity Leave' },
                                                                { value: '5', label: 'Magna Carta Leave' },
                                                                { value: '6', label: 'Solo Parent Leave' },
                                                                { value: '8', label: 'Emergency Leave' },
                                                                { value: '9', label: 'Birthday Leave' },
                                                                { value: '10', label: 'Flood Leave' }
                                                            ]}
                                                            style={{ width: 366 }}
                                                        />
                                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                            <DateInput
                                                                name="date_from"
                                                                value={selectedLeave.date_from ? new Date(selectedLeave.date_from) : null}
                                                                label="Date From"
                                                                placeholder={selectedLeave.date_from || ''}
                                                                rightSection={<IconCalendar />}
                                                                style={{ flex: 1 }}
                                                                onChange={(value) => {
                                                                    if (value) {

                                                                        const selectedDate = new Date(value);
                                                                        const today = new Date();
                                                                        const dateTo = new Date(selectedLeave.date_to);
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
                                                                            handleSelectedLeaveChange("date_from", dayjs(value).format('YYYY-MM-DD'))

                                                                            handleSelectedLeaveChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                        } else {
                                                                            handleSelectedLeaveChange("date_from", dayjs(value).format('YYYY-MM-DD'))
                                                                            if (!selectedLeave.date_to) {
                                                                                handleSelectedLeaveChange("date_to", dayjs(value).format('YYYY-MM-DD'));
                                                                            }
                                                                        }
                                                                    } else {
                                                                        handleSelectedLeaveChange("date_from", '');
                                                                        handleSelectedLeaveChange("date_to", '');
                                                                    }
                                                                }}
                                                            />
                                                            <DateInput
                                                                name="date_to"
                                                                value={selectedLeave.date_to ? new Date(selectedLeave.date_to) : null}
                                                                label="Date To"
                                                                placeholder={selectedLeave.date_to || ''}
                                                                rightSection={<IconCalendar />}
                                                                style={{ flex: 1 }}
                                                                onChange={(value) => {
                                                                    if (value) {
                                                                        const dateFrom = new Date(selectedLeave.date_from);
                                                                        const selectedDate = new Date(value);
                                                                        if (selectedDate < dateFrom) {
                                                                            handleSelectedLeaveChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                            handleSelectedLeaveChange("date_to", dayjs(value).format('YYYY-MM-DD'))


                                                                        } else {
                                                                            handleSelectedLeaveChange("date_to", dayjs(value).format('YYYY-MM-DD'))
                                                                            if (!selectedLeave.date_to) {
                                                                                handleSelectedLeaveChange("date_from", dayjs(value).format('YYYY-MM-DD'));
                                                                            }
                                                                        }
                                                                    }
                                                                    else {
                                                                        handleSelectedLeaveChange("date_to", '');
                                                                    }
                                                                }}
                                                            />

                                                        </Box>
                                                        <Box style={{ display: "flex", gap: "1rem" }}>


                                                            <Radio.Group
                                                                name="halfday"
                                                                label="Halfday"
                                                                value={selectedLeave.halfday}
                                                                onChange={(value) => handleSelectedLeaveChange('halfday', value)}
                                                                disabled={selectedLeave.date_from !== selectedLeave.date_to || !selectedLeave.date_from || !selectedLeave.date_to}

                                                            >
                                                                <Group >
                                                                    <Radio value="AM" label="AM" disabled={selectedLeave.date_from !== selectedLeave.date_to || !selectedLeave.date_from || !selectedLeave.date_to} />
                                                                    <Radio value="PM" label="PM" disabled={selectedLeave.date_from !== selectedLeave.date_to || !selectedLeave.date_from || !selectedLeave.date_to} />
                                                                </Group>
                                                            </Radio.Group>
                                                            <TextInput
                                                                label="Leave Days"
                                                                name="leave_days"
                                                                size="sm"
                                                                value={selectedLeave.leave_days}
                                                                disabled
                                                                style={{ width: 100 }
                                                                }
                                                            />
                                                        </Box>
                                                        <Textarea
                                                            label="Reason For Leave"
                                                            value={selectedLeave.reason || ''}
                                                            onChange={(e) =>
                                                                setSelectedLeave({ ...selectedLeave, reason: e.target.value })
                                                            }
                                                            style={{ marginTop: '1rem' }}
                                                        />
                                                    </Box>
                                                    <Box style={{ flex: "1 1 35%", marginLeft: 10 }}>
                                                        <Dropzone
                                                            onDrop={handleFileChange}
                                                            onReject={(leave_attach) => console.log('rejected files', leave_attach)}
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
                                                            {
                                                                selectedLeave.leave_attach && Array.isArray(JSON.parse(selectedLeave.leave_attach)) ? (

                                                                    <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
                                                                        {JSON.parse(selectedLeave.leave_attach).map((file, index) => (

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
                                                        </Box>


                                                    </Box>


                                                </Box>

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
                        <Tabs.Panel value="leavespoiled">
                            <Card>
                                <Card.Section>
                                    Leave Spoiled
                                </Card.Section>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> Reference No.</Table.Th>
                                            <Table.Th> Employee Name</Table.Th>
                                            <Table.Th> Date From</Table.Th>
                                            <Table.Th> Date To</Table.Th>
                                            <Table.Th> Halfday</Table.Th>
                                            <Table.Th> Reason</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Deleted on</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {spoiledLeaveList && spoiledLeaveList.length > 0 ? (
                                            paginatedData2.map((leave) => {
                                                return (
                                                    <Table.Tr key={leave.leave_id}>
                                                        <Table.Td> {leave.leave_no}</Table.Td>
                                                        <Table.Td> {leave.user?.name}</Table.Td>
                                                        <Table.Td> {leave.date_from}</Table.Td>
                                                        <Table.Td> {leave.date_to}</Table.Td>
                                                        <Table.Td> {leave.halfday}</Table.Td>
                                                        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}> {leave.reason}</Table.Td>
                                                        <Table.Td> {leave.status?.mf_status_name}</Table.Td>
                                                        <Table.Td> {formatDate(leave.updated_date)}</Table.Td>
                                                        <Table.Td>
                                                            {!(leave.leave_status_id === 2 || leave.leave_status_id === 3 || leave.status?.mf_status_name === 'Approved' || leave.status?.mf_status_name === 'Disapproved') && (
                                                                <Button onClick={() => handleDelete(leave.leave_id)} color="red" className="ms-2"><IconTrash /></Button>
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