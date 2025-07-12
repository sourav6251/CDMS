import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../store";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
    Home,
    ChevronLeft,
    ChevronRight,
    Users,
    Settings,
    Calendar,
    BarChart3,
    HelpCircle,
    ClipboardList,
    LibraryBig,
    User,
    LogIn,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const SidebarLink = ({ icon: Icon, label, isCollapsed, link }) => {
    return (
        <NavLink to={link}>
            {({ isActive }) => (
                <motion.div
                    className={`w-full relative flex flex-row h-10 items-center justify-start rounded-md transition-colors duration-200
                        ${
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        }
                        ${isCollapsed ? "justify-center rounded-lg" : "px-5"}
                    `}
                    initial={false}
                    animate={{
                        backgroundColor: isActive ? "" : "transparent",
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {isActive && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 w-1 h-full dark:bg-slate-200 bg-slate-800 rounded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    <motion.div
                        animate={{
                            marginRight: isCollapsed ? 0 : 8,
                            scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon className="h-5 w-5 text-xl" size={24} />
                    </motion.div>

                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {label}
                        </motion.span>
                    )}
                </motion.div>
            )}
        </NavLink>
    );
};

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme } = useThemeStore();
    const isDarkMode = theme === "dark";

    const { logout, isAuthenticated, role } = useAuthStore();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const sidebarVariants = {
        expanded: { width: 240 },
        collapsed: { width: 80 },
    };

    return (
        <motion.div
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            transition={{ duration: 0.3 }}
            className="h-screen sticky top-0 z-30 bg-sidebar border-r border-sidebar-border flex flex-col"
        >
            <div className="flex items-center justify-between px-4 h-16">
                <motion.div
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`font-semibold text-xl ${
                        isCollapsed ? "hidden" : "block"
                    }`}
                >
                    <div className="flex gap-1 items-end justify-center">
                        CDMS{" "}
                        <div className="h-2 w-2 mb-1 bg-green-500 rounded-full"></div>
                    </div>
                </motion.div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <Separator className="bg-sidebar-border" />

            <div className="flex-1 overflow-auto p-3 flex flex-col gap-1">
                { role === "hod" && (
                    <SidebarLink
                        icon={Home}
                        label="Dashboard"
                        isActive={true}
                        isCollapsed={isCollapsed}
                        link={"/"}
                    />
                )}

                {role !== "external"   && (
                <SidebarLink
                    icon={ClipboardList}
                    label="Notices"
                    isCollapsed={isCollapsed}
                    link={"/notice-board"}
                />
                )}

                <SidebarLink
                    icon={LibraryBig}
                    label="Syllabus"
                    isCollapsed={isCollapsed}
                    link={"/syllabus"}
                />
                {(role === "hod" ||
                    role === "external") && (
                    <SidebarLink
                        icon={BarChart3}
                        label="Cirtificates"
                        isCollapsed={isCollapsed}
                        link={"/cirtificates"}
                    />
                )}
                {(role === "hod" || role === "admin" || role === "faculty") && (
                    <SidebarLink
                        icon={Users}
                        label="Meetings"
                        isCollapsed={isCollapsed}
                        link={"/meetings"}
                    />
                )}

                {role !== "external"  && (
                <SidebarLink
                    icon={Calendar}
                    label="Routines"
                    isCollapsed={isCollapsed}
                    link={"/routines"}
                />
                )}
                {(role === "hod" || role === "admin") && (
                    <SidebarLink
                        icon={User}
                        label="Members"
                        isCollapsed={isCollapsed}
                        link={"/members"}
                    />
                )}

                {isAuthenticated && (
                    <div
                        className={`mt-auto flex flex-col gap-1 ${
                            isCollapsed ? "" : "pt-4"
                        }`}
                    >
                        <div className="w-full h-10">
                            <Button
                                variant="destructive"
                                className="w-full text-base flex flex-row items-center justify-center"
                                onClick={logout}
                            >
                                <LogIn />
                                {!isCollapsed && "Logout"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
