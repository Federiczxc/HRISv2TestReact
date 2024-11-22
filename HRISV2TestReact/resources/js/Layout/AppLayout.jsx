import React from "react";
import Navbar from "../Components/Navbar";
import { MantineProvider } from "@mantine/core";
const AppLayout = ({ children }) => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <MantineProvider>

            <main className="container mt-4">
                {children}
            </main>
            </MantineProvider>

        </div>
    );
};

export default AppLayout;
