import { model, Schema } from "mongoose";
import { type } from "os";

const routineSchema = new Schema(
    {
        // user : {
        //     type : Schema.Types.ObjectId,
        //     ref : 'user',
        //     required : true ,
        // },
        // department : {
        //     type : String,
        //     default:"Computer Science",
        //     required : true ,
        // },
        semester: {
            type: String,
            enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
            required: true,
        },
        schedules: [
            {
                dayName: {
                    type: String,
                    enum: [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ],
                    required: [true, "days are required !"],
                    maxLength: [15, "day name should be in 15 letter"],
                    minLength: [3, "day name must be in 3 letter "],
                    trim: true,
                },
                timeSlots: [
                    {
                        paperCode: {
                            type: String,
                            required: [true, "paperCode is required !!"],
                            maxLength: [10, "paperCode should be in 10 letter"],
                            minLength: [3, "paperCode  must be in 3 letter"],
                            trim: true,
                        },
                        paperName: {
                            type: String,
                        },
                        professor: {
                            type: Schema.Types.ObjectId,
                            required: true,
                            refPath: "professorModel",
                        },
                        professorModel: {
                            type: String,
                            required: true,
                            enum: ["user", "normaluser"],
                        },

                        startTime: {
                            type: String,
                            required: true,
                        },
                        endTime: {
                            type: String,
                            required: true,
                        },
                    },
                ],
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

export const Routines = model("routine", routineSchema);
