import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React, { useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { router } from '@inertiajs/react'
import { Container, Card, Button, Table, Form } from 'react-bootstrap';
import { ActionIcon, rem, Select, TextInput } from '@mantine/core';
import { DateTimePicker, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import classes from '../../../css/mantine/form.module.css'
export default function ut_entry({ UTList }) {
    const { data, current_page, last_page, next_page_url, prev_page_url } = UTList;
    console.log("tete" + UTList);
    console.log("dada" + data);
    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5}/>
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card>
                    <Card.Title className="ms-3 mt-3" style={{ color: "gray" }}>Undertime Entry</Card.Title>

                    <Card.Body>

                        <TextInput label="tee" placeholder="tite" classNames={classes} />

                        <Select
                            mt="md"
                            comboboxProps={{ withinPortal: true }}
                            data={['React', 'Angular', 'Svelte', 'Vue']}
                            placeholder="Pick one"
                            label="Your favorite library/framework"
                            classNames={classes}
                        />
                        <DateTimePicker clearable label="Pick date and time" placeholder="Pick date and time" />
                        <TimeInput label="Time" ref={ref} rightSection={pickerControl} />

                    </Card.Body>
                </Card>


                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Undertime List</Card.Title>
                        <Table>
                            <thead>

                                <tr>
                                    <th>UT No</th>
                                    <th>Name</th>
                                    <th>Request Date</th>
                                    <th>Request Time</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Date File</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((ut) => (
                                        <tr key={ut.id}>
                                            <td>{ut.ut_no}</td>
                                            <td>{ut.emp_fullname}</td>
                                            <td>{ut.ut_date}</td>
                                            <td>{ut.ut_time}</td>
                                            <td>{ut.ut_reason}</td>
                                            <td>{ut.mf_status_name}</td>
                                            <td>{ut.created_date}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No undertime requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                    </Card.Body>
                </Card>
            </Container>
        </AppLayout>
    )
}