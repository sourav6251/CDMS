import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { toast } from "sonner";
import apiStore from "@/api/apiStore";
import { OTPInput } from "./OtpInput";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { login } from "@/store/reduxSlice";
import { useNavigate } from "react-router-dom";
interface userState {
    isLogin: boolean;
    // userID:String,
    userEmail: string;
    darkMode: boolean;
    role: string;
    profilePic: string;
}

const RegisterPage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [sendOTP, setSendOTP] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "external",
    });
    const darkMode = useAppSelector((state) => state.user.darkMode);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for empty fields
        const hasEmptyField = Object.values(formData).some(
            (value) => value.trim() === ""
        );
        if (hasEmptyField) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            // console.log(formData);

            await apiStore.register(formData);
            setSendOTP(true);
        } catch (error) {}
        // toast.success("Registered Successfully");
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // toast.success("Enter into handleLoginSubmit")
            const response = await apiStore.login(loginData);
            console.log("response=>", response);

            const loginUserData: userState = {
                darkMode: darkMode,
                isLogin: true,
                role: response.data.data.role,
                userEmail: response.data.data.name,
                profilePic: response.data.data.profile_pic.url,
            };
            console.log("response=>", response.data.data.profile_pic.url);
            console.log(
                "profile_pic object =>",
                response.data.data.profile_pic
            );

            dispatch(login(loginUserData));
            navigate("/syllabus")
            toast.success("Login successfully");
        } catch (error) {
            // toast.success("Enter into handleLoginSubmit3")
        }
        // toast.success("Logged in successfully");
        // console.log("Login:", loginData);
    };

    return (
        <div className="flex items-center justify-center h-full w-full p-4">
           
            {sendOTP ? (
                <OTPInput email={formData.email} />
            ) : (
                <>
                    {" "}
                    <Card className="w-full max-w-md px-8 py-6">
                        <div className="text-center mb-5">
                            <h2 className="text-3xl font-bold">
                                {showLogin ? "Sign In" : "Create Account"}
                            </h2>
                        </div>

                        {/* Login Form */}
                        {showLogin ? (
                            <form
                                onSubmit={handleLoginSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <Label
                                        htmlFor="loginEmail"
                                        className="mb-2 block"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                        <Input
                                            id="loginEmail"
                                            type="email"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                            // required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label
                                        htmlFor="loginPassword"
                                        className="mb-2 block"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                        <Input
                                            id="loginPassword"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            required
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>

                                <p className="text-sm text-center">
                                    Don’t have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-blue-600 underline"
                                        onClick={() => setShowLogin(false)}
                                    >
                                        Register
                                    </button>
                                </p>
                            </form>
                        ) : (
                            // Register Form
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <Label htmlFor="firstName">
                                            First Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-1/2">
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                                        <Input
                                            id="confirmPassword"
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirm((prev) => !prev)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showConfirm ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label>Select Role</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={handleRoleChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="external">
                                                External
                                            </SelectItem>
                                            <SelectItem value="faculty">
                                                Faculty
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" className="w-full">
                                    Register
                                </Button>

                                <p className="text-sm text-center">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-blue-600 underline"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </form>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default RegisterPage;
