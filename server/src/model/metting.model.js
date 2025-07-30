import { model, Schema } from "mongoose";
const meetingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        title: {
            type: String,
            required: [true, "title is required !"],
            maxLength: [100, "title should be in 100 letter"],
            minLength: [3, "title must be in 3 letter "],
            trim: true,
        },
        description: {
            type: String,
            maxLength: [1000, "description should be in 1000 letter"],
            minLength: [3, "description must be in 3 letter "],
            trim: true,
        },
        meetingTime: {
            type: Date,
        },
        joinusList: [
            {
              type: Schema.Types.ObjectId,
              refPath: 'joinusModel',
              required: true, 
            }
          ],
          joinusModel: [
            {
              type: String,
              required: true,
              enum: ['user', 'normaluser'],
            }
          ],
          
        meetingArea: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);
export const Mettings = model("metting", meetingSchema);
