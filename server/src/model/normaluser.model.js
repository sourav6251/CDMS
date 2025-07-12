import { model, Schema } from "mongoose";

const normalUserSchema = new Schema(
    {
        //name
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNo: {
            type: String,
        },
    },
    { timestamps: true }
);

export const NormalUser = model("normaluser", normalUserSchema);
