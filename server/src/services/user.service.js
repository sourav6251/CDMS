import { Users } from "../model/user.model.js";
import { genarate6DigitOtp } from "../utils/OtpGenarate.js";
import imagekitService from "./imagekit.service.js";
import { NormalUser } from "../model/normaluser.model.js";
import mailService from "./mail.service.js";

class UserService {
    async createUser({ password, email, name, role }) {
        if (role === "hod") {
            throw new Error("Can not create HOD");
        }

        if (await this.isExist(email)) {
            console.log("User already exist=>>");

            throw new Error("User already exist");
        }
        try {
          return  await Users.create({ name, email, password, role });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createHod({ email, name, password }) {
        if (await this.isExist(email)) {
            throw new Error("User already exist");
        }
        try {
            const user = await Users.create({
                name,
                email,
                password,
                role: "hod",
            });
            // const hod = await Hods.create({ user: user._id });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //todo: add email
    async generateOtp(email) {
        const otp = genarate6DigitOtp();
        try {
            let user = await Users.findOne({email});
            user.otp = otp;
            user.otpExpiary = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
            await user.save();
            const data = {
                name: user.name,
                otp,
            };
           await mailService.sendMailForOTP(user.email, data);
            return "success";
        } catch (error) {
            throw new Error("User not found");
        }
    }

    async verifyOtp({ otp, email }) {
        try {
            let user = await Users.findOne({ email }).select("+otp ");
            if (!user) {
                throw new Error("User not found");
            }
            if (
                String(user.otp) !== String(otp) ||
                user.otpExpiary < Date.now()
            ) {
                throw new Error("Invalid or expired OTP");
            }
            user.otp = null;
            user.otpExpiary = null;
            user.isVerify = true;
            await user.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    //todo: add email
    async loginUser({ email, password }) {
        try {
            const user = await Users.findOne({ email }).select("+password");
            console.log("user1=>");

            if (!user || !(await user.comparePassword(password))) {
                console.log("user2=>");
                throw new Error("Invalid email or password");
            }
            console.log("user2.1=>");
            if (user.isApproved == true) {
                console.log("user3=>");
                mailService.sendMailForLogin(user.email, "hi");
                return user;
            }
            console.log("user4=>");
            throw new Error("Contact with HOD for approval");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserById(id) {
        try {
            return await Users.findById(id);
        } catch (error) {
            throw new Error("User not found");
        }
    }

    async getAllUser() {
        try {
            const users = await Users.find().select("name email role");
            return users;
        } catch (error) {
            throw new Error("Failed to fetch users");
        }
    }

    async deleteUser(id) {
        try {
            const response = await Users.findByIdAndDelete(id);
            if (!response) {
                throw new Error("user Not exist");
            }
            const data = {
                name: response.name,
                email: response.email,
            };
            mailService.sendMailForDelete(response.email,data);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async hoddelete(id) {
        try {
            const response = await Users.findByIdAndDelete(id);
            if (!response) {
                const response1 = await NormalUser.findByIdAndDelete(id);
                if (!response1) {
                    throw new Error("user Not exist");
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUser({ id, name, email, bufferFile, originalName }) {
        try {
            let user = await Users.findById(id);
            if (!user) {
                throw new Error("User not found");
            }

            if (bufferFile) {
                const { url, publicId } = await imagekitService.uploadImage(
                    bufferFile,
                    originalName
                );

                // Delete old image if exists
                const oldImageID = user.profile_pic?.public_id;
                if (oldImageID) {
                    await imagekitService.deleteImage(oldImageID);
                }

                // Update with new image
                user.profile_pic = { url, public_id: publicId };
            }

            // Update common fields
            user.name = name;
            user.email = email;
            await user.save();

            return user; // ✅ always return updated user
        } catch (error) {
            throw new Error(error.message || "Failed to update user");
        }
    }

    async updatePassword({ email, newPassword }) {
        try {
            let user = await Users.findOne({ email }).select("+password");

            if (!user) {
                throw new Error("User not found");
            }

            user.password = newPassword; // This will trigger the `pre('save')` middleware to hash
            await user.save();
            return "Password updated successfully";
        } catch (error) {
            throw new Error("Failed to update password: " + error.message);
        }
    }

    async isExist(email) {
        return await Users.findOne({ email });
    }
    async approveByHOD(id) {
        try {
            const response = await Users.findByIdAndUpdate(id, {
                isApproved: true,
            });
            if (!response) {
                throw new Error("user not exist");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
export default new UserService();
