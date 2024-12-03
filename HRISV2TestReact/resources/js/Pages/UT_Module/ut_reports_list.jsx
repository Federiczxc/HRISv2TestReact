import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Text, Select, Tabs, Table, Pagination, Input } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';

import { IconClock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function ut_reports_list({ UTReportsList, viewUTReportRequest }) {
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(UTReportsList.length / itemsPerPage);
    const paginatedPage = UTReportsList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );
    console.log(UTReportsList);
    const [selectedUT, setSelectedUT] = useState(viewUTReportRequest);
    const handleViewClick = (utId) => {
        const utData = UTReportsList.find((ut) => ut.id === utId);
        setSelectedUT(utData);
        open();
    }
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false);


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



    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Undertime Reports List</Card.Title>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>UT No</Table.Th>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Time</Table.Th>
                                    <Table.Th>Reason</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Date File</Table.Th>
                                    <Table.Th>Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {UTReportsList && UTReportsList.length > 0 ?
                                    (
                                        paginatedPage.map((ut) => {

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
                                                    </Table.Td>
                                                </Table.Tr>
                                            );

                                        })
                                    ) : (
                                        <p1> Empty data</p1>
                                    )}
                            </Table.Tbody>
                            {/* Pagination */}
                            <Pagination total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm" />
                        </Table>
                        <Modal opened={opened} onClose={close} title="UT Request Details" centered>

                            {selectedUT && (
                                <>
                                    <label>Reference No.</label>
                                    <Input value={selectedUT.ut_no || ''} disabled />

                                    <label>UT Status</label>
                                    <Input
                                        disabled value={selectedUT.mf_status_name || ''}
                                    > </Input>

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
                                    <label>Remarks</label>
                                    <Textarea value={selectedUT.remarks || ''} disabled />
                                </>
                            )}


                        </Modal>


                    </Card.Body>

                </Card>
            </Container >
        </AppLayout >
    )
}