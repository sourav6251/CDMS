import DesktopDashboard from "@/components/dashboard/DesktopDashboard";
import MobileDashboard from "@/components/dashboard/MobileDashboard";
import { IsMobile } from "@/components/hook/IsMobile";

const DashboardView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    return isMobile ? (
        <div className="h-full w-full flex justify-center items-center">
            <MobileDashboard />
        </div>
    ) : (
        <div className="h-full w-full flex justify-center items-center">
            <DesktopDashboard />
        </div>
    );
};

export default DashboardView;
//todo:Dashboard