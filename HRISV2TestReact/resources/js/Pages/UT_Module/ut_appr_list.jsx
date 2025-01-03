import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Container, Card, Form } from 'react-bootstrap';
import {
    ActionIcon,
    rem,
    Textarea,
    Modal,
    Button,
    Text,
    Select,
    Tabs,
    Table,
    Pagination,
    TextInput,
    Divider,
    Flex,
    Stack,
    Title,
    Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
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

export default function ut_appr_list({ UTPendingList, UTUpdatedList, apprvID, viewUTPendingRequest }) {
    const pendingData = UTPendingList;
    const [requestData, setRequestData] = useState(UTPendingList);
    const updatedData = UTUpdatedList;
    const [requestData2, setRequestData2] = useState(UTUpdatedList);
    const [activePendingPage, setActivePendingPage] = useState(1);
    const itemsPerPendingPage = 5;
    const totalPendingPages = Math.ceil(UTPendingList.length / itemsPerPendingPage);
    const paginatedPending = UTPendingList.slice(
        (activePendingPage - 1) * itemsPerPendingPage,
        activePendingPage * itemsPerPendingPage
    );

    console.log("tite", pendingData);
    console.log("puke", requestData2);

    useEffect(() => {
        setRequestData(UTPendingList);
    }, [UTPendingList]);

    useEffect(() => {
        setRequestData2(UTUpdatedList);
    }, [UTUpdatedList]);

    const [selectedPendingUT, setSelectedPendingUT] = useState(viewUTPendingRequest);
    const handleViewClick = (utId) => {
        const utData = UTPendingList.find((ut) => ut.id === utId);
        setSelectedPendingUT(utData);
        open();
    }
    const handleViewClick2 = (utId) => {
        const utData = UTUpdatedList.find((ut) => ut.id === utId);
        setSelectedPendingUT(utData);
        open2();
    }
    const handleViewClick3 = (utId) => {
        const utData = UTUpdatedList.find((ut) => ut.id === utId);
        setSelectedPendingUT(utData);
        open3();
    }
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false)
    const [opened2, setOpened2] = useState(false);
    const open2 = () => setOpened2(true);
    const close2 = () => setOpened2(false)
    const [opened3, setOpened3] = useState(false);
    const open3 = () => setOpened3(true);
    const close3 = () => setOpened3(false)

    const [activeUpdatedPage, setActiveUpdatedPage] = useState(1);
    const itemsPerUpdatedPage = 5;
    const totalUpdatedPages = Math.ceil(UTUpdatedList.length / itemsPerUpdatedPage);
    const paginatedUpdated = UTUpdatedList.slice(
        (activeUpdatedPage - 1) * itemsPerUpdatedPage,
        activeUpdatedPage * itemsPerUpdatedPage
    );


    const [tabValue, setTabValue] = useState("pending");
    const [editMode, setEditMode] = useState({});


    const pendingColumns = [
        {
            accessorKey: 'ut_no',
            header: 'Reference No.',
            enableResizing: false,

        },
        {
            accessorKey: 'user.name',
            header: 'Employee Name',
        },
        {
            accessorKey: 'ut_date',
            header: 'UT Date',
            enableResizing: false,
            

        },
        {
            accessorKey: 'ut_time',
            header: 'UT Time',
            enableResizing: false,

            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'ut_reason',
            header: 'UT Reason',
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
            accessorKey: 'ut_no',
            header: 'Reference No.',
            enableResizing: false,

        },
        {
            accessorKey: 'user.name',
            header: 'Employee Name',
        },
        {
            accessorKey: 'status.mf_status_name',
            header: 'Status',
            enableResizing: false,

        },
        {
            accessorKey: 'ut_date',
            header: 'UT Date',
            enableResizing: false,

        },
        {
            accessorKey: 'ut_time',
            header: 'UT Time',
            enableResizing: false,

            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
        },
        {
            accessorKey: 'ut_reason',
            header: 'UT Reason',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },

        {
            accessorKey: 'approved_date',
            header: 'Approved Date',
            Cell: ({ cell }) => <span>{dayjs(cell.getValue()).format('YYYY-MM-DD')}</span>,

        },
        {
            accessorKey: 'approver_name',
            header: 'Approved by',
        },

    ];
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
            ut_status_id: statusId,
        }));

        console.log("Updated Rows:", updatedRows);

        router.post('ut_appr_list/batch', { rows: updatedRows }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `UT Request Update Success`,
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
    const handleSaveRow = async (requestID) => {    /* EDIT SAVE */
        const requestToUpdate = requestData.find((utRequest) => utRequest.id === requestID);


        if (!requestToUpdate.ut_status_id || requestToUpdate.ut_status_id === '1') {
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
            ut_status_id: requestToUpdate.ut_status_id,
        };
        try {
            router.post(`/UT_Module/ut_appr_list/edit/${requestID}`, updatedFields, {
                onSuccess: () => {
                    const updatedPendingList = UTPendingList.filter(
                        (utRequest) => utRequest.id !== requestID
                    )
                    const updatedRequest = { ...requestToUpdate, ...updatedFields };
                    const updatedUpdatedList = [...UTUpdatedList, updatedRequest];
                    UTPendingList = updatedPendingList;
                    UTUpdatedList = updatedUpdatedList;
                    setEditMode((prev) => ({ ...prev, [requestID]: false }));
                    notifications.show({
                        title: 'Success',
                        message: `UT Request successfully updated`,
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
            return prevData.map((utRequest) =>
                utRequest.id === requestID ? { ...utRequest, [field]: value } : utRequest
            );
        });
        console.log(`Updated ${field} to ${value} for request ID ${requestID}`);
    };
    function handleEditSubmit(e) {
        e.preventDefault();

        if (!selectedPendingUT.ut_status_id) {
            console.error('UT Status is required.');
            return;
        }

        const updatedFields = {
            ut_no: selectedPendingUT.ut_no,
            ut_status_id: selectedPendingUT.ut_status_id,
            remarks: selectedPendingUT.remarks,
        };

        router.post('/UT_Module/ut_appr_list/edit', updatedFields, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `UT Request successfully updated`,
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
        router.post('ut_appr_list', { action }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: `UT Request Batch Update Success`,
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
                                    Pending Table

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
                                            <Table.Tr key={row.original.id}>
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

                                                    <ActionIcon onClick={() => handleViewClick(row.original.id)} className="btn btn-primary btn-sm"><IconEdit /> </ActionIcon>

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
                                    Updated Table

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
                                    <MRT_TablePagination table={updatedTable} />
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
                                            <Table.Tr key={row.original.id}>
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
                                                    <ActionIcon onClick={() => handleViewClick3(row.original.id)} color="lime" className="btn btn-primary btn-sm"><IconEdit /> </ActionIcon>

                                                    <ActionIcon onClick={() => handleViewClick2(row.original.id)} className="btn btn-primary btn-sm ms-2"><IconEye /> </ActionIcon>

                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                <MRT_ToolbarAlertBanner stackAlertBanner table={updatedTable} />
                                <MRT_TablePagination table={updatedTable} />

                            </Stack>

                        </Tabs.Panel>





                        <Modal size="l" opened={opened2} onClose={close2} title="UT Request Details" centered>

                            {selectedPendingUT && (
                                <>
                                    <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                        <TextInput label="Reference No." value={selectedPendingUT.ut_no || ''} disabled />

                                        <TextInput label="UT Status"
                                            disabled value={selectedPendingUT.status?.mf_status_name || ''}
                                        />
                                    </Box>
                                    <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                        <DateInput label="UT Date Requested" placeholder={selectedPendingUT.ut_date || ''} disabled />

                                        <TextInput label="UT Time Requested" placeholder={selectedPendingUT.ut_time ? formatTime(selectedPendingUT.ut_time) : ''} disabled />
                                    </Box>
                                    <Textarea label="UT Reason" value={selectedPendingUT.ut_reason || ''} disabled />

                                    <DateInput label="Date Filed" placeholder={formatDate(selectedPendingUT.created_date) || ''} disabled />

                                    <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <TextInput label="Approved by" placeholder={selectedPendingUT.approver_name} disabled />
                                        <DateInput label="Approved Date" placeholder={formatDate(selectedPendingUT.approved_date)} disabled />
                                    </Box>
                                    <Textarea label="Remarks" value={selectedPendingUT.remarks || ''} disabled />
                                </>
                            )}


                        </Modal>
                        <Modal size="l" opened={opened} onClose={close} title="UT Edit Request Details" centered> {/* View */}
                            <form onSubmit={handleEditSubmit}>

                                {selectedPendingUT && (
                                    <>
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput label="Reference No." value={selectedPendingUT.ut_no || ''} disabled />

                                            <Select
                                                placeholder="Pick status"
                                                label="Status"
                                                value={selectedPendingUT.ut_status_id || ''}
                                                onChange={(value) =>
                                                    setSelectedPendingUT({
                                                        ...selectedPendingUT,
                                                        ut_status_id: value

                                                    })
                                                }
                                                data={[
                                                    { value: '2', label: 'Approved' },
                                                    { value: '3', label: 'Disapproved' }
                                                ]}
                                            />
                                        </Box>
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <DateInput label="UT Date Requested" placeholder={selectedPendingUT.ut_date || ''} disabled />

                                            <TextInput label="UT Time Requested" placeholder={selectedPendingUT.ut_time ? formatTime(selectedPendingUT.ut_time) : ''} disabled />
                                        </Box>
                                        <label>UT Reason</label>
                                        <Textarea value={selectedPendingUT.ut_reason || ''} disabled />

                                        <label>Date Filed</label>
                                        <DateInput placeholder={formatDate(selectedPendingUT.created_date) || ''} disabled />

                                        <label>Remarks</label>
                                        <Textarea value={selectedPendingUT.remarks || ''} onChange={(e) => setSelectedPendingUT({ ...selectedPendingUT, remarks: e.target.value })} />
                                        <Button type="submit" className="mt-3" color="teal"> Submit</Button>
                                    </>
                                )}
                            </form>

                        </Modal>
                        <Modal opened={opened3} onClose={close3} title="UT Rollback Request Details" centered> {/* View */}

                            <form onSubmit={handleEditSubmit}>

                                {selectedPendingUT && (
                                    <>
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput label="Reference No." value={selectedPendingUT.ut_no || ''} disabled />

                                            <Select
                                                label="UT Status"
                                                value={selectedPendingUT.ut_status_id || ''}
                                                onChange={(value) =>
                                                    setSelectedPendingUT({
                                                        ...selectedPendingUT,
                                                        ut_status_id: value || '',

                                                    })
                                                }
                                                data={[
                                                    { value: '1', label: 'Pending' },
                                                ]}
                                            />

                                        </Box>
                                        <Textarea label="Approver Remarks" required value={selectedPendingUT.remarks || ''} onChange={(e) => setSelectedPendingUT({ ...selectedPendingUT, remarks: e.target.value })} />

                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <DateInput label="UT Date Requested" placeholder={selectedPendingUT.ut_date || ''} disabled />

                                            <TextInput label="UT Time Requested" placeholder={selectedPendingUT.ut_time ? formatTime(selectedPendingUT.ut_time) : ''} disabled />
                                        </Box>
                                        <label>UT Reason</label>
                                        <Textarea value={selectedPendingUT.ut_reason || ''} disabled />

                                        <label>Date Filed</label>
                                        <DateInput placeholder={formatDate(selectedPendingUT.created_date) || ''} disabled />
                                        <Box style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

                                            <TextInput label="Approved by" placeholder={selectedPendingUT.approver_name} disabled />

                                            <DateInput label="Approved Date" placeholder={formatDate(selectedPendingUT.approved_date)} disabled />
                                        </Box>

                                        <Button type="submit" className="mt-3" color="teal"> Submit</Button>
                                    </>
                                )}
                            </form>

                        </Modal>
                    </Tabs>
                </Card>
            </Container>
        </AppLayout >
    )
}