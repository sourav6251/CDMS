import { Mettings } from "../model/metting.model.js";
import { NormalUser } from "../model/normaluser.model.js";
import { Users } from "../model/user.model.js";
import mailService from "./mail.service.js";
class MeetingService {
    async createMeeting({
        user, // ID of the person creating the meeting
        title,
        description,
        meetingTime,
        meetingArea,
        usersID = [], // Existing user IDs (could be from `user` or `normaluser`)
        users = [], // New users with { user, email, phoneNo }
    }) {
        try {
            const joinusList = [];
            const joinusModel = [];

            // 1. Handle new user entries (NormalUser)
            if (Array.isArray(users) && users.length > 0) {
                for (const userObj of users) {
                    const { name, email, phoneNo } = userObj;

                    // Check if already exists
                    let existingUser = await NormalUser.findOne({
                        name,
                        email,
                    });

                    if (!existingUser) {
                        existingUser = await NormalUser.create({
                            name,
                            email,
                            phoneNo,
                        });
                    }

                    joinusList.push(existingUser._id);
                    joinusModel.push("normaluser");
                }
            }

            // 2. Handle provided user IDs
            if (Array.isArray(usersID) && usersID.length > 0) {
                for (const id of usersID) {
                    const systemUser = await Users.findById(id);
                    if (systemUser) {
                        joinusList.push(systemUser._id);
                        joinusModel.push("user");
                        continue;
                    }

                    const normalUser = await NormalUser.findById(id);
                    if (normalUser) {
                        joinusList.push(normalUser._id);
                        joinusModel.push("normaluser");
                        continue;
                    }

                    // Optional: error if ID is not found
                    throw new Error(`Invalid user ID: ${id}`);
                }
            }

            // 3. Save the meeting
            const meeting = await Mettings.create({
                user,
                title,
                description,
                meetingTime,
                meetingArea,
                joinusList,
                joinusModel,
            });
            this.notifyMeeting(meeting._id);
            return meeting;
        } catch (error) {
            throw new Error("Failed to create meeting: " + error.message);
        }
    }
    async  getMeetingsByParticipantId(participantId) {
        try {
          const meetings = await Mettings.find({
            joinusList: participantId,
          })
            .sort({ meetingTime: -1 })
            .select("-__v") // optionally exclude __v
            .lean();
      
          for (const meeting of meetings) {
            // Populate the creator (user field)
            const creator = await Users.findById(meeting.user)
              .select("name email role")
              .lean();
      
            meeting.user = creator;
      
            // Prepare full participant objects
            const fullParticipants = [];
      
            for (let i = 0; i < meeting.joinusList.length; i++) {
              const id = meeting.joinusList[i];
              const model = meeting.joinusModel[i];
      
              let participantData = null;
      
              if (model === "user") {
                participantData = await Users.findById(id)
                  .select("_id name email role")
                  .lean();
              } else if (model === "normaluser") {
                participantData = await NormalUser.findById(id)
                  .select("_id name email phoneNo")
                  .lean();
              }
      
              if (participantData) {
                fullParticipants.push(participantData);
              }
            }
      
            meeting.joinusList = fullParticipants;
      
            // Optionally remove joinusModel since we merged the data
            delete meeting.joinusModel;
          }
      
          return meetings;
        } catch (error) {
          console.error("Error fetching meetings:", error);
          throw error;
        }
      }
      
    // async getMeetingsByParticipantId(participantId) {
    //     try {
    //         const meetings = await Mettings.find({
    //             joinusList: participantId,
    //         })
    //             .sort({ meetingTime: -1 }) // Sort by meetingTime: newest first
    //             .select("title description meetingTime meetingArea joinusList joinusModel")
    //             .lean();
    
    //         for (const meeting of meetings) {
    //             meeting.joinedUsers = [];
    
    //             for (let i = 0; i < meeting.joinusList.length; i++) {
    //                 const id = meeting.joinusList[i];
    //                 const modelName = meeting.joinusModel[i];
    
    //                 let participantData = null;
    
    //                 if (modelName === "user") {
    //                     participantData = await Users.findById(id)
    //                         .select("name email")
    //                         .lean();
    //                 } else if (modelName === "normaluser") {
    //                     participantData = await NormalUser.findById(id)
    //                         .select("name email")
    //                         .lean();
    //                 }
    
    //                 if (participantData) {
    //                     meeting.joinedUsers.push(participantData);
    //                 }
    //             }
    //         }
    
    //         return meetings;
    //     } catch (error) {
    //         console.error("Error fetching meetings:", error);
    //         throw error;
    //     }
    // }
    
    async updateMeeting({
        meetingId,
        title,
        description,
        meetingTime,
        meetingArea,
        usersID = [], // Existing user IDs (could be from `user` or `normaluser`)
        users = [], // New users with { user, email, phoneNo }
        id,
    }) {
        console.log("usersIDusersIDusersID=>",usersID);
        
        const joinusList = [];
        const joinusModel = [];
                    // 1. Handle new user entries (NormalUser)
                    if (Array.isArray(users) && users.length > 0) {
                        for (const userObj of users) {
                            const { name, email, phoneNo } = userObj;
        
                            // Check if already exists
                            let existingUser = await NormalUser.findOne({
                                name,
                                email,
                            });
        
                            if (!existingUser) {
                                existingUser = await NormalUser.create({
                                    name,
                                    email,
                                    phoneNo,
                                });
                            }
        
                            joinusList.push(existingUser._id);
                            joinusModel.push("normaluser");
                        }
                    }
                                // 2. Handle provided user IDs
            if (Array.isArray(usersID) && usersID.length > 0) {
                for (const id of usersID) {
                    const systemUser = await Users.findById(id);
                    if (systemUser) {
                        joinusList.push(systemUser._id);
                        joinusModel.push("user");
                        continue;
                    }

                    const normalUser = await NormalUser.findById(id);
                    if (normalUser) {
                        joinusList.push(normalUser._id);
                        joinusModel.push("normaluser");
                        continue;
                    }

                    // Optional: error if ID is not found
                    throw new Error(`Invalid user ID: ${id}`);
                }
            }

        try {
            const updatedMeeting = await Mettings.findByIdAndUpdate(
                meetingId,
                {
                    title,
                    description,
                    meetingTime: meetingTime
                        ? new Date(meetingTime)
                        : undefined,
                    meetingArea,
                    joinusList,
                    joinusModel,
                },
                { new: true, runValidators: true }
            );

            if (!updatedMeeting) {
                throw new Error("Meeting not found");
            }

            console.log("Meeting updated successfully:", updatedMeeting);
            return updatedMeeting;
        } catch (error) {
            console.error("Error in updateMeeting:", error);
            throw error;
        }
    }

    async deleteMeeting(id) {
        try {
            const meeting = await Mettings.findByIdAndDelete(id);
            if (!meeting) {
                throw new Error("Meeting not found");
            }
            return meeting;
        } catch (error) {
            console.error("Error in deleteMeeting:", error);
            throw error;
        }
    }

    async notifyMeeting(id) {
        try {
            const meeting = await Mettings.findById(id).populate({
                path: "joinusList",
                select: "name email",
            });
            const data = {
                title: meeting.title,
                date: new Date(meeting.meetingTime).toLocaleDateString(),
                time: new Date(meeting.meetingTime).toLocaleTimeString(),
                location: meeting.meetingArea || "TBD",
                description: meeting.description || "No description",
            };
            const recipients = meeting.joinusList
                .map((u) => u.email)
                .filter(Boolean);
            if (!meeting) {
                throw new Error("Meeting not found");
            }
            await mailService.meetingMail(recipients, data);
            return meeting;
        } catch (error) {
            console.error("Error in Meeting:", error);
            throw error;
        }
    }
}

export default new MeetingService();
