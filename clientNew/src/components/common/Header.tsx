import { useEffect,  useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { logout, toggleDarkmode } from "@/store/reduxSlice";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IsMobile } from "../hook/IsMobile";
import { useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import apiStore from "@/api/apiStore";
import { toast } from "sonner";
const Header = () => {
    const dispatch = useAppDispatch();
    const darkMode = useAppSelector((state) => state.user.darkMode);
    const isMobile = IsMobile("(max-width: 768px)");
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logoutPopup, setLogoutPopup] = useState(false);
    // const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user.profilePic);
    const name = useAppSelector((state) => state.user.userEmail);
    const isLogin = useAppSelector((state) => state.user.isLogin);
    const role = useAppSelector((state) => state.user.role);
    const handleDarkMode = () => {
        const root = document.documentElement;
        const isDark = root.classList.contains("dark");

        if (isDark) {
            root.classList.remove("dark");
            dispatch(toggleDarkmode(false));
        } else {
            root.classList.add("dark");
            dispatch(toggleDarkmode(true));
        }
    };
    const login = () => {
        if (isLogin) {
            setLogoutPopup(true);
        } else {
            navigate("/login");
        }
    };

    const handeLogout = async () => {
        dispatch(logout());
        try {
            await apiStore.logout();
            toast.success("Logout Successfully")
        } catch (error: any) {}
        setLogoutPopup(false);
        navigate("/syllabus");
    };
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    // Close dropdown on outside click
    // useEffect(() => {
    //     const closeDropdown = (e: MouseEvent) => {
    //         if (
    //             dropdownRef.current &&
    //             !dropdownRef.current.contains(e.target as Node)
    //         ) {
    //             setDropdownOpen(false);
    //         }
    //     };
    //     document.addEventListener("mousedown", closeDropdown);

    //     return () => document.removeEventListener("mousedown", closeDropdown);
    // }, []);

    return (
        <div
            className={`h-12 fixed w-full bg-transparent flex items-center px-4 pt-4 z-50 ${
                isMobile ? "justify-start" : "justify-end"
            }`}
        >
            {logoutPopup && (
                <Dialog open={logoutPopup} onOpenChange={setLogoutPopup}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Logout</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to logout? This will end
                                your current session.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setLogoutPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={ handeLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <img
                                src={profile}
                                className="h-10 w-10 rounded-full bg-slate-200"
                                alt="menu"
                            />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>User Info  `{role}`</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>{name}</DropdownMenuItem>
                        <DropdownMenuItem onClick={login}>
                            {isLogin ? "logout" : "Administrative Login"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleDarkMode}
                            className="flex gap-2 items-center justify-between"
                        >
                            <span className="">Toggle Dark Mode</span>
                            <div className="w-5 h-5 relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {darkMode ? (
                                        <motion.div
                                            key="sun"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute"
                                        >
                                            <Sun className="w-5 h-5 text-yellow-500" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="moon"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute"
                                        >
                                            <Moon className="w-5 h-5 text-gray-700 dark:text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem>Report Bug</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Header;
