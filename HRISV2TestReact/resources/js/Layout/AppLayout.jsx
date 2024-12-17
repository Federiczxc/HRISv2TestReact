import React from "react";
import Navbar from "../Components/Navbar";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import 'mantine-react-table/styles.css';
import "react-medium-image-zoom/dist/styles.css";

const AppLayout = ({ children }) => {

    return (

        <MantineProvider>
            <Notifications />
            <ModalsProvider>
                <Navbar />

                <main className="container mt-4">
                    {children}
                </main>
            </ModalsProvider>

        </MantineProvider>
    );
};

export default AppLayout;
