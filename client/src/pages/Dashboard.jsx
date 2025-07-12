import { Navigate } from "react-router-dom";
import { DashboardContext } from "../components/dashboard/DashboardContent";
import { useAuthStore } from "../store/authStore";
import React from "react";

export default function Dashboard() {
    const { role } = useAuthStore();

    // If role is not 'faculty' AND not 'hod', redirect to /notices
    if (role !== "faculty" && role !== "hod") {
        return <Navigate to="/notice-board" replace />;
    }

    return (
        <>
            <DashboardContext />
        </>
    );
}
