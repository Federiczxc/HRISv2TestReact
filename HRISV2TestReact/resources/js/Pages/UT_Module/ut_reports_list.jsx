import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { ActionIcon, Flex, FileInput, Box, Button, Modal } from '@mantine/core';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react'
import { IconClock, IconDownload, IconFileExport, IconFileImport } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
    MRT_ShowHideColumnsButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleGlobalFilterButton,
    MantineReactTable,
    MRT_GlobalFilterTextInput, useMantineReactTable
} from "mantine-react-table";
import Papa from 'papaparse';
import { mkConfig, generateCsv, download } from 'export-to-csv';
export default function ut_reports_list({ UTReportsList }) {
    const [file, setFile] = useState(null);
    const [opened, setOpened] = useState(false);
    const open = () => setOpened(true);
    const close = () => setOpened(false);
    const data = UTReportsList
    const formatTime = (time) => {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const isPM = hours >= 12;
        const hours12 = hours % 12 || 12;
        const period = isPM ? 'PM' : 'AM';
        return `${hours12.toString().padStart(2, '0')}:${minutes} ${period}`;
    };
    const columns = [
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
            accessorKey: 'created_date',
            header: 'Date Filed',
            Cell: ({ cell }) => <span>{dayjs(cell.getValue()).format('YYYY-MM-DD')}</span>,

        },
        {
            accessorKey: 'first_approver',
            header: 'First Approver',
        },

        {
            accessorKey: 'sec_approver',
            header: 'Second Approver',
        },
        {
            accessorKey: 'approver_name',
            header: 'Approved By',
        },
        {
            accessorKey: 'approved_date',
            header: 'Approved Date',
            Cell: ({ cell }) => <span>{dayjs(cell.getValue()).format('YYYY-MM-DD')}</span>,


        },

    ];
    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparaator: '.',
        useKeysAsHeaders: true,
        filename: 'UT_Reports_List',

    })

    const handleExportRows = (rows) => {
        const visibleColumns = columns.filter(
            (column) => table.getState().columnVisibility[column.accessorKey] !== false
        );

        const rowData = rows.map((row) => {
            const mappedRow = {};

            visibleColumns.forEach((column) => {
                let value = row.original[column.accessorKey];

                // Handle nested fields like user.name and status.mf_status_name
                if (column.accessorKey === 'user.name') {
                    value = row.original.user?.name; // Access the user name
                } else if (column.accessorKey === 'status.mf_status_name') {
                    value = row.original.status?.mf_status_name; // Access the status name
                } else if (column.accessorKey === 'ut_time') {
                    value = formatTime(value.split('.')[0]);
                } else if (
                    column.accessorKey === 'created_date' ||
                    column.accessorKey === 'approved_date'
                ) {
                    value = dayjs(value).format('YYYY-MM-DD'); // Format date
                }

                mappedRow[column.header] = value;
            });

            return mappedRow;
        });

        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportTemplate = () => {
        const visibleColumns = columns.filter(
            (column) => table.getState().columnVisibility[column.accessorKey] !== false
        );

        const columnHeaders = visibleColumns.map((column) => column.header).join(',');

        const csvContent = `${columnHeaders}\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'UT_Reports_List_Template.csv';
        link.click();
    };
    const handleUpload = () => {
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    const parsedData = result.data;
                    console.log("tite", parsedData);
                    handleUploadData(parsedData);
                },
                header: true,
                skipEmptyLines: true
            })

        }
    };
    function handleUploadData(parsedData) {
        const updatedValue = {
            ut_upload: parsedData
        }
        router.post('/UT_Module/ut_reports_list', updatedValue, {
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
                close();

            },
        })
    }
    const handleExportData = () => {
        const visibleColumns = columns.filter(
            (column) => table.getState().columnVisibility[column.accessorKey] !== false
        );

        const mappedData = data.map((row) => {
            const mappedRow = {};

            visibleColumns.forEach((column) => {
                let value = row[column.accessorKey];

                if (column.accessorKey === 'user.name') {
                    value = row.user?.name;
                } else if (column.accessorKey === 'status.mf_status_name') {
                    value = row.status?.mf_status_name;
                } else if (column.accessorKey === 'ut_time') {
                    value = formatTime(value.split('.')[0]);
                } else if (
                    column.accessorKey === 'created_date' ||
                    column.accessorKey === 'approved_date'
                ) {
                    value = dayjs(value).format('YYYY-MM-DD'); // Format date
                }

                mappedRow[column.header] = value;
            });

            return mappedRow;
        });

        const csv = generateCsv(csvConfig)(mappedData);
        download(csvConfig)(csv);
    };



    const table = useMantineReactTable({
        columns,
        data,
        layoutMode: "grid-no-grow",
        enableRowSelection: true,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        initialState: {
            density: 'xs',
            columnVisibility: {
                created_date: false,
                first_apprv_name: false,
                sec_apprv_name: false,
                first_apprv_no: false,
                sec_apprv_no: false,
                approved_date: false,
                'mrt-row-expand': false,
            }
        },
        renderTopToolbar: ({ table }) => (

            <Box
                style={{

                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Flex align="center" className="mb-2">
                    <MRT_GlobalFilterTextInput table={table} />
                    <MRT_ToggleGlobalFilterButton table={table} />
                    <MRT_ToggleFiltersButton table={table} />
                    <MRT_ShowHideColumnsButton table={table} />
                    <MRT_ToggleDensePaddingButton table={table} />
                    <MRT_ToggleFullScreenButton table={table} />
                </Flex>


            </Box>

        ),
    });

    return (
        <AppLayout>


            <Button
                color="lightblue"
                //export all data that is currently in the table (ignore pagination, sorting, Searrch, etc.)
                onClick={handleExportData}
                leftSection={<IconDownload />}
                variant="filled"
            >
                Export All Data
            </Button>
            <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                }
                leftSection={<IconDownload />}
                variant="filled"
            >
                Export All Filtered Data
            </Button>
            <Button
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(table.getRowModel().rows)}
                leftSection={<IconDownload />}
                variant="filled"
            >
                Export Current Page
            </Button>
            <Button
                disabled={
                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                leftSection={<IconDownload />}
                variant="filled"
            >
                Export Selected Rows
            </Button>
            <Button
                color="Red"
                //export all data that is currently in the table (ignore pagination, sorting, Searrch, etc.)
                onClick={handleExportTemplate}
                leftSection={<IconFileExport />}
                variant="filled"
            >
                Export Template
            </Button>
            <Button
                onClick={() => open()}
                color="Red"
                leftSection={<IconFileImport />}
                variant="filled"
            >
                Import CSV
            </Button>


            <MantineReactTable table={table} />


            <Modal opened={opened} onClose={close} title="Import">
                <FileInput
                    label="Upload Template"
                    placeholder="Choose a CSV file"
                    accept=".csv"
                    value={file}
                    onChange={setFile}
                    id="file-upload"
                />
                <Button onClick={handleUpload}>
                    Upload and Process
                </Button>
            </Modal>
        </AppLayout >
    )
}