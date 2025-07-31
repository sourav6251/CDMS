import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Slidebar from "./Slidebar";
import MobilFooter from "./MobilFooter";
import { IsMobile } from "../hook/IsMobile";
import { useState } from "react";
import { motion } from "framer-motion";
const Layout = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const [minimize, setMinimize] = useState(false);
    return isMobile ? (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow  mt-14 pb-14">
                <Outlet />
            </div>{!isLoginPage &&
            <MobilFooter />}
        </div>
    ) : (
        <>
            <Header />
            <div className="flex h-screen w-full ">
            {!isLoginPage && <Slidebar minimize={minimize} setMinimize={setMinimize} />}
                <motion.div
                    initial={false}
                    animate={{
                        paddingLeft: minimize ? "15rem" : "3rem",
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                    className="pt-14 h-full w-full "
                >
                    <Outlet />
                </motion.div>
            </div>
        </>
    );
};

export default Layout;
