// import mailService from "../services/mail.service.js";
// import { sendResponse } from "../utils/response.handler.js";
// import { RESPONSE_MESSAGES } from "../constants/responseMessage.constants.js";
// import { HTTP_STATUS } from "../constants/statusCode.constants.js";

// class MailController {
//   async sendMail(req, res) {
//     const { To, subject,body } = req.body;

//     // Handle single string
//     if (typeof To === "string") {
//       try {
//         await mailService.sendMail(To,subject,body);

//         return sendResponse(res, {
//           status: HTTP_STATUS.CREATED,
//           message: "Email sent successfully.",
//           success: true,
//           data: { recipients: To },
//         });
//       } catch (error) {
//         return sendResponse(res, {
//           status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
//           message: RESPONSE_MESSAGES.INTERNAL_ERROR,
//           success: false,
//           error: error.message || error,
//         });
//       }
//     }

//     // Handle array of emails (bulk)
//     if (Array.isArray(To) && To.length > 0) {
//       try {
//         await mailService.meetingMail(To, subject,body);

//         return sendResponse(res, {
//           status: HTTP_STATUS.CREATED,
//           message: "Bulk email sent successfully.",
//           success: true,
//           data: { recipients: To },
//         });
//       } catch (error) {
//         return sendResponse(res, {
//           status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
//           message: RESPONSE_MESSAGES.INTERNAL_ERROR,
//           success: false,
//           error: error.message || error,
//         });
//       }
//     }

//     // If nothing valid is provided
//     return sendResponse(res, {
//       status: HTTP_STATUS.BAD_REQUEST,
//       message: "Recipient email(s) required. Must be string or non-empty array.",
//       success: false,
//     });
//   }

//   // async certificateMail(req, res) {
//   //   const { To, subject,body } = req.body;

//   //     try {
//   //       await mailService.certificateMail(To,subject,body);

//   //       return sendResponse(res, {
//   //         status: HTTP_STATUS.CREATED,
//   //         message: "Email sent successfully.",
//   //         success: true,
//   //         data: { recipients: To },
//   //       });
//   //     } catch (error) {
//   //       return sendResponse(res, {
//   //         status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
//   //         message: RESPONSE_MESSAGES.INTERNAL_ERROR,
//   //         success: false,
//   //         error: error.message || error,
//   //       });
//   //     }
//   //   }


// }

// export default new MailController();
