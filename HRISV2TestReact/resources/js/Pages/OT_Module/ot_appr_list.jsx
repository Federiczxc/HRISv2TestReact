import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import { ActionIcon, rem, Textarea, Modal, Button, Text, Select, Stack, Divider, Title, Flex, Tabs, Table, Image, Pagination, Input, TextInput, Box } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import {
    flexRender,
    MRT_GlobalFilterTextInput,
    MRT_TablePagination,
    MRT_ToolbarAlertBanner,
    useMantineReactTable,
    MRT_TableBodyCellValue,
    MantineReactTable,
} from 'mantine-react-table'
import { IconClock, IconEdit, IconEye } from '@tabler/icons-react';
import { router } from '@inertiajs/react'
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import Zoom from "react-medium-image-zoom";

export default function ot_appr_list({ OTPendingList, OTUpdatedList, apprvID, viewOTPendingRequest }) {
    const pendingData = OTPendingList;
    const [requestData, setRequestData] = useState(OTPendingList);
    const updatedData = OTUpdatedList
    const [requestData2, setRequestData2] = useState(OTUpdatedList);
    const [activePendingPage, setActivePendingPage] = useState(1);
    const itemsPerPendingPage = 5;
    const totalPendingPages = Math.ceil(OTPendingList.length / itemsPerPendingPage);
    const paginatedPending = OTPendingList.slice(
        (activePendingPage - 1) * itemsPerPendingPage,
        activePendingPage * itemsPerPendingPage
    );


    useEffect(() => {
        setRequestData(OTPendingList);
    }, [OTPendingList]);

    useEffect(() => {
        setRequestData2(OTUpdatedList);
    }, [OTUpdatedList]);
    const [selectedPendingOT, setselectedPendingOT] = useState(viewOTPendingRequest);
    const handleViewClick = (otId) => {
        const otData = OTPendingList.find((ot) => ot.ot_id === otId);
        setselectedPendingOT(otData);
        open();
    }
    const handleViewClick2 = (otId) => {
        const otData = OTUpdatedList.find((ot) => ot.ot_id === otId);
        setselectedPendingOT(otData);
        open2();
    }
    const handleViewClick3 = (otId) => {
        const otData = OTUpdatedList.find((ot) => ot.ot_id === otId);
        setselectedPendingOT(otData);
        open3();
    }
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [opened2, setOpened2] = useState(false);
    const open2 = () => setOpened2(true);
    const close2 = () => setOpened2(false);
    const [opened3, setOpened3] = useState(false);
    const open3 = () => setOpened3(true);
    const close3 = () => setOpened3(false)
    const [activeUpdatedPage, setActiveUpdatedPage] = useState(1);
    const itemsPerUpdatedPage = 5;
    const totalUpdatedPages = Math.ceil(OTUpdatedList.length / itemsPerUpdatedPage);
    const paginatedUpdated = OTUpdatedList.slice(
        (activeUpdatedPage - 1) * itemsPerUpdatedPage,
        activeUpdatedPage * itemsPerUpdatedPage
    );


    const [tabValue, setTabValue] = useState("pending");
    const [editMode, setEditMode] = useState({});

    const otTypeMapping = {
        1: "OVERTIME-IN / OVERTIME-OUT",
        2: "EARLY TIME-IN / EARLY TIME-OUT",
        3: "DAY-OFF OVERTIME",
        4: "LATE FILING",
        5: "Imported",
    };

    const pendingColumns = [
        {
            accessorKey: 'ot_no',
            header: 'Reference No.',
            enableResizing: false,
        },
        {
            accessorKey: 'ot_type_id',
            header: 'OT Type',
            enableResizing: false,
            Cell: ({ cell }) => {
                const otTypeID = cell.getValue();
                return <span>{otTypeMapping[otTypeID] || "Unknown Type"}</span>
            }
        },

        {
            accessorKey: 'user.name',
            header: 'Employee Name',
        },
        {
            accessorKey: 'date_from',
            header: 'Date From',
        },
        {
            accessorKey: 'date_to',
            header: 'Date To',
        },
        {
            accessorKey: 'time_from',
            header: 'Time From',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'time_to',
            header: 'Time To',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'task_title',
            header: 'Task Title',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'task_done',
            header: 'Task Done',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'created_date',
            header: 'Date Filed',
            Cell: ({ cell }) => <span>{dayjs(cell.getValue()).format('YYYY-MM-DD')}</span>,

        },
    ];
    const pendingTable = useMantineReactTable({
        columns: pendingColumns,
        data: requestData,
        layoutMode: "grid-no-grow",
        enableRowSelection: (row) => row.original.mf_status_id = 1,
        enableColumnResizing: true,
        initialState: {
            density: 'xs',
            pagination: { pageSize: 5, pageIndex: 0 },
            showGlobalFilter: true,
        },
        mantinePaginationProps: {
            rowsPerPageOptions: ['5', '10', '15'],
        },


        paginationDisplayMode: 'pages',
    });
    const updatedColumns = [
        {
            accessorKey: 'ot_no',
            header: 'Reference No.',
            enableResizing: false,
        },
        {
            accessorKey: 'ot_type_id',
            header: 'OT Type',
            enableResizing: false,
            Cell: ({ cell }) => {
                const otTypeID = cell.getValue();
                return <span>{otTypeMapping[otTypeID] || "Unknown Type"}</span>
            }
        },
        {
            accessorKey: 'user.name',
            header: 'Employee Name',
        },
        {
            accessorKey: 'date_from',
            header: 'Date From',
        },
        {
            accessorKey: 'date_to',
            header: 'Date To',
        },
        {
            accessorKey: 'time_from',
            header: 'Time From',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'time_to',
            header: 'Time To',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'task_title',
            header: 'Task Title',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'task_done',
            header: 'Task Done',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'created_date',
            header: 'Date Filed',
            Cell: ({ cell }) => <span>{dayjs(cell.getValue()).format('YYYY-MM-DD')}</span>,

        },
    ]
    const updatedTable = useMantineReactTable({
        columns: updatedColumns,
        data: requestData2,
        layoutMode: "grid-no-grow",
        enableRowSelection: (row) => row.original.mf_status_id = 1,
        enableColumnResizing: true,
        initialState: {
            density: 'xs',
            pagination: { pageSize: 5, pageIndex: 0 },
            showGlobalFilter: true,
        },
        mantinePaginationProps: {
            rowsPerPageOptions: ['5', '10', '15'],
        },
        paginationDisplayMode: 'pages',
    });
    const handleSaveRow = async (requestID) => {    /* EDIT SAVE */
        const requestToUpdate = requestData.find((otRequest) => otRequest.ot_id === requestID);
        if (!requestToUpdate.ot_status_id || requestToUpdate.ot_status_id === '1') {
            notifications.show({
                title: 'Error',
                message: `Please select a valid option before saving`,
                position: 'top-center',
                color: 'red',
                autoClose: 2000,
            })
            return;
        }
        const updatedFields = {
            ot_no: requestToUpdate.ot_no,
            ot_status_id: requestToUpdate.ot_status_id,
            /* mf_status_name: statusMapping[requestToUpdate.ut_status_id] || "Pending" */
        };
        try {
            router.post(`/OT_Module/ot_appr_list/edit/${requestID}`, updatedFields, {
                onSuccess: () => {
                    const updatedPendingList = OTPendingList.filter(
                        (otRequest) => otRequest.ot_id !== requestID
                    )
                    const updatedRequest = { ...requestToUpdate, ...updatedFields };
                    const updatedUpdatedList = [...OTUpdatedList, updatedRequest];
                    OTPendingList = updatedPendingList;
                    OTUpdatedList = updatedUpdatedList;
                    setEditMode((prev) => ({ ...prev, [requestID]: false }));
                    notifications.show({
                        title: 'Success',
                        message: `OT Request successfully updated`,
                        position: 'top-center',
                        color: 'green ',
                        autoClose: 2000,
                    })
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message: `Unable to make any changes. Please try again: ${error}`,
                        position: 'top-center',
                        color: 'red ',
                        autoClose: 2000,
                    })
                }
            });


        } catch (error) {
            console.error("Error updating details:", error);
            alert("An error occurred while updating the request.");
        }
    };


    const handleFieldChange = (requestID, field, value) => {
        setRequestData((prevData) => {
            return prevData.map((otRequest) =>
                otRequest.ot_id === requestID ? { ...otRequest, [field]: value } : otRequest
            );
        });
        console.log(`Updated ${field} to ${value} for request ID ${requestID}`);
    };
    function handleEditSubmit(e) {
        e.preventDefault();

        if (!selectedPendingOT.ot_status_id) {
            console.error('OT Status is required.');
            return;
        }

        const updatedFields = {
            ot_no: selectedPendingOT.ot_no,
            ot_status_id: selectedPendingOT.ot_status_id,
            appr_remarks: selectedPendingOT.appr_remarks,
        };
        console.log("updated", updatedFields);
        router.post('/OT_Module/ot_appr_list/edit', updatedFields, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `OT Request successfully updated`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message: `Unable to make any changes. Please try again: ${error}`,
                    position: 'top-center',
                    color: 'red ',
                    autoClose: 2000,
                })
            }
        });

        // Close the modal after submission
        close();
        close3();
    }

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

    const openModal = () => modals.openConfirmModal({
        title: 'Please Confirm',
        children: (
            <Text size="sm">
                Are you sure that you want to approve all requests?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: () => handleAction('approve'),
        onCancel: () => console.log('Cancel'),


    });

    const openModal2 = () => modals.openConfirmModal({
        title: 'Please Confirm',
        children: (
            <Text size="sm">
                Are you sure that you want to disapprove all requests?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onConfirm: () => handleAction('rejected'),
        onCancel: () => console.log('Cancel'),

    });

    function handleAction(action) {
        router.post('ot_appr_list', { action }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `OT Request Batch Update Success`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })

            },
            onError: () => {
                notifications.show({
                    title: 'Success',
                    message: `Unable to make any changes. Please try again`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })


            },
        });

    };
    const handleUpdateStatus = (statusId) => {
        const selectedRows = tabValue === "pending"
            ? pendingTable.getSelectedRowModel().rows
            : updatedTable.getSelectedRowModel().rows;

        if (selectedRows.length === 0) {
            notifications.show({
                title: 'No Selection',
                message: 'Please select at least one row to update.',
                position: 'top-center',
                color: 'yellow',
                autoClose: 2000,
            });
            return;
        }


        const updatedRows = selectedRows.map((row) => ({
            ...row.original,
            ot_status_id: statusId,
        }));

        console.log("Updated Rows:", updatedRows);

        router.post('ot_appr_list/batch', { rows: updatedRows }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `OT Request Update Success`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })
                if (tabValue === "pending") {
                    pendingTable.resetRowSelection();
                } else if (tabValue === "updated") {
                    updatedTable.resetRowSelection();
                }
            },
            onError: () => {
                notifications.show({
                    title: 'Success',
                    message: `Unable to make any changes. Please try again`,
                    position: 'top-center',
                    color: 'green ',
                    autoClose: 2000,
                })


            },
        });
    };
    const selectedRowCount = pendingTable.getSelectedRowModel().rows.length;
    const selectedRowCount2 = updatedTable.getSelectedRowModel().rows.length;

    const ref = useRef(null);
    const pickerControl = (<ActionIcon variant="subtle" color="gray" onClick={() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showPicker(); }}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>);
    return (
        <AppLayout>
            <Container className="mt-3">
                <Card className="mt-5">
                    <Tabs color="lime" radius="xs" defaultValue="pending" value={tabValue} onChange={setTabValue}>
                        <Tabs.List>
                            <Tabs.Tab value="pending">
                                Pending
                            </Tabs.Tab>
                            <Tabs.Tab value="updated">
                                Updated
                            </Tabs.Tab>
                        </Tabs.List>
                        {/* PENDING TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB */}
                        <Tabs.Panel value="pending">
                            <Stack>
                                <Divider />
                                <Title className="ms-3" order={4}>
                                    Pending OT Table

                                </Title>
                                <Flex className="ms-3">
                                    <Button onClick={() => openModal()} color='green' variant="outline"> Approve all</Button>
                                    <Button onClick={() => openModal2()} color='red' ms={10} variant="outline"> Disapproved all</Button>
                                    {selectedRowCount > 0 && (
                                        <>

                                            <Button onClick={() => handleUpdateStatus(2)} ms={10} color='green' variant="outline"> Approve Selected</Button>
                                            <Button onClick={() => handleUpdateStatus(3)} color='red' ms={10} variant="outline"> Disapproved Selected</Button>
                                        </>
                                    )}
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <MRT_GlobalFilterTextInput table={pendingTable} />
                                </Flex>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        {pendingTable.getHeaderGroups().map((headerGroup) => (
                                            <Table.Tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <Table.Th key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.Header ??
                                                                header.column.columnDef.header,
                                                                header.getContext(),
                                                            )}
                                                    </Table.Th>
                                                ))}
                                            </Table.Tr>
                                        ))}
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {pendingTable.getRowModel().rows.map((row) => (
                                            <Table.Tr key={row.original.ot_id}>
                                                {row.getVisibleCells().map((cell) => {
                                                    const isHighlighted = row.original.sec_apprv_no === apprvID;
                                                    return (
                                                        <Table.Td key={cell.id} style={{
                                                            color: isHighlighted ? 'green' : 'inherit', // Highlight color
                                                            fontWeight: isHighlighted ? 'bold' : 'normal', // Optional bold
                                                        }}>
                                                            <MRT_TableBodyCellValue cell={cell} table={pendingTable} />
                                                        </Table.Td>
                                                    );
                                                }

                                                )}

                                                <Table.Td>

                                                    <ActionIcon onClick={() => handleViewClick(row.original.ot_id)} className="btn btn-primary btn-sm"><IconEdit /> </ActionIcon>

                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                <MRT_ToolbarAlertBanner stackAlertBanner table={pendingTable} />
                                <MRT_TablePagination table={pendingTable} />

                            </Stack>

                        </Tabs.Panel>
                        <Tabs.Panel value="updated">
                            <Stack>
                                <Divider />
                                <Title className="ms-3" order={4}>
                                    Updated OT Table

                                </Title>
                                <Flex className="ms-3">
                                    {selectedRowCount2 > 0 && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus(1)} ms={10} variant="outline" color='green'> Rollback Selected</Button>
                                        </>
                                    )}
                                </Flex>
                                <Flex justify="space-between" align="center">
                                    <MRT_GlobalFilterTextInput table={updatedTable} />
                                </Flex>
                                <Table striped highlightOnHover>
                                    <Table.Thead>
                                        {updatedTable.getHeaderGroups().map((headerGroup) => (
                                            <Table.Tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <Table.Th key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.Header ??
                                                                header.column.columnDef.header,
                                                                header.getContext(),
                                                            )}
                                                    </Table.Th>
                                                ))}
                                            </Table.Tr>
                                        ))}
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {updatedTable.getRowModel().rows.map((row) => (
                                            <Table.Tr key={row.original.ot_id}>
                                                {row.getVisibleCells().map((cell) => {
                                                    const isHighlighted = row.original.sec_apprv_no === apprvID;
                                                    return (
                                                        <Table.Td key={cell.id} style={{
                                                            color: isHighlighted ? 'green' : 'inherit', // Highlight color
                                                            fontWeight: isHighlighted ? 'bold' : 'normal', // Optional bold
                                                        }}>
                                                            <MRT_TableBodyCellValue cell={cell} table={updatedTable} />
                                                        </Table.Td>
                                                    );
                                                }

                                                )}

                                                <Table.Td>
                                                    <ActionIcon onClick={() => handleViewClick3(row.original.ot_id)} color="lime" className="btn btn-primary btn-sm"><IconEdit /> </ActionIcon>

                                                    <ActionIcon onClick={() => handleViewClick2(row.original.ot_id)} className="btn btn-primary btn-sm ms-2"><IconEye /> </ActionIcon>

                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                <MRT_ToolbarAlertBanner stackAlertBanner table={updatedTable} />
                                <MRT_TablePagination table={updatedTable} />

                            </Stack>

                        </Tabs.Panel>
                        <Modal size="l" opened={opened} onClose={close} title="Update OT Request Details">
                            <form onSubmit={handleEditSubmit}>

                                {selectedPendingOT && (
                                    <>
                                        <Box style={{ display: 'flex', gap: '1rem' }}>

                                            <TextInput label="Reference No." value={selectedPendingOT.ot_no || ''} disabled />
                                            <DateInput
                                                label="Date Filed"
                                                placeholder={formatDate(selectedPendingOT.created_date) || ''}
                                                disabled />
                                        </Box>
                                        <label>OT Status</label>
                                        <Form.Select
                                            value={selectedPendingOT.ot_status_id || ''}
                                            onChange={(e) =>
                                                setselectedPendingOT({
                                                    ...selectedPendingOT,
                                                    ot_status_id: e.target.value || '',

                                                })
                                            }
                                        >
                                            <option value="">Please select</option>
                                            <option value="2">Approved</option>
                                            <option value="3">Disapproved</option>
                                        </Form.Select>
                                        <Textarea
                                            label="Remarks"
                                            value={selectedPendingOT.appr_remarks || ''}
                                            onChange={(e) => setselectedPendingOT({ ...selectedPendingOT, appr_remarks: e.target.value })} />
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <DateInput
                                                label="OT Date From"
                                                placeholder={selectedPendingOT.date_from || ''}
                                                disabled />
                                            <DateInput
                                                label="OT Date To"
                                                placeholder={selectedPendingOT.date_to || ''}
                                                disabled />
                                        </Box>
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput
                                                label="OT Time Start"
                                                placeholder={selectedPendingOT.time_from ? formatTime(selectedPendingOT.time_from) : ''}
                                                disabled />

                                            <TextInput
                                                label="OT Time End"
                                                placeholder={selectedPendingOT.time_to ? formatTime(selectedPendingOT.time_to) : ''}
                                                disabled />
                                        </Box>

                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput
                                                label="Task Title"
                                                placeholder={selectedPendingOT.task_title}
                                                disabled />

                                            <TextInput
                                                label="Task Done"
                                                placeholder={selectedPendingOT.task_done}
                                                disabled />
                                        </Box>
                                        <Button type="submit" className="mt-3" color="teal"> Submit</Button>
                                    </>
                                )}
                            </form>

                        </Modal>



                        <Modal size="l" opened={opened3} onClose={close3} title="OT Rollback Request Details">
                            <form onSubmit={handleEditSubmit}>

                                {selectedPendingOT && (
                                    <>
                                        <Box style={{ display: 'flex', gap: '1rem' }}>

                                            <TextInput label="Reference No." value={selectedPendingOT.ot_no || ''} disabled />
                                            <DateInput
                                                label="Date Filed"
                                                placeholder={formatDate(selectedPendingOT.created_date) || ''}
                                                disabled />
                                        </Box>
                                        <Select
                                            label="OT Status"
                                            value={selectedPendingOT.ot_status_id || ''}
                                            onChange={(value) =>
                                                setselectedPendingOT({
                                                    ...selectedPendingOT,
                                                    ot_status_id: value || '',

                                                })
                                            }
                                            data={[
                                                { value: '1', label: 'Pending' },
                                            ]}
                                        />

                                        <Textarea
                                            required
                                            label="Remarks"
                                            value={selectedPendingOT.appr_remarks || ''}
                                            onChange={(e) => setselectedPendingOT({ ...selectedPendingOT, appr_remarks: e.target.value })} />
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <DateInput
                                                label="OT Date From"
                                                placeholder={selectedPendingOT.date_from || ''}
                                                disabled />
                                            <DateInput
                                                label="OT Date To"
                                                placeholder={selectedPendingOT.date_to || ''}
                                                disabled />
                                        </Box>
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput
                                                label="OT Time Start"
                                                placeholder={selectedPendingOT.time_from ? formatTime(selectedPendingOT.time_from) : ''}
                                                disabled />

                                            <TextInput
                                                label="OT Time End"
                                                placeholder={selectedPendingOT.time_to ? formatTime(selectedPendingOT.time_to) : ''}
                                                disabled />
                                        </Box>

                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput
                                                label="Task Title"
                                                placeholder={selectedPendingOT.task_title}
                                                disabled />

                                            <TextInput
                                                label="Task Done"
                                                placeholder={selectedPendingOT.task_done}
                                                disabled />
                                        </Box>

                                        <Button type="submit" className="mt-3" color="teal"> Submit</Button>
                                    </>
                                )}
                            </form>

                        </Modal>











                    </Tabs>
                </Card>
            </Container>
        </AppLayout>
    )
}