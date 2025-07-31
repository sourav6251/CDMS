import {
  Calendar,
  ClipboardList,
  FileBadge,
  HouseIcon,
  LibraryBig,
  Settings,
  UserCog2Icon,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/reduxHooks";
import AuthenticateComponent from "@/utils/AuthenticateComponent";

const MobilFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useAppSelector((state) => state.user.isLogin);

  const slideItems = 
     [
        { icon: HouseIcon, path: "/"  ,roles: ["admin", "hod", "external","faculty"]},
        { icon: FileBadge, path: "/certificate" ,roles: ["hod", "external"] },
        { icon: Users, path: "/meeting" ,roles: ["hod", "external","faculty"]},
        { icon: ClipboardList, path: "/notice",roles: ["admin", "hod","faculty","user"] },
        { icon: LibraryBig, path: "/syllabus",roles: ["admin", "hod", "external","faculty","user"] },
        { icon: Calendar, path: "/routine" ,roles: ["admin", "hod", "faculty","user"] },
        // { icon: UserCog2Icon,  path: "/member",roles:["hod"] },
        // { icon: Settings, path: "/setting" },
      ]
    

  return (
    <div className="fixed bottom-0 left-0 w-full h-14 bg-sidebarBg backdrop-blur-sm shadow-md flex items-center justify-around z-50 border-t">
      {slideItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
            <AuthenticateComponent roles={item.roles || []} key={idx}>
       
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

        </AuthenticateComponent>
        );
      })}
    </div>
  );
};

export default MobilFooter;
