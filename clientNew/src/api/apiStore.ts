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
interface FormData {
    title: string;
    description: string;
    meetingTime: string;
    meetingArea: string;
    usersID: string[];
    users: NewUser[];
}
interface NewUser {
    name: string;
    email: string;
    phoneNo?: string;
}
interface NoticeFormFields {
    title: string;
    description: string;
    media?: File | null;
}

interface UpdateNotice{
    _id: string;
    title: string;
    description: string;
    media: File | null;
    user: string;
    createdAt: Date;
    updatedAt: Date;
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
            // role: "hod",
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
          return  await axiosInstance.post("/user/verify_otp", otpData);
            // toast.error("OTP verify sucessfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    login = async (loginData: loginData) => {
        try {
            return await axiosInstance.post("/user/login", loginData);

            toast.success("response");
        } catch (error: any) {
            // toast.error(error.response.data.message)
            toast.error("error");
            // toast.warning("Enter")
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
            console.log("response=>", response);
        } catch (error: any) {
            console.log("response error=>", error);
        }
    };

    //todo:For certificate
    getAllExternalUsers = async () => {
        try {
            const response = await axiosInstance.get("/user/external");
            console.log("response=>", response);
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    getMeetingsByParticipantId = async () => {
        try {
            const response = await axiosInstance.get("/meeting");
            console.log("getMeetingsByParticipantId=>", response);
            toast.success("Featch Meeting successfully");
            return response.data.data;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    getalluser = async () => {
        try {
            const response = await axiosInstance.get("/user/getalluser");
            console.log("response=>", response);
            toast.success("Featch getalluser successfully");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    createMeeting = async (payload: FormData) => {
        try {
            const response = await axiosInstance.post("/meeting", payload);
            console.log("response=>", response);
            toast.success("Featch getalluser successfully");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    updateMeeting = async (meetingID: string, payload: FormData) => {
        try {
            console.log("payload=>", payload);

            const response = await axiosInstance.patch(
                `/meeting/${meetingID}`,
                payload
            );
            // console.log("response=>", response);
            toast.success("Featch getalluser successfully");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    getallMeeting = async () => {
        try {
            const response = await axiosInstance.get("/meeting");
            console.log("response=>", response);
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    deleteMeeting = async (meetingId: string) => {
        try {
            const response = await axiosInstance.delete(
                `/meeting/${meetingId}`
            );
            console.log("response=>", response);
            toast.success("Featch getalluser successfully");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    notifyMeeting = async (meetingId: string) => {
        try {
            const response = await axiosInstance.get(
                `/meeting/notify/${meetingId}`
            );
            console.log("response=>", response);
            toast.success("Successfully notify");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    getallNotice = async () => {
        try {
            const response = await axiosInstance.get("/noticeboard");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    addNotice = async (payload: NoticeFormFields) => {
        console.log("payload=>", payload);
        const form = new FormData();

        form.append("title", payload.title);
        form.append("description", payload.description);
        if (payload.media != null) {
            form.append("media", payload.media);
        }
        try {
            const response = await axiosInstance.post("/noticeboard", form);
            console.log("noticeboard response=>", response);
            toast.success("Featch getalluser successfully");
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };


    deleteNotice = async (noticeId: string) => {
        try {
            await axiosInstance.delete(`/noticeboard/${noticeId}`);
            toast.success("Notice delete successfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    updateNotice = async (noticeId: string,payload: NoticeFormFields) => {
        const form=new FormData();
        form.append("title",payload.title)
        form.append("description",payload.description)
        if (payload.media!=null) {
            
        form.append("media",payload.media)
        }
     console.log("form=>",form.get("media"));
     
        try {
            await axiosInstance.patch(`/noticeboard/${noticeId}`,form);
            toast.success("Notice updated successfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    getallSyllabus = async (semester:string) => {
        try {
            const response = await axiosInstance.get("/syllabus",{
                params: {
                    semester,
                },
            });
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    addSyllabus = async (payload:any) => {
       
        try {
            const response = await axiosInstance.post("/syllabus", payload);
            console.log("syllabus response=>", response);
            toast.success("Featch syllabus successfully");
            
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    updateSyllabus = async (sylabusID:string,payload:any) => {
       
        try {
            const response = await axiosInstance.patch(`/syllabus/${sylabusID}`, payload);
            console.log("syllabus response=>", response);
            toast.success("Featch syllabus successfully");
            
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    deleteSyllabus = async (syllabusID:string) => {
       
        try {
            const response = await axiosInstance.delete(`/syllabus/${syllabusID}`, );
            console.log("syllabus response=>", response);
            // toast.success("Featch syllabus successfully");
            
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };

    addRoutine=async(payload:any)=>{
        try {
          const response=  await axiosInstance.post("/routines",payload)
          console.log("response=>",response);
          
        } catch (error:any) {
            
        }

    }

    showRoutine = async (semID:string) => {
        try {
           
          const response=  await axiosInstance.get(`/routines/${semID}`)
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };
    
    fetchUser = async () => {
        try {
           
          const response=  await axiosInstance.get(`/user/getuser`)
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };   

    updateUser = async (payload:any) => {
        console.log("payload=>",payload.email);
        
        const form=new FormData();
        form.append("email",payload.email)
        form.append("name",payload.name)
        if (payload.photo) {
            form.append("photo",payload.photo)
        }
        try {
           
          const response=  await axiosInstance.put(`/user`,form)
            return response;
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error);
        }
    };
   
    generateOTP=async()=>{
        console.log("Enter into generateOTP");
        
        try {
          const response=  await axiosInstance.post("/user/generate_otp")
        } catch (error:any) {
            this.handleError(error)
        }
    }

    verifyotp = async (otpData: string) => {
        try {
           await axiosInstance.post("/user/verifyotp", {otp:otpData});
            toast.success("OTP verify sucessfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    updatePassword = async (password: string) => {
        try {
           await axiosInstance.put("/user/updatepassword", {newPassword:password});
            toast.success("Password update sucessfully");
        } catch (error: any) {
            this.handleError(error);
            throw new Error(error.error.status);
        }
    };

    deleteRoutine=async(routineId:string, timeSlotId:string)=>{
        try {
            await axiosInstance.delete("/routines", {
                params: {
                  routineId: routineId,
                  timeSlotId: timeSlotId,
                },})
        } catch (error:any) {
            this.handleError(error)
            
        }
    }   
    
    getUserScheduleForToday=async()=>{
        try {
            return await axiosInstance.get("/routines")
        //   console.log("routine=>",routine);
        //   return routine;
          
        } catch (error:any) {
            this.handleError(error)
            
        }
    }
}
export default new APIStore();
  