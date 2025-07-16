import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import apiStore from "@/api/apiStore";
import { useNavigate } from "react-router-dom";

interface OTPInputProps {
    email: string;
}

interface OtpData {
    otp: string;
    email: string;
}

export function OTPInput({ email }: OTPInputProps) {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(30); // 30 seconds cooldown

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter all 6 digits");
            return;
        }
        const otpData: OtpData = { email, otp };

        try {
            await apiStore.verifyOTP(otpData);
            toast.success("OTP Verified Successfully!");
            navigate("/syllabus")
        } catch (error: any) {
            toast.error("Invalid OTP. Try again.");
        }
    };

    const sendOTP = async () => {
        try {
            await apiStore.sendOTP(email);
            toast.success("OTP sent to your email.");
            setResendDisabled(true);
            setTimer(30); // reset timer
        } catch (error: any) {
            toast.error("Failed to send OTP.");
        }
    };

    useEffect(() => {
        sendOTP();
    }, []);

    // Countdown timer for resend
    useEffect(() => {
        if (!resendDisabled) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [resendDisabled]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-sm p-6 space-y-6 shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-base font-semibold">
                        Verify Your OTP
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </CardHeader>

                <CardContent className="flex justify-center">
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full" onClick={handleVerify}>
                        Verify OTP
                    </Button>

                    <Button
                        variant="ghost"
                        className="text-sm text-blue-600 disabled:opacity-50"
                        onClick={sendOTP}
                        disabled={resendDisabled}
                    >
                        {resendDisabled
                            ? `Resend OTP in ${timer}s`
                            : "Resend OTP"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
