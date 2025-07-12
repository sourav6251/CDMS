import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import {
    Cirtificates,
    Dashboard,
    Login,
    Meetings,
    Members,
    NotFound,
    NoticeBoard,
    Routines,
    Settings,
    Syllabus,
} from "./pages";


const App = () => (
    <ThemeProvider>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="/routines" element={<Routines />} />
                            <Route
                                path="/cirtificates"
                                element={<Cirtificates />}
                            />
                            <Route path="/meetings" element={<Meetings />} />
                            <Route path="/members" element={<Members />} />
                            <Route path="/notice-board" element={<NoticeBoard />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/syllabus" element={<Syllabus />} />
                        </Route>
                    </Route>
                    <Route path="/login" element={<Login />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </ThemeProvider>
);

export default App;
