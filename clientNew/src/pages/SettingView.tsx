import { useEffect, useRef, useState } from "react";
import apiStore from "@/api/apiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IsMobile } from "@/components/hook/IsMobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "@/store/reduxSlice";
const SettingView = () => {
    const [user, setUser] = useState({ email: "", name: "", url: "",phoneNo:"" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isMobile = IsMobile("(max-width: 768px)");
    const [loader, setLoader] = useState(false);
    const [isSend, setIsSend] = useState(false);
    // const [otp, setOTP] = useState("");
    const [otpSending,setOTPSending]=useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpArray, setOtpArray] = useState(Array(6).fill(""));
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate=useNavigate()
     const dispatch = useAppDispatch();
    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
    
        if (!/^\d?$/.test(value)) return; // only allow a single digit
    
        const newOtp = [...otpArray];
        newOtp[index] = value;
        setOtpArray(newOtp);
    
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };
    
    const handleOTPKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpArray[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };
    
    const getOtpValue = () => otpArray.join("");
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiStore.fetchUser();
                const data = res.data.data;
                setUser({
                    email: data.email || "",
                    name: data.name || "",
                    phoneNo:data.phoneNo||"",
                    url: data.profile_pic?.url || "",
                });
            } catch (err) {
                console.error("Fetch user failed:", err);
            }
        };
        fetchUser();
    }, []);

    const email = useAppSelector((state) => state.user.userEmail);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setUser((prev) => ({ ...prev, url: imageUrl }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        const formData = {
            email: user.email,
            name: user.name,
            phoneNo:user.phoneNo,
            photo: selectedFile || null,
        };

        try {
            const response = await apiStore.updateUser(formData);
            console.log("User updated:", response.data);
        } catch (err) {
            console.error("Update failed:", err);
        } finally {
            setLoader(false);
        }
    };

    const generateOTP = async () => {
        if (!isSend) {
            // Send OTP

        setOTPSending(true)
            try {
                await apiStore.generateOTP();
                setIsSend(true);
            } catch (error) {
                console.error("Failed to send OTP", error);
            }finally{

        setOTPSending(false)
            }
        } else {
            // Verify OTP
        setOTPSending(true)
            try {
                await apiStore.verifyotp(getOtpValue());
                setIsOtpVerified(true); // ✅ OTP verified
            } catch (error) {
                console.error("Failed to verify OTP", error);
            } finally {
                // setOTP("");
                setIsSend(false);
                setOTPSending(false)
            }
        }
    };

    const handlePasswordSubmit = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await apiStore.updatePassword( password ); // You should define this API method
            console.log('password=>',password);
            
            // alert("Password updated successfully.");
            setPassword("");
            setConfirmPassword("");

        setIsOtpVerified(false); 
        } catch (err) {
            console.error("Password update failed", err);
        }
    };

    const deleteAccount=async()=>{
        try {
            await apiStore.deleteUser()
            // await apiStore.logout()
            dispatch(logout())
            toast.success("User Delete successfully")
            navigate("/syllabus")
        } catch (error:any) {
            
        }
    }

    return (
        <div className={`flex justify-center px-4 ${isMobile ? "pt-10" : "pt-10"}`}>
            <Tabs defaultValue="profile" className="w-[400px]">
                <TabsList className="w-full">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="delete">Delete Profile</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <form
                        onSubmit={handleSubmit}
                        className="shadow-lg rounded-xl p-6 w-full max-w-md space-y-6"
                        encType="multipart/form-data"
                    >
                        <div className="text-center">
                            <Label className="text-lg font-semibold">Profile Picture</Label>
                            <div
                                onClick={handleImageClick}
                                className="my-3 cursor-pointer flex justify-center"
                            >
                                <img
                                    src={
                                        user.url || "https://via.placeholder.com/96x96.png?text=Upload"
                                    }
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover border hover:opacity-80 transition"
                                />
                            </div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                value={user.name}
                                onChange={(e) =>
                                    setUser((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={user.email}
                                onChange={(e) =>
                                    setUser((prev) => ({ ...prev, email: e.target.value }))
                                }
                            />
                        </div>

                        <div>
                            <Label>Phone No</Label>
                            <Input
                                type="tel"
                                value={user.phoneNo}
                                onChange={(e) =>
                                    setUser((prev) => ({ ...prev, phoneNo: e.target.value }))
                                }
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loader}>
                            Save Changes
                        </Button>
                    </form>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                    <div className="shadow-lg rounded-xl p-6 w-full max-w-md space-y-5 border">
                        {!isOtpVerified ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium " hidden={!isSend}>Enter OTP</Label>
                                    <div className="w-full flex justify-between gap-2 px-2 py-2" hidden={!isSend}>
                {otpArray.map((digit, index) => (
                    <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-xl font-extrabold tracking-widest rounded-md shadow-md shadow-gray-400 focus:shadow-lg focus:shadow-gray-800 transition-all duration-200"
                    />
                ))}
                </div>

                </div>
                <Button
                    onClick={generateOTP}
                    className="w-full mt-4 hover:scale-105 hover:bg-[#696464]"
                    variant={isSend ? "secondary" : "default"}
                    disabled={otpSending}
                >
                    {isSend ? "Verify OTP" : "Send OTP"}
                </Button>
            </>
        ) : (
            <>
                {/* New Password */}
                <div className="space-y-2 relative">
                    <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                    <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <div
                        className="absolute top-9 right-3 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 relative">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />
                    <div
                        className="absolute top-9 right-3 cursor-pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </div>
                </div>

                <Button
                    onClick={handlePasswordSubmit}
                    className="w-full mt-4"
                >
                    Update Password
                </Button>
            </>
                )}
            </div>
                </TabsContent>
                {/* Delete Profile Tab */}
                <TabsContent value="delete">
                    <div className="shadow-lg rounded-xl p-6 w-full max-w-md space-y-5 border">
                        {!isOtpVerified ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium " hidden={!isSend}>Enter OTP</Label>
                                    <div className="w-full flex justify-between gap-2 px-2 py-2" hidden={!isSend}>
                {otpArray.map((digit, index) => (
                    <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-xl font-extrabold tracking-widest rounded-md shadow-md shadow-gray-400 focus:shadow-lg focus:shadow-gray-800 transition-all duration-200"
                    />
                ))}
                </div>

                </div>
                <Button
                    onClick={generateOTP}
                    className="w-full mt-4 hover:scale-105 hover:bg-[#696464]"
                    variant={isSend ? "secondary" : "default"}
                    disabled={otpSending}
                >
                    {isSend ? "Verify OTP" : "Send OTP"}
                </Button>
            </>
        ) : (
            <>
                

               

                <Button
                    onClick={deleteAccount}
                    className="w-full mt-4 bg-red-400 hover:bg-red-500"
                >
                    Delete Account
                </Button>
            </>
                )}
            </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default SettingView;
