import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import noticeboardService from "../services/notice.service.js";
import { sendResponse } from "../utils/response.handler.js";

class NoticeboardController {
    async createNotice(req, res) {
        const { title, description } = req.body;
        console.log("req.body=>", title, description);
        // console.log("req.originalname=>",   req.file.originalname);

        const { _id } = req.user;
        let bufferFile = null;
        let originalName = null;
        if (req.file && req.file.buffer) {
            bufferFile = req.file.buffer;
            originalName = req.file.originalname;
        }

        try {
            const noticeData = {
                _id,
                title,
                description,
                bufferFile,
                originalName,
            };

            const notice = await noticeboardService.createNotice(noticeData);

            return sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                message:
                    RESPONSE_MESSAGES.NOTICE_CREATED ||
                    "Notice created successfully",
                success: true,
                data: notice,
            });
        } catch (error) {
            console.error("Create notice error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }

    async showNotices(req, res) {
        console.log("Enter into showNotices ");
        
        try {
            const notices = await noticeboardService.showNotices();
            let status = HTTP_STATUS.OK;
            if (notices.length < 0) {
                status = HTTP_STATUS.NO_CONTENT;
            }
            return sendResponse(res, {
                status,
                message:
                    RESPONSE_MESSAGES.FETCH_SUCCESS ||
                    "Notices fetched successfully",
                success: true,
                data: notices,
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

    async updateNotice(req, res) {
        let bufferFile = null;
        let originalName = null;
        if (req.file && req.file.buffer) {
            bufferFile = req.file.buffer;
            originalName = req.file.originalname;
        }
        try {
            const id = req.params.noticeId;
            const { title, description } = req.body;

            const updateData = {
                title,
                description,
                bufferFile,
                originalName,
            };

            const updatedNotice = await noticeboardService.updateNotice(
                id,
                updateData
            );

            if (!updatedNotice) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    message: "Notice not found",
                    success: false,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message:
                    RESPONSE_MESSAGES.NOTICE_UPDATED ||
                    "Notice updated successfully",
                success: true,
                data: updatedNotice,
            });
        } catch (error) {
            console.error("Update notice error:", error);
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
            });
        }
    }

    async deleteNotice(req, res) {
        try {
            const id = req.params.noticeId;
            const deletedNotice = await noticeboardService.deleteNotice(id);

            if (!deletedNotice) {
                return sendResponse(res, {
                    status: HTTP_STATUS.NOT_FOUND,
                    message: RESPONSE_MESSAGES.NOTICE_NOT_FOUND,
                    success: false,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.NOTICE_DELETE,
                success: true,
                data: deletedNotice,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            let message = RESPONSE_MESSAGES.INTERNAL_ERROR;
            if (error.message === "Notice not found") {
                status = HTTP_STATUS.NOT_FOUND;
                message = RESPONSE_MESSAGES.NOT_FOUND;
            }
            return sendResponse(res, {
                status,
                message: message,
                success: false,
                error: error.message,
            });
        }
    }
}

export default new NoticeboardController();
