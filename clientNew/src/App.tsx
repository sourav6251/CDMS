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

function App() {
    return (
        <>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            element={
                                <AuthenticateRole
                                    roles={[
                                        "admin",
                                        "hod",
                                        "external",
                                        "faculty",
                                    ]}
                                />
                            }
                        >
                            <Route index element={<DashboardView />} />
                            <Route path="meeting" element={<MeetingView />} />
                        </Route>
                        <Route path="/*" element={<NotFound />} />
                        <Route
                            path="/certificate"
                            element={<CertificateView />}
                        />
                        <Route path="/member" element={<MemberView />} />
                        <Route path="/notice" element={<NoticeView />} />
                        <Route path="/routine" element={<RoutineView />} />
                        <Route path="/setting" element={<SettingView />} />
                        <Route path="/syllabus" element={<SyllabusView />} />
                        <Route path="/login" element={<LoginView />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
