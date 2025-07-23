import ExternalDashboard from "@/components/dashboard/ExternalDashboard";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";
import HODDashboard from "@/components/dashboard/HODDashboard";
import { useAppSelector } from "@/store/reduxHooks";

const DashboardView = () => {

    const role=useAppSelector((state)=>state.user.role)
  return (
<div className="w-full h-full">
      {role === "hod" && <HODDashboard />}
      {role === "faculty" && <FacultyDashboard />}
      {role === "external" && <ExternalDashboard />}
      <div className="px-6 py-4">hello</div>
    </div>

  )
};

export default DashboardView;