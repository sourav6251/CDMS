import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
    Building2,
    Eye, 
    EyeClosed,
    GraduationCap,
    Loader2,
    UserCog,
    UserPlus,
    Users,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useAuthStore } from "../store/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import apiStore from "../api/apiStore";

interface LoginData {
    email: string;
    password: string;
    role: string; 
}  
const Login = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("role");
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to={"/"} replace />;
    }

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { email, password } = loginForm;

        if (!email || !password || !selectedRole) {
            alert("Please fill in all fields and select a role");
            return;
        }

        try {
            setLoading(true);
           let loginData: LoginData ={
            email:email,
            password:password,
            role:selectedRole
            }
           const response= await apiStore.userlogin(loginData);
           

            const user = response.data?.data;
            useAuthStore.getState().login(user, response?.data?.token);
            console.log("Logged in:", user);
            console.log("response =>>", response);

            navigate("/");
        } catch (error: any) {
            console.error(
                "Login error:"
                //, error.response?.data || error.message
            );
            // alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const loginFormChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [id]: value }));
    };

    const roles = [
        { id: "admin", name: "Admin", icon: <UserCog className="h-10 w-10" /> },
        { id: "hod", name: "H.O.D", icon: <Building2 className="h-10 w-10" /> },
        {
            id: "student",
            name: "Student",
            icon: <GraduationCap className="h-10 w-10" />,
        },
        {
            id: "external",
            name: "External",
            icon: <UserPlus className="h-10 w-10" />,
        },
        {
            id: "faculty",
            name: "Faculty",
            icon: <Users className="h-10 w-10" />,
        },
    ];

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
        setActiveTab("credentials");
    };

    const handleBackToRoles = () => {
        setActiveTab("role");
    };

    return (
        <section className="flex flex-col items-center justify-center h-screen">
            <div className="border border-gray-300 rounded-lg shadow-md fixed top-35">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-[500px]"
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="role" className="w-full">
                            Select Role
                        </TabsTrigger>
                        <TabsTrigger
                            value="credentials"
                            className="w-full"
                            disabled={!selectedRole}
                        >
                            Login Credentials
                        </TabsTrigger>
                    </TabsList>

                    {/* Role Selector */}
                    <TabsContent
                        value="role"
                        className="flex flex-col items-center w-full p-6"
                    >
                        <h2 className="text-xl font-semibold mb-6">
                            Select Your Role
                        </h2>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {roles.map((role) => (
                                <Card
                                    key={role.id}
                                    className={`cursor-pointer transition-all hover:border-[#1163b6] hover:shadow-md ${
                                        selectedRole === role.id
                                            ? "border-[#1163b6]"
                                            : ""
                                    }`}
                                    onClick={() => handleRoleSelect(role.id)}
                                >
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <div className="text-[#1163b6]">
                                            {role.icon}
                                        </div>
                                        <h3 className="mt-3 font-medium">
                                            {role.name}
                                        </h3>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Login Credentials Form */}
                    <TabsContent
                        value="credentials"
                        className="flex flex-col items-center w-full"
                    >
                        <form
                            onSubmit={login}
                            className="w-[70%] flex flex-col gap-y-4 py-5"
                        >
                            <div className="flex items-center justify-center mb-2">
                                <div className="p-3 rounded-full bg-blue-100 text-[#1163b6]">
                                    {
                                        roles.find((r) => r.id === selectedRole)
                                            ?.icon
                                    }
                                </div>
                            </div>
                            <p className="text-center mb-4">
                                Logging in as{" "}
                                <strong>
                                    {
                                        roles.find((r) => r.id === selectedRole)
                                            ?.name
                                    }
                                </strong>
                            </p>
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={loginForm.email}
                                    onChange={loginFormChanges}
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="border flex items-center rounded-md">
                                    <Input
                                        id="password"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="***********"
                                        className="border-0 outline-none"
                                        value={loginForm.password}
                                        onChange={loginFormChanges}
                                    />
                                    <Button
                                        type="button"
                                        className="bg-transparent"
                                        variant="ghost"
                                        onClick={() => setIsVisible(!isVisible)}
                                    >
                                        {isVisible ? <Eye /> : <EyeClosed />}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-1/2"
                                    onClick={handleBackToRoles}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-1/2 bg-[#1163b6] hover:bg-[#1164b6a1]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={20}
                                        />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default Login;
