import { z } from "zod";

class RoutionValidation {
    create = z.object({
        body: z.object({
            semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
                required_error: "Semester is required",
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
            // professor: z.string({
            //     required_error: "Professor ID is required",
            // }),
            dayName: z.enum(
                [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ],
                {
                    required_error: "Day name is required",
                }
            ),
            startTime: z.string({
                required_error: "Start time is required",
            }),
            endTime: z.string({
                required_error: "End time is required",
            }),
        }),
    });

    show = z.object({
        params: z.object({
            semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
                required_error: "Semester is required",
            }),
            // userID: z.string({
            //     required_error: "User ID is required",
            // }),
        }),
    });

    delete = z.object({
        query: z.object({
            routineId: z.string({
                required_error: "routineId is required",
            }),
            timeSlotId: z.string({
                required_error: "timeSlotId is required",
            }),
        }),
    });
}

export default new RoutionValidation();
