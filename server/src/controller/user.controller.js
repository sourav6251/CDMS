import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { sendResponse } from "../utils/response.handler.js";
import userService from "../services/user.service.js";
import { removeCookie, sendCookie } from "../utils/tokenGenarate.js";
import imagekitService from "../services/imagekit.service.js";
class UserController {
    async createUser(req, res) {
        const { password, email, name, role } = req.body;
        console.log("password=>",password);
        console.log("email=>",email);
        console.log("name=>",name);
        console.log("role=>",role);
        
        try {
            const result = await userService.createUser({
                password,
                email,
                name,
                role,
            });
            console.log("result=>", result);

            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "User Creation success.",
                data: result,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            // let message = RESPONSE_MESSAGES.INTERNAL_ERROR;
            if (
                error.message == "User already exist"
            ) {
                status = HTTP_STATUS.CONFLICT;
                // message = RESPONSE_MESSAGES.USER_EXIST;
            }if (
                error.message === "Can not create HOD"
            ) {
                status = HTTP_STATUS.BAD_REQUEST;
                // message = RESPONSE_MESSAGES.USER_EXIST;
            }
            sendResponse(res, {
                status,
                success: false,
                // message,
                error: error.message || "Failed to create user.",
            });
        }
        // return createUser(req, res);
    }

    async createHod(req, res) {
        const { email, name, password } = req.body;
        try {
            const result = await userService.createHod({
                email,
                name,
                password,
            });
            sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "HOD created successfully.",
                data: result,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            let message = RESPONSE_MESSAGES.INTERNAL_ERROR;
            if (error.message === "User already exist") {
                status = HTTP_STATUS.BAD_REQUEST;
                message = RESPONSE_MESSAGES.USER_EXIST;
            }
            sendResponse(res, {
                status,
                success: false,
                message,
                error: error.message || "Failed to create HOD.",
            });
        }
    }

    async generateOtp(req, res) {
        try {
            const {email} = req.body;
            const id = req.user?.id || null;
            console.log("req.user?.id=>",id);
            
            const otp = await userService.generateOtp(email,id);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "OTP sent successfully.",
                data: { otp },
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.BAD_REQUEST,
                success: false,
                message: error.message,
            });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { otp, email } = req.body;

            const id = req.user?.id || null;
            await userService.verifyOtp({ otp, email,id });
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "OTP verified successfully.",
                error:"OTP verified successfully."
                // data: user,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (
                error.message === "User not found" ||
                error.message === "Invalid or expired OTP"
            ) {
                status = HTTP_STATUS.BAD_REQUEST;
            }
            sendResponse(res, {
                status,
                success: false,
                message: error.message,
                error:error.message,
            });
        }
    }

    async loginUser(req, res) {
        console.log("Enterinto login");
        
        try {
            const { email, password } = req.body;
            const user = await userService.loginUser({ email, password });

            sendCookie(user, res, "Login successful", HTTP_STATUS.OK);
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (
                error.message === "Invalid email or password" ||
                error.message === "Contact with HOD for approval"
            ) {
                status = HTTP_STATUS.UNAUTHORIZED;
            }
            sendResponse(res, {
                status,
                success: false,
                message: error.message,
                error: error.message,
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.user;
            const user = await userService.getUserById(id);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "User fetched successfully.",
                data: user,
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.NOT_FOUND,
                success: false,
                message: error.message,
                error,
            });
        }
    }

    async getAllUser(req, res) {
        try {
            const users = await userService.getAllUser();
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Users fetched successfully.",
                data: users,
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: error.message,
                error,
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.user;
            await userService.deleteUser(id);
            removeCookie(res, "User deleted successfully.");
            // sendResponse(res, {
            //     status: HTTP_STATUS.OK,
            //     success: true,
            //     message: "User deleted successfully.",
            // });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Failed to delete user.",
                error,
            });
        }
    }
    async hoddelete(req, res) {
        try {
            const id  = req.params.userID;
            await userService.hoddelete(id);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "User deleted successfully.",
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Failed to delete user.",
                error,
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { name, email } = req.body;
            const { id } = req.user;
            let bufferFile = null;
            let originalName = null;
            if (req.file) {
                bufferFile = req.file.buffer;
                originalName = req.file.originalname;
              }
          

            console.log("Email=>",email);
            
            await userService.updateUser({
                id,
                name,
                email,
                bufferFile,
                originalName,
            });
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "User updated successfully.",
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Failed to update user.",
                error,
            });
        }
    }

    async uploadPhoto(req, res) {
        console.log("Enter into Controller");

        const bufferFile = req.file.buffer;
        const originalName = req.file.originalname;
        try {
            const response = await imagekitService.uploadImage(
                bufferFile,
                originalName
            );
            console.log("ros=>>>", res);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Image uploaded successfully.",
                data: response,
            });
        } catch (error) {}
    }

    async updatePassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            // const id=
            const id = req.user?.id || null;
console.log("newPassword=>",newPassword);

            const response = await userService.updatePassword({
                email,
                id,
                newPassword,
            });
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Password updated successfully.",
                data: response,
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Failed to update password.",
                error: error.message,
            });
        }
    }

    async logout(req, res) {
        try {
            removeCookie(res, "Logged out successfully.");
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Logged out successfully.",
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Failed to logout.",
                error,
            });
        }
    }

    async approveByHOD(req, res) {
        const id = req.params.userID;
        try {
            const response = await userService.approveByHOD(id);
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Status update successfully",
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                error: error.message,
            });
        }
    }
    async getAllExternalUsers(req, res) {
        try {
            const response = await userService.getAllExternalUsers();
            sendResponse(res, {
                status: HTTP_STATUS.OK,
                success: true,
                message: "Status update successfully",
                data:response
            });
        } catch (error) {
            sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                success: false,
                error: error.message,
            });
        }
    }
}
export default new UserController();
