import { toast } from "sonner";
import axiosInstance from "./axiosInstance";

interface registerForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}
interface otpData {
    otp: string;
    email: string;
}
interface loginData {
    password: string;
    email: string;
}
interface CertificateFormData {
    // creator: string; // MongoDB ObjectId as string
    memoNumber: string;
    user: string;
    userModel: string;
    designation: string;
    department: string;
    college?: string;
    address?: string;
    examType?: string;
    year?: string;
    semester: string;
    degree?: string;
    paperName: string;
    subject?: string;
    studentsNo: string;
    examinersNo: string;
    dateOfExamination: string;
    timeOfExamination?: string;
    examStart?: string;
    examEnd?: string;
    status: string;
    CertificateType: string;
}

class APIStore {
    handleError = (error: any) => {
        console.log(error);

        if (
            error.response?.status === 400 &&
            Array.isArray(error.response.data.errors)
        ) {
            const errorMessages = error.response.data.errors
                .map((e: any) => `• ${e.message}`) // add bullet point for clarity
                .join("\n"); // separate by new lines

            toast.error(errorMessages); // will display all messages together
        } else {
            toast.error(error.response?.data?.error || "Something went wrong");
        }
    };
    register = async (registerData: registerForm) => {
        const fullName = `${registerData.firstName} ${registerData.lastName}`;
        const formData = {
            name: fullName,
            email: registerData.email,
            password: registerData.password,
            role: registerData.role,
        };

        try {
            await axiosInstance.post("/user/create", formData);
            toast.success("User create successfully");
        } catch (error: any) {
            console.log("error=>", error);

            if (
                error.response?.status === 400 &&
                Array.isArray(error.response.data.errors)
            ) {
                const errorMessages = error.response.data.errors
                    .map((e: any) => `• ${e.message}`) // add bullet point for clarity
                    .join("\n"); // separate by new lines

                toast.error(errorMessages); // will display all messages together
            } else {
                toast.error(
                    error.response?.data?.error || "Something went wrong"
                );
            }
            throw new Error(error.error.status);
        }
    };

    sendOTP = async (email: string) => {
        try {
            await axiosInstance.post("/user/send_otp", { email: email });
            toast.success("OTP send successfully");
        } catch (error: any) {
            toast.error("Something went  wrong");
            throw new Error(error);
        }
    };

    verifyOTP = async (otpData: otpData) => {
        try {
            await axiosInstance.post("/user/verify_otp", otpData);
            // toast.error("OTP verify sucessfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    login = async (loginData: loginData) => {
        try {
            return await axiosInstance.post("/user/login", loginData);
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    logout = async () => {
        try {
            return await axiosInstance.get("/user/logout");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    generateCertificate = async (certificate: CertificateFormData) => {
        try {
            const response = await axiosInstance.post(
                "/certificate",
                certificate
            );
            console.log("response=>",response);
            
        } catch (error: any) {
            console.log("response error=>",error);}
    };
}
export default new APIStore();
