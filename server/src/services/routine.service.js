import mongoose from "mongoose";
import { Users } from "../model/user.model.js";
import { NormalUser } from "../model/normaluser.model.js";
import { Routines } from "../model/routine.model.js";

import moment from "moment-timezone";

class RoutineService {


     getIndianDay = () => {
    return moment().tz("Asia/Kolkata").format("dddd"); // e.g., "Monday"
    };

    async createRoutine({
      semester,
      paperCode,
      paperName,
      roomNo,
      professormodel,
      professorID,
      professorName,
      dayName,
      startTime,
      endTime,
  }) {
      try {
          let professorRefId = null;
          let professorModel = null;
  
          console.log("Enter into createRoutine");
          console.log("Enter into professorID1",professorID);
          if (professorName) {
            console.log("Enter into professorName",professorName);
            
              let normalUser = await NormalUser.findOne({ name: professorName });
              if (!normalUser) {
                  normalUser = await NormalUser.create({ name: professorName });
              }
              professorRefId = normalUser._id;
              professorModel = "normaluser";
          } else if (professorID) {
            console.log("Enter into professorID",professorID);
            let user;
            const model = professormodel?.toLowerCase();
            if (model === "normaluser") {
                user = await NormalUser.findById(professorID);
            } else {
                user = await Users.findById(professorID);
            }
        
            if (!user) throw new Error("Provided professorID not found.");
            professorRefId = user._id;
            professorModel = model;
        }
        
  
          if (!professorRefId || !professorModel) {
              throw new Error("Professor information missing.");
          }
  
          const timeSlot = {
              paperCode,
              paperName,
              roomNo,
              professor: professorRefId,
              professorModel,
              startTime,
              endTime,
          };
  
          const existingRoutine = await Routines.findOne({ semester });
  
          if (existingRoutine) {
              const day = existingRoutine.schedules.find((d) => d.dayName === dayName);
              if (day) {
                  day.timeSlots.push(timeSlot);
              } else {
                  existingRoutine.schedules.push({ dayName, timeSlots: [timeSlot] });
              }
              return await existingRoutine.save();
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
  

    // async showRoutine(semester) {
    //     try {
    //         const routines = await Routines.find({ semester }).populate({
    //             path: "schedules.timeSlots.professor",
    //             select: "name email",
    //             strictPopulate: false,
    //         });
    //         return routines;
    //     } catch (error) {
    //         throw new Error("INTERNAL ERROR");
    //     }
    // }
   
    async  showRoutine(semester) {
      try {
        const routines = await Routines.find({ semester }).lean();
    
        for (const routine of routines) {
          for (const schedule of routine.schedules) {
            for (const timeSlot of schedule.timeSlots) {
              const profId = timeSlot.professor;
              const profModel = timeSlot.professorModel;
    
              let professorData = null;
    
              if (profModel === "user") {
                professorData = await Users.findById(profId)
                  .select("name email")
                  .lean();
              } else if (profModel === "normaluser") {
                professorData = await NormalUser.findById(profId)
                  .select("name email")
                  .lean();
              }
    
              if (professorData) {
                timeSlot.professor = professorData;
              } else {
                timeSlot.professor = { name: "Unknown", email: "" };
              }
    
              // Optionally remove professorModel now
              delete timeSlot.professorModel;
            }
          } 
        }
    
        return routines;
      } catch (error) {
        console.error("Routine fetch error:", error);
        throw new Error("INTERNAL ERROR");
      }
    }
    

    async getUserScheduleForToday(userId) {
      const objectId = new mongoose.Types.ObjectId(userId);
      // const dayName = "Wednesday";
      const dayName = moment().tz("Asia/Kolkata").format("dddd"); // e.g., "Wednesday"
    console.log("dayName",dayName);
    
      try {
        console.log("Enter into getUserScheduleForToday");
    
        const routines = await Routines.aggregate([
          { $unwind: "$schedules" },
          { $match: { "schedules.dayName": dayName } },
          { $unwind: "$schedules.timeSlots" },
          {
            $match: {
              "schedules.timeSlots.professor": objectId,
              "schedules.timeSlots.professorModel": "user",
            },
          },
          {
            $group: {
              _id: "$_id",
              semester: { $first: "$semester" },
              schedule: {
                $push: {
                  dayName: "$schedules.dayName",
                  timeSlot: "$schedules.timeSlots",
                },
              },
            },
          },
        ]);
    
        // Flatten and restructure output
        return routines.flatMap(routine =>
          routine.schedule.map(s => ({
            semester: routine.semester,
            paperCode: s.timeSlot.paperCode,
            paperName: s.timeSlot.paperName,
            roomNo: s.timeSlot.roomNo,
            startTime: s.timeSlot.startTime,
            endTime: s.timeSlot.endTime,
          }))
        );
      } catch (error) {
        console.error("Error fetching routine time slots:", error);
        throw new Error("Failed to retrieve routine schedule.");
      }
    }
    
    // async  getUserScheduleForToday(userId) {
    //   const objectId = new mongoose.Types.ObjectId(userId);
    //   // : string, dayName: string
    //   const dayName="Wednesday"
    //   try {
    //     console.log("Enter into getUserScheduleForToday");
        
    //     const routines = await Routines.aggregate([
    //       // Unwind schedules array
    //       { $unwind: "$schedules" },
    
    //       // Match by specific day name
    //       {
    //         $match: {
    //           "schedules.dayName": dayName,
    //         },
    //       },
    
    //       // Unwind timeSlots
    //       { $unwind: "$schedules.timeSlots" },
    
    //       // Match by professor ID AND professorModel === 'user'
    //       {
    //         $match: {
    //           "schedules.timeSlots.professor": objectId,
    //           "schedules.timeSlots.professorModel": "user",
    //         },
    //       },
    
    //       // Group the results per routine/semester
    //       {
    //         $group: {
    //           _id: "$_id",
    //           semester: { $first: "$semester" },
    //           schedule: {
    //             $push: {
    //               dayName: "$schedules.dayName",
    //               timeSlot: "$schedules.timeSlots",
    //             },
    //           },
    //         },
    //       },
    //     ]);
    
    //     return routines;
    //   } catch (error) {
    //     console.error("Error fetching routine time slots:", error);
    //     throw new Error("Failed to retrieve routine schedule.");
    //   }
    // }
    
      
    
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
