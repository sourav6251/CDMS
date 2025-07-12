import mongoose from "mongoose";
import { Users } from "../model/user.model.js";
import { NormalUser } from "../model/normaluser.model.js";
import { Routines } from "../model/routine.model.js";

class RoutineService {
    async createRoutine({
        semester,
        paperCode,
        paperName,
        professorID,      // optional
        professorName,    // optional
        dayName,
        startTime,
        endTime,
    }) {
        try {
            let professorRefId = null;
            let professorModel = null;

            // Handle professor via normal user name
            if (professorName) {
                let normalUser = await NormalUser.findOne({ name: professorName });
                if (!normalUser) {
                    normalUser = await NormalUser.create({ name: professorName });
                }
                professorRefId = normalUser._id;
                professorModel = "normaluser";
            }

            // Handle professor via system user ID
            else if (professorID) {
                const user = await Users.findById(professorID);
                if (!user) {
                    throw new Error("Provided professorID not found in user model.");
                }
                professorRefId = user._id;
                professorModel = "user";
            }

            if (!professorRefId || !professorModel) {
                throw new Error("Either professorID or professorName must be provided.");
            }

            const existRoutine = await Routines.findOne({ semester });

            const timeSlot = {
                paperCode,
                paperName,
                professor: professorRefId,
                professorModel,
                startTime,
                endTime,
            };

            if (existRoutine) {
                const day = existRoutine.schedules.find((d) => d.dayName === dayName);
                if (day) {
                    day.timeSlots.push(timeSlot);
                } else {
                    existRoutine.schedules.push({ dayName, timeSlots: [timeSlot] });
                }
                return await existRoutine.save();
            } else {
                return await Routines.create({
                    semester,
                    schedules: [{ dayName, timeSlots: [timeSlot] }],
                });
            }
        } catch (error) {
            console.error("Routine creation error:", error);
            throw new Error("Failed to create routine");
        }
    }

    async showRoutine(semester) {
        try {
            const routines = await Routines.find({ semester }).populate({
                path: "schedules.timeSlots.professor",
                select: "name email",
                strictPopulate: false,
            });
            return routines;
        } catch (error) {
            throw new Error("INTERNAL ERROR");
        }
    }

    async updateRoutine(id, data) {
        return await Routines.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async removeTimeSlot({ routineId, timeSlotId }) {
        try {
            const result = await Routines.updateOne(
                { _id: routineId },
                {
                    $pull: {
                        "schedules.$[].timeSlots": {
                            _id: new mongoose.Types.ObjectId(timeSlotId),
                        },
                    },
                }
            );
            return result;
        } catch (error) {
            console.error("Error removing timeSlot:", error);
            throw new Error("Failed to remove timeSlot");
        }
    }
}

export default new RoutineService();
