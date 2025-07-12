import { z } from "zod";

class SyllabusValidation {
    create = z.object({
        body: z.object({
            semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
                required_error: "Semester ID is required",
            }),
            paperCode: z
                .string({
                    required_error: "Paper code is required",
                })
                .min(3, "Paper code must be at least 3 characters")
                .max(20, "Paper code must not exceed 20 characters")
                .trim(),
            paperName: z
                .string({
                    required_error: "Paper name is required",
                })
                .min(3, "Paper name must be at least 3 characters")
                .max(30, "Paper name must not exceed 30 characters")
                .trim(),
        }),
    });

    get=z.object({
        query: z.object({
            semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
                required_error: "Semester ID is required",
            }),
        }),
    });

    update = z.object({
        params: z.object({
            syllabusId: z.string({
                required_error: "Syllabus ID is required",
            }),
        }),
        
    });

    delete = z.object({
        params: z.object({
            syllabusId: z.string({
                required_error: "Syllabus ID is required",
            }),
        }),
    });
}

export default new SyllabusValidation();
