import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import { useForm, router } from '@inertiajs/react'
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, Group, Text, Tabs, rem, Table, Image, Textarea, Modal, Box, Button, Input, Select, Pagination, TextInput, SimpleGrid } from '@mantine/core';
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';
export default function ob_entry({ OBList }) {
    console.log(OBList);
    const [values, setValues] = useState({
        destination: '',
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        person_to_meet: '',
        ob_purpose: '',
        ob_attach: '',
    });
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
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value, // Convert ut_date to Date object
        }));
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
                                                    onChange={(value) => handleChange("date_from", value.toISOString().split("T")[0])}
                                                />
                                                <DateInput
                                                    name="date_to"
                                                    value={values.date_to ? new Date(values.date_to) : null}
                                                    label="Date to"
                                                    placeholder="Pick date"
                                                    rightSection={<IconCalendar />}
                                                    style={{ width: 175 }}
                                                    onChange={(value) => handleChange("date_to", value.toISOString().split("T")[0])}
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

                                                    <div>
                                                        <Text size="xl" inline>
                                                            Drag image or document here
                                                        </Text>
                                                        <Text size="sm" c="dimmed" inline mt={7}>
                                                            Each file should not exceed 5mb. Image will be previewed.
                                                        </Text>
                                                    </div>
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
                                            <Table.Th> Date</Table.Th>
                                            <Table.Th> Time</Table.Th>
                                            <Table.Th> Destination</Table.Th>
                                            <Table.Th> Purpose</Table.Th>
                                            <Table.Th> Status</Table.Th>
                                            <Table.Th> Date File</Table.Th>
                                            <Table.Th> Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Td> 11111</Table.Td>
                                            <Table.Td> Fed</Table.Td>
                                            <Table.Td> 11-21-24 11-23-24</Table.Td>
                                            <Table.Td> 7:30AM 11:50PM</Table.Td>
                                            <Table.Td> QC</Table.Td>
                                            <Table.Td> atdog</Table.Td>
                                            <Table.Td> Pending</Table.Td>
                                            <Table.Td> 11-20-24</Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Card.Body>
                        </Tabs.Panel>


                    </Tabs>
                </Card>
            </Container>
        </AppLayout >
    )
}