import { useAppSelector } from "@/store/reduxHooks";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
    roles: string[];
}

const AuthenticateRole = ({ roles }: Props) => {
    const userRole: string = useAppSelector((state) => state.user.role);
    const navigate = useNavigate();

    const isPermitted = roles.includes(userRole);

    useEffect(() => {
        if (!isPermitted) {
            toast.warning("User not allowed");
            navigate("/syllabus");
        }
    }, [isPermitted, navigate]);

    return isPermitted ? <Outlet /> : null;
};

export default AuthenticateRole;
