import express from "express";
import meetingValidation from "../validations/meeting.validation.js";
import meetingController from "../controller/meeting.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    authorizeRoles,
    isAuthenticate,
} from "../middlewares/authentication.middleware.js";

const router = express.Router();

router
    .post("/",validate(meetingValidation.create),isAuthenticate,authorizeRoles("hod"),meetingController.createMeeting )
    .get(
        "/",
        // validate(meetingValidation.showByEmail),
        isAuthenticate, meetingController.showMeeting )
    .get("/notify/:meetingId",validate(meetingValidation.notify),isAuthenticate,authorizeRoles("hod"),meetingController.notifyMeeting)
    .get("/upcomming",isAuthenticate,authorizeRoles("hod"),meetingController.upComming)

    // .get("/:userid", meetingController.showMeeting)
    .patch( "/:meetingId",  validate(meetingValidation.update),  isAuthenticate, authorizeRoles("hod"), validate(meetingValidation.update),  meetingController.updateMeeting )
    
    .delete(  "/:meetingId",  validate(meetingValidation.delete), isAuthenticate,  authorizeRoles("hod"), meetingController.deleteMeeting );

export const meetingRouter = router;
