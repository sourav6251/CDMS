import { sendResponse } from "../utils/response.handler.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import certificateService from "../services/certificate.service.js";

class CertificateController {
    // Create a certificate
    async createCertificate(req, res) {
        const { id } = req.user;
        const {
            memoNumber,
            userID,
            designation,
            department,
            college,
            address,
            examType,
            subject,
            year,
            semester,
            degree,
            paperCode,
            paperName,
            studentsNo,
            examinersNo,
            dateOfExamination,
            timeOfExamination,
            status,
            CertificateType,
            nonExistUser,
        } = req.body;
        try {
            const certificate = await certificateService.createCertificate({
                id, // creator's ID (authenticated user)
                memoNumber,
                userID,
                designation,
                department,
                college,
                address,
                examType,
                subject,
                year,
                semester,
                degree,
                paperCode,
                paperName,
                studentsNo,
                examinersNo,
                dateOfExamination,
                timeOfExamination,
                status,
                CertificateType,
                nonExistUser,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.CREATED,
                message: RESPONSE_MESSAGES.CERTIFICATE_CREATED,
                success: true,
                data: certificate,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (
                error.message ===
                    "Provided userID not found in either user or normaluser." ||
                error.message ===
                    "Either userID or nonExistUser must be provided."
            ) {
                status = HTTP_STATUS.BAD_REQUEST;
            }
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    // Update a certificate
    async updateCertificate(req, res) {
        const {
            memoNumber,
            designation,
            department,
            college,
            address,
            examType,
            year,
            semester,
            degree,
            paperCode,
            paperName,
            studentsNo,
            examinersNo,
            dateOfExamination,
            timeOfExamination,
            status,
            CertificateType,
        } = req.body;
        const certificateId = req.params.certificateId;
        console.log("certificateId=>>", certificateId);

        try {
            const certificate = await certificateService.updateCertificate({
                certificateId,
                memoNumber,
                designation,
                department,
                college,
                address,
                examType,
                year,
                semester,
                degree,
                paperCode,
                paperName,
                studentsNo,
                examinersNo,
                dateOfExamination,
                timeOfExamination,
                status,
                CertificateType,
            });

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.CERTIFICATE_UPDATED,
                success: true,
                data: certificate,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (error.message === "Cannot update an accepted certificate.") {
                status = HTTP_STATUS.BAD_REQUEST;
            }
            return sendResponse(res, {
                status,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    //update certificate status
    async updateCertificatestatus(req, res) {
        console.log("updateCertificatestatus");

        const { memoNumber, status } = req.body;
        const certificateId = req.params.certificateId;
        try {
            const certificate =
                await certificateService.updateCertificatestatus(
                    certificateId,
                    memoNumber,
                    status
                );

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.CERTIFICATE_UPDATED,
                success: true,
                data: certificate,
            });
        } catch (error) {
            let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            if (error.message === "Certificate not exist") {
                status = HTTP_STATUS.BAD_REQUEST;
            }
            return sendResponse(res, {
                status,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error.message,
            });
        }
    }

    // Show all certificates (with optional filters)
    async showCertificates(req, res) {
        try {
            const certificates = await certificateService.showCertificates();

            if (certificates && certificates.length > 0) {
                return sendResponse(res, {
                    status: HTTP_STATUS.OK,
                    message: RESPONSE_MESSAGES.CERTIFICATE_GET,
                    success: true,
                    data: certificates,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.NO_CONTENT,
                message: RESPONSE_MESSAGES.NO_CERTIFICATE,
                success: true,
                data: certificates,
            });
        } catch (error) {
            console.log(error);

            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error,
            });
        }
    }

    // Delete  certificate
    async deleteCertificate(req, res) {
        try {
            const certificate = await certificateService.deleteCertificate(
                req.params.certificateId
            );

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
                message: RESPONSE_MESSAGES.CERTIFICATE_DELETE,
                success: true,
                data: certificate,
            });
        } catch (error) {
            return sendResponse(res, {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: RESPONSE_MESSAGES.INTERNAL_ERROR,
                success: false,
                error: error,
            });
        }
    }


}

export default new CertificateController();
