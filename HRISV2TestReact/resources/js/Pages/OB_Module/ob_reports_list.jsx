import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { Box, Button } from '@mantine/core';
import dayjs from 'dayjs';
import { IconClock, IconDownload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { mkConfig, generateCsv, download } from 'export-to-csv';
export default function ut_reports_list({ OBReportsList, viewOBReportRequest }) {

    const data = OBReportsList
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
            accessorKey: 'ob_no',
            header: 'Reference No.',
            grow: true,
            enableResizing: false,
        },
        {
            accessorKey: 'user.name',
            header: 'Name',
            grow: true,
            size: 200,
        },
        {
            accessorKey: 'status.mf_status_name',
            header: 'Status',
            grow: true,
            size: 150,
            enableResizing: false,
        },
        {
            accessorKey: 'date_from',
            header: 'Date From',
            grow: true,
            size: 200,
            enableResizing: false,

        },
        {
            accessorKey: 'date_to',
            header: 'Date To',
            grow: true,
            size: 200,
            enableResizing: false,

        },
        {
            accessorKey: 'time_from',
            header: 'Time From',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
            enableResizing: false,

        },
        {
            accessorKey: 'time_to',
            header: 'Time To',
            Cell: ({ cell }) => {
                const timeValue = cell.getValue();
                const formattedTime = formatTime(timeValue.split('.')[0]);
                return <span>{formattedTime}</span>;
            },
            enableResizing: false,


        },
        {
            accessorKey: 'destination',
            header: 'Destination',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'person_to_meet',
            header: 'Person To Meet',
            Cell: ({ cell }) => <span style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'normal', textOverflow: 'ellipsis' }}>{cell.getValue()}</span>
        },
        {
            accessorKey: 'ob_purpose',
            header: 'Purpose',
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
            header: 'Approved By ',
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
        filename: 'OB_Reports_List',

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
                } else if (column.accessorKey === 'time_from') {
                    value = formatTime(value.split('.')[0]);
                }
                else if (column.accessorKey === 'time_to') {
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
                } else if (column.accessorKey === 'time_from') {
                    value = formatTime(value.split('.')[0]);
                }
                else if (column.accessorKey === 'time_to') {
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
                first_approver: false,
                sec_approver: false,
                approved_date: false,
                'mrt-row-expand': false,
            }
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                style={{

                    gap: '16px',
                    padding: '8px',

                }}
            >
                <Button
                    color="lightblue"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
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
                    Export All Rows
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    leftSection={<IconDownload />}
                    variant="filled"
                >
                    Export Page Rows
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
            </Box>

        ),
    });

    return (
        <AppLayout>
            <MantineReactTable table={table} />
        </AppLayout>
    )
}