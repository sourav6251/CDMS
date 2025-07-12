import { z } from "zod";

class MeetingValidation {
    // Create Meeting
    create = z.object({
        body: z.object({
            title: z
                .string({ required_error: "Meeting title is required" })
                .min(3, "Title must be at least 3 characters")
                .max(100, "Title must not exceed 100 characters")
                .trim(),

            description: z
                .string({ required_error: "Meeting description is required" })
                .min(3, "Description must be at least 3 characters")
                .max(1000, "Description must not exceed 1000 characters")
                .trim(),

            meetingTime: z
                .string({ required_error: "Meeting time is required" })
                .min(1, "Meeting time cannot be empty"), // ISO datetime string

            meetingArea: z
                .string({ required_error: "Meeting area is required" })
                .min(3, "Meeting area must be at least 3 characters")
                .max(255, "Meeting area must not exceed 255 characters")
                .trim(),

            usersID: z
                .array(
                    z
                        .string()
                        // .email("Invalid email in joinusList")
                        .min(1, "Add minimum 1 user")
                )
                .min(1, "At least one email is required in joinusList"),
        }),
    });

    // Show Meetings (optional filters)
    showByEmail = z.object({
        params: z.object({
            email: z.string().email(),
        }),
    });

    // Update Meeting
    update = z.object({
        params: z.object({
            meetingId: z.string({ required_error: "Meeting ID is required" }),
        }),
        body: z.object({
            title: z
                .string()
                .min(3, "Title must be at least 3 characters")
                .max(100, "Title must not exceed 100 characters")
                .trim(),
            // .optional(),

            description: z
                .string()
                .min(3, "Description must be at least 3 characters")
                .max(1000, "Description must not exceed 1000 characters")
                .trim(),
            //.optional(),

            meetingTime: z.string(), //.optional(),
            meetingArea: z.string(), //.trim().optional(),
        }),
    });

    // Delete Meeting
    delete = z.object({
        params: z.object({
            meetingId: z.string({ required_error: "Meeting ID is required" }),
        }),
    });   
     // notify Meeting
    notify = z.object({
        params: z.object({
            meetingId: z.string({ required_error: "Meeting ID is required" }),
        }),
    });
}

export default new MeetingValidation();
