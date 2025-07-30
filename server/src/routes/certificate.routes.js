import express from "express";
import certificateValidation from "../validations/certificate.validation.js";
import certificateController from "../controller/certificate.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    authorizeRoles,
    isAuthenticate,
} from "../middlewares/authentication.middleware.js";

const router = express.Router();

router
    .post( "/", validate(certificateValidation.create),isAuthenticate,authorizeRoles("hod", "external"),certificateController.createCertificate)
    .get("/",isAuthenticate,authorizeRoles("hod"), certificateController.showCertificates)
    .get("/pendingcertificate",isAuthenticate,authorizeRoles("hod"), certificateController.pendingCertificateRequest)
    .get("/external",isAuthenticate,authorizeRoles("external"), certificateController.showExternalCertificates)
    .patch("/",isAuthenticate,authorizeRoles("hod", "external"),certificateController.updateCertificate)
    .put("/statusupadte/:certificateId",validate(certificateValidation.update),isAuthenticate,authorizeRoles("hod"),certificateController.updateCertificatestatus)
    .delete("/:certificateId",validate(certificateValidation.delete),isAuthenticate,authorizeRoles("hod", "external"),certificateController.deleteCertificate);

export const certificateRouter = router;
