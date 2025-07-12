import { z } from "zod";

class NoticeboardValidation {
 
    create = z.object({
        body: z.object({
            title: z.string({ required_error: "lTitle is required" })
                .min(3, "Title must be at least 3 characters")
                .max(60, "Title should be within 60 characters")
                .trim(),
            description: z.string(),

            // description: z
            //     .string()
            //     .min(3, "Description must be at least 3 characters")
            //     .max(1000, "Description should be within 500 characters")
            //     .trim()
            //     .optional,
        }),
    });

    // Update Notice
    update = z.object({
        params: z.object({
            noticeId: z.string({ required_error: "Notice ID is required" }),
        }),
        body: z.object({
            title: z
                .string()
                .min(3, "Title must be at least 3 characters")
                .max(60, "Title should be within 60 characters")
                .trim()
                .optional(),

            description: z
                .string()
                .min(3, "Description must be at least 3 characters")
                .max(500, "Description should be within 500 characters")
                .trim()
                .optional(),

            media: z
                .object({
                    url: z.string().url("Invalid URL"),
                    public_id: z.string(),
                })
                .optional(),
        }),
    });

    // Delete Notice
    delete = z.object({
        params: z.object({
            noticeId: z.string({ required_error: "Notice ID is required" }),
        }),
    });
}

export default new NoticeboardValidation();
