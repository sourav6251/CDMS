import {
    Calendar,
    ChevronLeft,
    ClipboardList,
    FileBadge,
    HouseIcon,
    LibraryBig,
    Settings,
    Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthenticateComponent from "@/utils/AuthenticateComponent";

interface SlidebarProps {
    minimize: boolean;
    setMinimize: React.Dispatch<React.SetStateAction<boolean>>;
}

const Slidebar = ({ minimize, setMinimize }: SlidebarProps) => {
    const navigate = useNavigate();

    const slideItems = [
        { icon: HouseIcon, name: "Dashboard", path: "/" ,roles: ["admin", "hod", "external","faculty"]},
        { icon: FileBadge, name: "Certificate", path: "/certificate",roles: ["hod", "external"] },
        { icon: Users, name: "Meeting", path: "/meeting" ,roles: ["hod", "external","faculty"]},
        { icon: ClipboardList, name: "Notice", path: "/notice" ,roles: ["admin", "hod","faculty","user"]},
        { icon: LibraryBig, name: "Syllabus", path: "/syllabus" ,roles: ["admin", "hod", "external","faculty","user"]},
        { icon: Calendar, name: "Routine", path: "/routine",roles: ["admin", "hod", "faculty","user"] },
        { icon: Settings, name: "Setting", path: "/setting",roles: ["admin", "hod", "external","faculty"] },
    ];

    return (
        <motion.div
            animate={{ width: minimize ? "15rem" : "3rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen text-sidebarText border-r shadow-sm overflow-hidden fixed"
        >
            <div className="pt-14 space-y-2">
            {slideItems.map((item, idx) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
        <AuthenticateComponent roles={item.roles || []} key={idx}>
            <div
                onClick={() => navigate(item.path)}
                className={`flex items-center px-2 py-2 cursor-pointer transition-all rounded-md relative
                  ${minimize ? "justify-start gap-3 mx-3" : "justify-center ml-1"}
                  ${isActive ? "bg-slate-100 text-primary" : "hover:bg-slate-200"}
                `}
            >
                {isActive && (
                    <motion.span
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                    />
                )}
                <Icon className="w-5 h-5" />
                {minimize && <span className="text-sm">{item.name}</span>}
            </div>
        </AuthenticateComponent>
    );
})}

            </div>

            <button
                onClick={() => setMinimize((prev) => !prev)}
                className="absolute bottom-4 right-0 p-2"
            >
                <ChevronLeft
                    className={`transition-transform duration-300 ${
                        !minimize ? "rotate-180" : ""
                    }`}
                />
            </button>
        </motion.div>
    );
};

export default Slidebar;
