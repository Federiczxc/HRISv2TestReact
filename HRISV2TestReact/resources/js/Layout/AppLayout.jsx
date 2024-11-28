import React from "react";
import Navbar from "../Components/Navbar";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
const AppLayout = ({ children }) => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />
            {/* Main Content */}
            <MantineProvider>
            <Notifications/>
            <ModalsProvider>
                
            </ModalsProvider>
            <main className="container mt-4">
                {children}
            </main>
            </MantineProvider>

        </div>
    );
};

export default AppLayout;
