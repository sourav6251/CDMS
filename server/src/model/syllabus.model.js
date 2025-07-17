import { model, Schema } from "mongoose";

const mediaSchema = new Schema({
    mediaUrl: {
        type: String,
        required: [true, "Media URL is required"],
        maxLength: [100, "Media URL should be at most 100 characters"],
        minLength: [3, "Media URL must be at least 3 characters"],
        trim: true,
    },
    public_id: {
        type: String,
        required: [true, "Public ID is required"],
        maxLength: [100, "Public ID should be at most 100 characters"],
        minLength: [3, "Public ID must be at least 3 characters"],
        trim: true,
    },
}, { timestamps: true });

const syllabusSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    semester: {
        type: String,
        ref: "semester",
        enum:["1", "2", "3", "4", "5", "6", "7", "8"],
        required: true,
    },
    paperCode: {
        type: String,
        required: [true, "Paper code is required"],
        maxLength: [10, "Paper code should be at most 10 characters"],
        minLength: [3, "Paper code must be at least 3 characters"],
        trim: true,
    },
    paperName: {
        type: String,
        // required: [true, "Paper name is required"],
        maxLength: [50, "Paper name should be at most 10 characters"],
        minLength: [3, "Paper name must be at least 3 characters"],
        trim: true,
    },
    media: [mediaSchema],
}, { timestamps: true });

export const Syllabus = model("syllabus", syllabusSchema);