import React, { useEffect, useState, useRef } from "react";
import AppLayout from "@/Layout/AppLayout";
import { ActionIcon, Flex, Container, FileInput, Box, Pagination, Button, Table, Alert, Modal } from '@mantine/core';
import dayjs from 'dayjs';
import { router, usePage } from '@inertiajs/react'
import { IconClock, IconDownload, IconFileExport, IconFileImport, IconSettingsOff } from '@tabler/icons-react';
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
/* import Papa from 'papaparse'; */
import * as XLSX from 'xlsx';
import { Inertia } from "@inertiajs/inertia";
/* import { mkConfig, generateCsv, download } from 'export-to-csv'; */
export default function ut_reports_list({ UTReportsList }) {
    const [file, setFile] = useState(null);
    const [opened, setOpened] = useState(false);
    const [previewFile, setPreviewFile] = useState([]);
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
    const { errorWarning } = usePage().props;

    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(previewFile.length / itemsPerPage);
    const paginatedData = previewFile.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );
    const columns = [
        {
            accessorKey: 'ut_no',
            header: 'Reference No.',
            enableResizing: false,

        },
        {
            accessorKey: 'emp_no',
            header: 'Emp. No.',
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
    /* const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparaator: '.',
        useKeysAsHeaders: true,
        filename: 'UT_Reports_List',

    }) */
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

        /* const csv = generateCsv(csvConfig)(mappedData);
        download(csvConfig)(csv); */
        const worksheet = XLSX.utils.json_to_sheet(mappedData); //extractata data
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
        XLSX.writeFile(workbook, "UT_Reports_List.xls");
    };
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

        /* const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv); */
        const worksheet = XLSX.utils.json_to_sheet(rowData); //extractata data
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
        XLSX.writeFile(workbook, "UT_Reports_List.xls")
    };

    const handleExportTemplate = () => {
        /*  const visibleColumns = columns.filter(
             (column) => table.getState().columnVisibility[column.accessorKey] !== false
         ); */
        const fixedColumnHeaders = [
            'Employee No.',
            'Employee Name',
            'UT Date',
            'UT Time',
            'UT Reason',
            'Date Filed',
            'Approved By',
            'Approved Date',
        ];
        /*       const columnHeaders = visibleColumns.map((column) => column.header).join(','); */
        /*   const columnHeaders = fixedColumnHeaders.join(','); */
        /*  const csvContent = `${columnHeaders}\n`;
  */
        /*  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
         const link = document.createElement('a');
         link.href = URL.createObjectURL(blob);
         link.download = 'UT_Reports_List_Template.csv';
         link.click(); */
        const data = [fixedColumnHeaders];
        data.push(new Array(fixedColumnHeaders.length).fill(''));
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        XLSX.writeFile(workbook, 'UT_Reports_List_Template.xls');


    };
    const handleFilePreview = (file) => {
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);



                const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: true, });
                const formattedData = parsedData.map((row) => {
                    const formattedRow = {};
                    for (const [key, value] of Object.entries(row)) {
                        formattedRow[key] = formatCell(value); // Apply formatting logic
                    }
                    return formattedRow;
                });
                setPreviewFile(parsedData);
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);



                const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: true, });

                console.log("Parsed Data:", parsedData);

                // Pass parsed data to your handler function
                handleUploadData(parsedData);
            };

            reader.readAsArrayBuffer(file); // Works for both .csv and .xlsx
        }
    };

    /* const handleUpload = () => {
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
    }; */
    const formatCell = (cell) => {
        if (cell instanceof Date) {
            if (cell.getFullYear() === 1899 && (cell.getMonth() === 11 && (cell.getDate() === 30 || cell.getDate() === 31))) {
                return dayjs(cell).format('hh:mm A');
            }
            return dayjs(cell).format('YYYY-MM-DD');
        }

        return cell;
    }
    const [errorMessage, setErrorMessage] = useState(null);

    function handleUploadData(parsedData) {
        const updatedData = parsedData.map((row) => {
            return {
                ...row,
                'UT Time': formatCell(row['UT Time']),
            };
        });

        const updatedValue = { ut_upload: updatedData };
        console.log("Update", updatedValue);
        axios.post('/UT_Module/ut_reports_list', updatedValue) //inertia wont work
            .then((response) => {
                notifications.show({
                    title: 'Success',
                    message: 'Your data has been uploaded successfully!',
                    color: 'green',
                    position: 'top-center',
                    autoClose: 5000,
                });

                setFile(null);
                setPreviewFile([]);
                router.visit('/UT_Module/ut_reports_list', { //USE THIS SHIT IF AXIOS GAMIT no need usestate
                    only: ['UTReportsList'],
                })
                close();
            })
            .catch((error) => {
                if (error.response && error.response.data.errorWarning) {
                    const errors = error.response.data.errorWarning;
                    setErrorMessage(errors); // Update the error state
                    console.log("errors", error.response.data);
                    const errorList = errors.map((error, index) => (
                        <div key={index}>
                            Row: {error}
                        </div>
                    ));
                    notifications.show({
                        title: 'Error',
                        message: <> {errorList}</>,  // Display error messages
                        color: 'red',
                        position: 'top-right',
                        autoClose: false,
                    });
                } else {
                    notifications.show({
                        title: 'Error',
                        message: error,
                        color: 'red',
                        position: 'top-center',
                        autoClose: 5000,
                    });
                }

            });
    }

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
                Import XLS
            </Button>


            <MantineReactTable table={table} />


            <Modal closeOnClickOutside={false} size="l" opened={opened} onClose={close} title="Import">
                {errorMessage && errorMessage.length > 0 && (
                    <Box>
                        {errorMessage.map((error, index) => (
                            <Alert key={index} variant="light" color="red" style={{height: 0}}>
                                <li>  Row: {error}</li>
                            </Alert>
                        ))}
                    </Box>
                )}
                <FileInput
                    label="Upload Template"
                    placeholder="Choose .xls"
                    accept=".xls"
                    value={file}
                    onChange={handleFilePreview}
                    id="file-upload"
                />

                {previewFile.length > 0 && (
                    <Table striped>
                        {Object.keys(previewFile[0]).map((header, index) => (
                            <Table.Th key={index}>{header}</Table.Th>
                        ))}
                        <Table.Tbody>
                            {paginatedData.map((row, rowIndex) => (
                                <Table.Tr key={rowIndex}>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        <Table.Td key={cellIndex}>{formatCell(cell)}</Table.Td>
                                    ))}
                                </Table.Tr>
                            ))}

                        </Table.Tbody>
                    </Table>

                )}

                <Pagination total={totalPages} value={activePage} onChange={setActivePage} color="lime.4" mt="sm" />
                <Button color="lime" onClick={handleUpload}>
                    Upload and Process
                </Button>
            </Modal>
        </AppLayout >
    )
}