import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import routineService from "../services/routine.service.js";
import { sendResponse } from "../utils/response.handler.js";

class RoutineController {
    // Create routine
    async createRoutine(req, res) {
        try {
            const {
                semester,
                paperCode,
                paperName,
                professorID,
                professorName,
                dayName,
                startTime,
                endTime,
            } = req.body;

            // Validation: Either professorID or professorName must be provided, not both or neither
            // if ((professorID && professorName) || (!professorID && !professorName)) {
            //     return sendResponse(res, {
            //         status: HTTP_STATUS.BAD_REQUEST,
            //         message:
            //             "Either 'professorID' or 'professorName' must be provided (but not both or neither).",
            //         success: false,
            //     });
            // }

            const routine = await routineService.createRoutine({
                semester,
                paperCode,
                paperName,
                professorID,
                professorName,
                dayName,
                startTime,
                endTime,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                message: RESPONSE_MESSAGES.ROUTINE_CREATED,
                success: true,
                data: routine,
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

    // Update routine
    async updateRoutine(req, res) {
        try {
            const { routineId } = req.params;
            const updatedRoutine = await routineService.updateRoutine(routineId, req.body);

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.ROUTINE_UPDATED,
                success: true,
                data: updatedRoutine,
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

    // Show routine by semester
    async showRoutine(req, res) {
        try {
            const { semester } = req.params;

            const routines = await routineService.showRoutine(semester);
            if (!routines || routines.length === 0) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NO_CONTENT,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.ROUTINE_GET,
                success: true,
                data: routines,
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

    // Delete timeslot from routine
    async deleteRoutine(req, res) {
        try {
            const { routineId, timeSlotId } = req.query;

            if (!routineId || !timeSlotId) {
                return sendResponse(res, {
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Both 'routineId' and 'timeSlotId' are required.",
                    success: false,
                });
            }

            const result = await routineService.removeTimeSlot({
                routineId,
                timeSlotId,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.ROUTINE_DELETE,
                success: true,
                data: result,
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
}

export default new RoutineController();
