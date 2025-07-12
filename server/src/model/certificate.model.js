import { model, Schema } from "mongoose";
const certificateSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        memoNumber: {
            type: String,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "userModel", // dynamic reference
        },
        userModel: {
            type: String,
            required: true,
            enum: ["user", "normaluser"],
        },
        designation: {
            type: String,
            required: true,
            enum: [
                "SACT",
                "Professor",
                "Associate Professor",
                "Assistant Professor",
            ],
        },
        department: {
            type: String,
            default: "Computer Science",
            required: true,
        },
        college: {
            type: String,
        },
        address: {
            type: String,
        },
        examType: {
            type: String,
            enum: ["Theory", "Practical"],
        },
        year: {
            type: String,
        },
        semester: {
            type: String,
            enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
            required: true,
        },
        degree: {
            type: String,
            enum: ["UG", "PG"],
        },
        paperCode: {
            type: String,
            required: [true, "paper code is required !"],
            maxLength: [10, "paper code should be in 10 letter"],
            minLength: [3, "paper code must be in 3 letter "],
            trim: true,
        },
        paperName: {
            type: String,
            required: [true, "paper name is required !"],
            maxLength: [50, "paper name should be in 50 letter"],
            minLength: [3, "paper name must be in 3 letter "],
            trim: true,
        },
        studentsNo: {
            type: Number,
            required: [true, "studens no is required !"],
            min: [1, "studens no must be greater than 1"],
            max: [1000, "studens no must be less than 1000"],
        },
        examinersNo: {
            type: Number,
            required: [true, "examiners no is required !"],
            min: [1, "examiners no must be greater than 1"],
            max: [1000, "examiners no must be less than 1000"],
        },
        dateOfExamination: {
            type: Date,
            required: [true, "date of examination is required !"],
        },
        timeOfExamination: {
            type: String,
        },

        status: {
            type: String,
            enum: ["reject", "pending", "accept"],
            default: "pending",
            required: true,
        },
        CertificateType: {
            type: String,
            enum: ["Moderator", "External"],
            default: "External",
        },
    },
    { timestamps: true }
);

export const Certificate = model("certificate", certificateSchema);


