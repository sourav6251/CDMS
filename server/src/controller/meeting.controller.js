import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import meetingService from "../services/meeting.service.js";
import { sendResponse } from "../utils/response.handler.js";

class MeetingController {
    async createMeeting(req, res) {
        console.log("Enter into meeting ");
        const { id } = req.user;
        console.log(id);

        try {
            const {
                title,
                description,
                meetingTime,
                meetingArea,
                usersID,
                users,
            } = req.body;
            const meeting = await meetingService.createMeeting({
                user: id,
                title,
                description,
                meetingTime,
                meetingArea,
                usersID,
                users,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                message:
                    RESPONSE_MESSAGES.MEETING_CREATED ||
                    "Meeting created successfully",
                success: true,
                data: meeting,
            });
        } catch (error) {
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    async showMeeting(req, res) {
        const { id } = req.user;
        try {
            const meetings = await meetingService.getMeetingsByParticipantId(
                id
            );

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.FETCH_SUCCESS ||
                    "Meetings fetched successfully",
                success: true,
                data: meetings,
            });
        } catch (error) {
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    async updateMeeting(req, res) {
        try {
            const meetingId = req.params.meetingId;
            const { id } = req.user;
            const { title, description, meetingTime, meetingArea } = req.body;
            const updatedMeeting = await meetingService.updateMeeting({
                meetingId,
                title,
                description,
                meetingTime,
                meetingArea,
                id,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.MEETING_UPDATED,
                success: true,
                data: updatedMeeting,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (error.message === "Meeting not found") {
                status = HTTP_STATUS.NOT_FOUND;
            }
            return sendResponse(res, {
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    async deleteMeeting(req, res) {
        try {
            const id = req.params.meetingId;
            const deletedMeeting = await meetingService.deleteMeeting(id);

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.MEETING_DELETED ||
                    "Meeting deleted successfully",
                success: true,
                data: deletedMeeting,
            });
        } catch (error) {
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error,
            });
        }
    }

    async notifyMeeting(req, res) {
        try {
            const id = req.params.meetingId;
            const deletedMeeting = await meetingService.notifyMeeting(id);

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.MEETING_DELETED ||
                    "Meeting deleted successfully",
                success: true,
                data: deletedMeeting,
            });
        } catch (error) {
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error,
            });
        }
    }


   
}

export default new MeetingController();
