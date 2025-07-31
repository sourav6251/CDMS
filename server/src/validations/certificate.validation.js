import { z } from "zod";

class CertificateValidation {
    // create
    create = z.object({
        body: z.object({
            // user: z.string({ required_error: "HOD ID is required" }),
            department: z.string({
                required_error: "Department ID is required",
            }),
            // semester: z.array({ required_error: "Semester ID is required" }),
            semester: z.array(z.string({ required_error: "Semester is required" })).min(1),
            // paperCode: z
            //     .string({ required_error: "Paper code is required" })
            //     .min(3, "Paper code must be at least 3 characters")
            //     .max(10, "Paper code must not exceed 10 characters")
            //     .trim(),
            paperName: z
                .string({ required_error: "Paper name is required" })
                .min(3, "Paper name must be at least 3 characters")
                .max(50, "Paper name must not exceed 50 characters")
                .trim(),
            // studentsNo: z
            //     .number({ required_error: "Students number is required" })
            //     .min(1, "Students number must be greater than 1")
            //     .max(1000, "Students number must be less than 1000"),
            dateOfExamination: z
                .string({ required_error: "Date of examination is required" }) // ISO string
                .min(1, "Date of examination cannot be empty"),
            designation: z
                .string({ required_error: "Designation is required" })
                .min(3, "Designation must be at least 3 characters")
                .max(100, "Designation must not exceed 100 characters")
                .trim(),
        }),
    });

    //update
    update = z.object({
        params: z.object({
            certificateId: z.string({
                required_error: "Certificate ID is required",
            }),
        }),
    });

    //status update
    statusUpdate = z.object({
        params: z.object({
            certificateId: z.string({
                required_error: "Certificate ID is required",
            }),
        }),
        body: z.object({
            status: z.string,
            memoNumber: z.string,
        }),
    });

    //delete
    delete = z.object({
        params: z.object({
            certificateId: z.string({
                required_error: "Certificate ID is required",
            }),
        }),
    });
}

export default new CertificateValidation();
