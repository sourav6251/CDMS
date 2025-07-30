import { z } from "zod";

class UserValidation {
    createUser = z.object({
        body: z.object({
            name: z
                .string()
                .trim()
                .min(3, "Name is required")
                .max(60, "name must be 60 charector or less "),
            email: z.string().trim().email("Invalid email format"),
            password: z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),
            role: z.enum(["faculty", "external", "student", "admin", "hod"], {  //todo Remove Admin ,HOD
                message: "only faculty external student roles are accepeted",
            }),
        }),
    });
    createUserHod = z.object({
        body: z.object({
            name: z
                .string()
                .trim()
                .min(3, "Name is required")
                .max(60, "name must be 60 charector or less "),
            email: z.string().trim().email("Invalid email format"),
            password: z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),
            role: z.enum(["faculty", "external", "student", "hod"], {
                message: "only faculty external student roles are accepeted",
            }),
        }),
    });

    login = z.object({
        body: z.object({
            email: z.string().trim().email("Invalid email format"),
            // role: z.string().trim(),
            password: z.string().trim().min(8, "Password is required"),
        }),
    });

    sendOtp = z.object({
        body: z.object({
            email: z.string(),
        }),
        // body: z.object({
        //     email: z.string().email("Invalid email format"),
        // }),
    });

    verifyOtp = z.object({
        body: z.object({
            email: z.string().email("Invalid email format"),
            otp: z.string().length(6, "OTP must be 6 digits"),
        }),
    });

    updateUser = z.object({
        body: z.object({
            name: z.string().optional(),
            email: z.string().email("Invalid email format").optional(),
        }),
    });

    updatePassword = z.object({
        body: z.object({
            email: z.string().email("Invalid email format"),
            newPassword: z
                .string()
                .min(8, "New password must be at least 8 characters"),
        }),
    });
    approve = z.object({
        params: z.object({
            userID: z.string(),
        }),
    });
}

export default new UserValidation();
