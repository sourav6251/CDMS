// utils/RequireLoginRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/reduxHooks";

const RequireLoginRoute = () => {
  const isLogin = useAppSelector((state) => state.user.isLogin);

  return isLogin ? <Outlet /> : <Navigate to="/syllabus" replace />;
};

export default RequireLoginRoute;
