import { useAppSelector } from "@/store/reduxHooks"
import HODDashboard from "./HODDashboard"
import FacultyDashboard from "./FacultyDashboard"
import ExternalDashboard from "./ExternalDashboard"

const DesktopDashboard = () => {

  const role=useAppSelector((state)=>state.user.role)
  return (
<div className="w-full h-full">
      {role === "hod" && <HODDashboard />}
      {role === "faculty" && <FacultyDashboard />}
      {role === "external" && <ExternalDashboard />}
    </div>

  )
}

export default DesktopDashboard