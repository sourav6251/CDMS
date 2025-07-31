import { model, Schema } from "mongoose";
import { type } from "os";
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
        institutionName: {
            type: String,
        },
        address: {
            type: String,
        }, 
        gender: {
            type: String,
        },
        examType: {
            type: String,
            enum: ["Theory", "Practical",""],
        },
        honorifics:{
            type: String,
            enum: ["Dr.", "Mr.", "Mrs"]
        },
        year: {
            type: String,
        },
        institutionType: {
            type: String,
        },
        semester: {
            type: [String],
            enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
            required: true,
        },
        degree: {
            type: String,
            enum: ["UG", "PG"],
        },
        paperCode: {
            type: String,
            maxLength: [10, "paper code should be in 10 letter"],
            minLength: [3, "paper code must be in 3 letter "],
            trim: true,
        },
        paperName: {
            type: String,
            maxLength: [50, "paper name should be in 50 letter"],
            minLength: [3, "paper name must be in 3 letter "],
            trim: true,
        },
        subject:{
            type:String
        },
        studentsNo: {
            type: Number,
            // required: [true, "studens no is required !"],
            min: [1, "studens no must be greater than 1"],
            max: [1000, "studens no must be less than 1000"],
        },
        examinersNo: {
            type: Number,
            // required: [true, "examiners no is required !"],
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
        examStartTime: { type: String },
        examEndTime: { type: String },
        status: {
            type: String,
            enum: ["reject", "pending", "accept"],
            default: "pending",
            required: true,
        },
        CertificateType: {
            type: String,
            enum: ["moderator", "external"],
            default: "external",
        },
    },
    { timestamps: true }
);

export const Certificate = model("certificate", certificateSchema);
