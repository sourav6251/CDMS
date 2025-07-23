import {
  Calendar,
  ClipboardList,
  FileBadge,
  HouseIcon,
  LibraryBig,
  Settings,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/reduxHooks";

const MobilFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useAppSelector((state) => state.user.isLogin);

  const slideItems = isLogin
    ? [
        { icon: HouseIcon, path: "/" },
        { icon: FileBadge, path: "/certificate" },
        { icon: Users, path: "/meeting" },
        { icon: ClipboardList, path: "/notice" },
        { icon: LibraryBig, path: "/syllabus" },
        { icon: Calendar, path: "/routine" },
        { icon: Settings, path: "/setting" },
      ]
    : [
        { icon: ClipboardList, path: "/notice" },
        { icon: LibraryBig, path: "/syllabus" },
        { icon: Calendar, path: "/routine" },
      ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-14 bg-sidebarBg backdrop-blur-sm shadow-md flex items-center justify-around z-50 border-t">
      {slideItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="relative flex flex-col items-center justify-center p-2 text-sidebarText hover:text-primary transition-colors"
            title={item.path.replace("/", "") || "Home"}
          >
            <Icon className="w-5 h-5" />
            {isActive && (
              <motion.div
                layoutId="active-line"
                className="w-5 h-[2px] bg-primary rounded-sm mt-1"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobilFooter;
