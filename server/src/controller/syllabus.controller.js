import syllabusService from "../services/syllabus.service.js";
import { sendResponse } from "../utils/response.handler.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";

class SyllabusController {
    async createSyllabus(req, res) {
        try {
            const { semester, paperName, paperCode } = req.body;
            const media = req.file;
            const user = req.user._id;
            const bufferFile = req.file.buffer;
            const originalName = req.file.originalname;
            console.log("req.body => ", req.body);
            if (!req.file) {
                return sendResponse(res, {
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: RESPONSE_MESSAGES.MEDIA_REQUIRED,
                    success: false,
                    // data: syllabus,
                });
            }
            const syllabusData = {
                user,
                semester,
                paperCode,
                paperName,
                bufferFile,
                originalName,
            };
            console.log("syllabusData=> ", syllabusData);

            const syllabus = await syllabusService.createSyllabus(syllabusData);

            return sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                message:
                    RESPONSE_MESSAGES.SYLLABUS_CREATED ||
                    "Syllabus created successfully",
                success: true,
                data: syllabus,
            });
        } catch (error) {
            console.error("Create syllabus error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }

    async updateSyllabus(req, res) {
        console.log("req.body => ", req.body);
        console.log("req.file => ", req.file);



        try {
            const id = req.params.syllabusId;
            const { semester, paperCode, paperName } = req.body;

            let updateData = {
                semester,
                paperCode,
                paperName,
                // bufferFile,
                // originalName,
            };
            if (req.file) {
                
                const bufferFile = req.file.buffer;
                const originalName = req.file.originalname;
                updateData = {
                    semester,
                    paperCode,
                    paperName,
                    bufferFile,
                    originalName,
                }
            }

            const syllabus = await syllabusService.updateSyllabus(
                id,
                updateData
            );

            if (!syllabus) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    message: "Syllabus not found",
                    success: false,
                });
            }
            console.log("syllabus=>  ", syllabus);

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.SYLLABUS_UPDATED ||
                    "Syllabus updated successfully",
                success: true,
                data: syllabus,
            });
        } catch (error) {
            console.error("Update syllabus error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }

    async showSyllabus(req, res) {
        try {
            const syllabus = await syllabusService.showSyllabus(
                req.query.semester
            );
            let status = HTTP_STATUS.OK;
            if (!syllabus || syllabus.length === 0) {
                status = HTTP_STATUS.NO_CONTENT;
            }
            return sendResponse(res, {
                message: RESPONSE_MESSAGES.SYLLABUS_FETCHED,
                status: status,
                success: true,
                data: syllabus || [],
            });
        } catch (error) {
            console.error("Show syllabus error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }

    async deleteSyllabus(req, res) {
        try {
            const syllabus = await syllabusService.deleteSyllabus(
                req.params.syllabusId
            );

            if (!syllabus) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    message: "Syllabus not found",
                    success: false,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.SYLLABUS_DELETE ||
                    "Syllabus deleted successfully",
                success: true,
                data: syllabus,
            });
        } catch (error) {
            console.error("Delete syllabus error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }
}

export default new SyllabusController();
