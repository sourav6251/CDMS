
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, ChevronLeft, ChevronRight, PieChart, Users, 
  Settings, Calendar, MessageSquare, BarChart3, 
  HelpCircle
} from 'lucide-react';

const SidebarLink = ({ icon: Icon, label, isActive, isCollapsed }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'}`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {!isCollapsed && <span>{label}</span>}
    </Button>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useAppSelector((state) => state.theme);

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
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3 }}
      className="h-screen sticky top-0 z-30 bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      <div className="flex items-center justify-between px-4 h-16">
        <motion.div
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className={`font-semibold text-xl ${isCollapsed ? 'hidden' : 'block'}`}
        >
          Dashboard
        </motion.div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-1">
        <SidebarLink icon={Home} label="Dashboard" isActive={true} isCollapsed={isCollapsed} />
        <SidebarLink icon={PieChart} label="Analytics" isCollapsed={isCollapsed} />
        <SidebarLink icon={Users} label="Customers" isCollapsed={isCollapsed} />
        <SidebarLink icon={BarChart3} label="Reports" isCollapsed={isCollapsed} />
        <SidebarLink icon={Calendar} label="Calendar" isCollapsed={isCollapsed} />
        <SidebarLink icon={MessageSquare} label="Messages" isCollapsed={isCollapsed} />
        
        <div className={`mt-auto ${isCollapsed ? '' : 'pt-4'}`}>
          <SidebarLink icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          <SidebarLink icon={HelpCircle} label="Help" isCollapsed={isCollapsed} />
        </div>
      </div>
    </motion.div>
  );
}
