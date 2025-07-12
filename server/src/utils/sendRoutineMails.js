// import { CronJob } from "cron";
// import { DateTime } from "luxon";
// import { Routines } from "../model/routine.model.js";
// import mailService from "../services/mail.service.js";

// const sendRoutineMails = async () => {
//   try {
//     const today = DateTime.now().setZone("Asia/Kolkata").toFormat("cccc").toLowerCase();

//     console.log(" Sending routine mails for:", today);

//     const routines = await Routines.find({
//       "schedules.dayName": today,
//     })
//       .populate({
//         path: "schedules.timeSlots.professor",
//         select: "email name",
//       })
//       .populate("department", "name");
// console.log("routines=>  ",routines);

//     const facultyMap = new Map();

//     for (const routine of routines) {
//       for (const schedule of routine.schedules) {
//         if (schedule.dayName !== today) continue;

//         for (const slot of schedule.timeSlots) {
//           const prof = slot.professor;
//           if (!prof?.email) continue;

//           const deptName = routine.department?.name || "your department";
//           const start = new Date(slot.startTime).toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           const end = new Date(slot.endTime).toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           const details = `${slot.paperCode} from ${start} to ${end} in ${deptName}`;

//           if (!facultyMap.has(prof.email)) {
//             facultyMap.set(prof.email, {
//               name: prof.name || "Professor",
//               classes: [details],
//             });
//           } else {
//             facultyMap.get(prof.email).classes.push(details);
//           }
//         }
//       }
//     }

//     for (const [email, { name, classes }] of facultyMap.entries()) {
//       const subject = "Class Schedule for Today";
//       const message = `
// Good morning ${name},

// Here is your class schedule for today (${today}):

// ${classes.map((c, i) => `${i + 1}. ${c}`).join("\n")}

// Please be on time 

// Regards,  
// College Management System`;

//       await mailService.meetingMail(email, subject, message);
//     }

//     console.log("✅ Routine mails sent successfully.");
//   } catch (err) {
//     console.error("❌ Error sending routine emails:", err);
//   }
// };
//   //minute hour
// const job = new CronJob(
//   "48 18 * * *", 
//   sendRoutineMails,
//   null,
//   true,
//   "Asia/Kolkata"
// );

// export default job;
