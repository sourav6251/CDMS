import { sendResponse } from "../utils/response.handler.js";
import { HTTP_STATUS } from "../constants/statusCode.constants.js";
import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
import certificateService from "../services/certificate.service.js";

class CertificateController {
    // Create a certificate
    async createCertificate(req, res) {
        const { id } = req.user;
        const { role } = req.user;
        const {
            memoNumber,
            userID,
            designation,
            department,
            institutionName,
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
            honorifics,
            gender,
            institutionType,
            examStartTime,
            examEndTime,
        } = req.body;
        console.log("userID=>",userID);
        
        try {
            const certificate = await certificateService.createCertificate({
                id, // creator's ID (authenticated user)
                memoNumber,
                userID,
                role,
                designation,
                department,
                institutionName,
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
                honorifics,
                gender,
                institutionType,
                examStartTime,
                examEndTime,
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
            _id,
            memoNumber,
            address,
            creator,
            user,
            honorifics,
            userModel,
            CertificateType,
            designation,
            department,
            institutionType,
            institutionName,
            degree,
            semester,
            subject,
            paperName,
            dateOfExamination,
            examStartTime,
            examEndTime,
            gender,
            studentsNo,
            examinersNo,
            examType,
            nonExistUser,
            status,
            createdAt,
          //   updatedAt,
          //   __v: number;
        } = req.body;
        // const certificateId = req.params.certificateId;
        // console.log("certificateId=>>", certificateId);

        try {
            const certificate = await certificateService.updateCertificate({
                _id,
                memoNumber,
                address,
                creator,
                user,
                honorifics,
                userModel,
                CertificateType,
                designation,
                department,
                institutionType,
                institutionName,
                degree,
                semester,
                subject,
                paperName,
                dateOfExamination,
                examStartTime,
                examEndTime,
                gender,
                studentsNo,
                examinersNo,
                examType,
                nonExistUser,
                status,
                createdAt,
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

        const { memoNumber, status } = req.body;
        console.log("updateCertificatestatus",memoNumber, status );
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
                status: HTTP_STATUS.OK,
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
        // Show all certificates (with optional filters)
    async pendingCertificateRequest(req, res) {
        try {
            const certificates = await certificateService.pendingCertificateRequest();

            if (certificates && certificates.length > 0) {
                return sendResponse(res, {
                    status: HTTP_STATUS.OK,
                    message: RESPONSE_MESSAGES.CERTIFICATE_GET,
                    success: true,
                    data: certificates,
                });
            }

            return sendResponse(res, {
                status: HTTP_STATUS.OK,
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
    
    async showExternalCertificates(req, res) {

        const {id}=req.user;
        try {
            const certificates = await certificateService.showExternalCertificates(id);

                return sendResponse(res, {
                    status: HTTP_STATUS.OK,
                    message: RESPONSE_MESSAGES.CERTIFICATE_GET,
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
