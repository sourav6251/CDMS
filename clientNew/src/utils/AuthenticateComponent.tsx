import { useAppSelector } from "@/store/reduxHooks";

interface Props {
  roles: string[];
  children: React.ReactNode; // Accepts JSX like <div> or <MyComponent />
}

const AuthenticateComponent = ({ roles, children }: Props) => {
  const userRole: string = useAppSelector((state) => state.user.role);

  const isPermitted = roles.includes(userRole);

  return isPermitted ? <>{children}</> : null;
};

export default AuthenticateComponent;
