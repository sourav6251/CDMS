import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import NotFound from "./components/common/NotFound";
import CertificateView from "./pages/CertificateView";
import DashboardView from "./pages/DashboardView";
import MeetingView from "./pages/MeetingView";
import MemberView from "./pages/MemberView";
import NoticeView from "./pages/NoticeView";
import RoutineView from "./pages/RoutineView";
import SettingView from "./pages/SettingView";
import SyllabusView from "./pages/SyllabusView";
import AuthenticateRole from "./utils/AuthenticateRole";
import { Toaster } from "sonner";
import Register from "./components/auth/RegisterPage";
import LoginView from "./pages/LoginView";
import RequireLoginRoute from "./utils/RequireLoginRoute";
import { useAppSelector } from "./store/reduxHooks";
import { Navigate } from "react-router-dom";

function App() {
    const isLogin=useAppSelector((state)=>state.user.isLogin)
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* ✅ Protected routes (requires login) */}
                        <Route element={<RequireLoginRoute />}>
                            <Route
                                element={
                                    <AuthenticateRole
                                        roles={["admin", "hod", "external"]}
                                    />
                                }
                            >
                                <Route
                                    path="certificate"
                                    element={<CertificateView />}
                                />
                            </Route>
                            <Route index element={<DashboardView />} />
                            <Route path="meeting" element={<MeetingView />} />

                            <Route path="member" element={<MemberView />} />
                            <Route path="setting" element={<SettingView />} />
                        </Route>

                        {/* ✅ Public routes */}
                        <Route path="notice" element={<NoticeView />} />
                        <Route path="syllabus" element={<SyllabusView />} />
                        <Route path="routine" element={<RoutineView />} />
                        {}
                        {/* <Route path="login" element={<LoginView />} /> */}
                        <Route
                            path="login"
                            element={isLogin ? <Navigate to="/syllabus" replace /> : <LoginView />}
                            />

                        <Route path="register" element={<Register />} />
                        <Route path="/*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
