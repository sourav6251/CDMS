import React  from "react";
import {  Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

function Layout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Header />
                <main className="flex-1 p-3 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
