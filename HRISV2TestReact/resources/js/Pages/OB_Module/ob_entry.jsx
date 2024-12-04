import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layout/AppLayout";
import { router } from '@inertiajs/react'
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, Group, Text, Tabs, rem, Table, Image, Textarea, Modal, Box, Button, Input, Select, Pagination, TextInput, SimpleGrid } from '@mantine/core';
import { DateInput, DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock, IconCalendar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';
export default function ob_entry({ OBList, props }) {
    const [files, setFiles] = useState([]);
    const [tabValue, setTabValue] = useState("ob_entry");
    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    const ref2 = useRef(null);
    const pickerControl2 = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref2.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconCalendar style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card>
                    <Tabs color="lime" radius="xs" defaultValue="Entry" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="ob_entry">
                                OB Entry
                            </Tabs.Tab>
                            <Tabs.Tab value="ob_entry_list">
                                OB Entry List
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="ob_entry">

                            <Card.Body>
                                <Card.Title className="mt-3" style={{ color: "gray" }}> Official Business Entry</Card.Title>

                                <Box style={{ display: "flex", flexiwrap: "wrap" }}>
                                    <Box style={{ flex: "1 1 40%", minWidth: "300px" }}>
                                        <TextInput
                                            label="Destination"
                                            placeholder="Destination"
                                            style={{ width: 500 }} />
                                        <Box style={{ display: "flex", gap: "1rem" }}>
                                            <DateInput
                                                label="Date from"
                                                placeholder="Pick date"
                                                rightSection={<IconCalendar />}
                                                style={{ width: 175 }}
                                            />
                                            <DateInput
                                                label="Date to"
                                                rightSection={<IconCalendar />}
                                                placeholder="Pick date"
                                                style={{ width: 175 }}
                                            />
                                        </Box>
                                        <Box style={{ display: "flex", gap: "1rem" }}>
                                            <TimeInput label="Time From" name="ob_timefrom" ref={ref} rightSection={pickerControl} style={{ width: 175 }} />

                                            <TimeInput label="Time To" name="ob_timefrom" ref={ref2} rightSection={pickerControl2} style={{ width: 175 }} />
                                        </Box>
                                        <TextInput
                                            label="Person to Meet"
                                            placeholder="Person to Meet"
                                            style={{ width: 500 }} />
                                        <Textarea label="Purpose" autosize
                                            minRows={2}
                                            maxRows={4}
                                            style={{ width: 500 }} />
                                    </Box>


                                    <Box style={{ flex: "1 1 35%", minWidth: "300px" }}>
                                        <Dropzone
                                            onDrop={setFiles}
                                            onReject={(files) => console.log('rejected files', files)}
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

                                        <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                                            {previews}
                                        </SimpleGrid>

                                    </Box>

                                </Box>

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