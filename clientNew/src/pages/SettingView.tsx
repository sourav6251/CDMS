import { useEffect, useRef, useState } from "react";
import apiStore from "@/api/apiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IsMobile } from "@/components/hook/IsMobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/store/reduxHooks";
import { Eye, EyeOff } from "lucide-react";
const SettingView = () => {
    const [user, setUser] = useState({ email: "", name: "", url: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isMobile = IsMobile("(max-width: 768px)");
    const [loader, setLoader] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [otp, setOTP] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiStore.fetchUser();
                const data = res.data.data;
                setUser({
                    email: data.email || "",
                    name: data.name || "",
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
            try {
                await apiStore.generateOTP();
                setIsSend(true);
            } catch (error) {
                console.error("Failed to send OTP", error);
            }
        } else {
            // Verify OTP
            try {
                await apiStore.verifyotp(otp);
                setIsOtpVerified(true); // ✅ OTP verified
            } catch (error) {
                console.error("Failed to verify OTP", error);
            } finally {
                setOTP("");
                setIsSend(false);
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
            
            alert("Password updated successfully.");
            setPassword("");
            setConfirmPassword("");

        setIsOtpVerified(false); 
        } catch (err) {
            console.error("Password update failed", err);
        }
    };

    return (
        <div className={`flex justify-center px-4 ${isMobile ? "pt-10" : "pt-20"}`}>
            <Tabs defaultValue="profile" className="w-[400px]">
                <TabsList className="w-full">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
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
                    <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
                    <Input
                        id="otp"
                        type="number"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                    />
                </div>
                <Button
                    onClick={generateOTP}
                    className="w-full mt-4"
                    variant={isSend ? "secondary" : "default"}
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

            </Tabs>
        </div>
    );
};

export default SettingView;
