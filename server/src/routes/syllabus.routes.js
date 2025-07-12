import express from "express";
import syllabusController from "../controller/syllabus.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import syllabusValidation from "../validations/syllabus.validation.js";
import { authorizeRoles, isAuthenticate } from "../middlewares/authentication.middleware.js";
import { upload } from "../utils/multerStorage.js";

const router = express.Router();

router
    .post(
        '/',
        upload.single('media'),
        validate(syllabusValidation.create),
        isAuthenticate,
        authorizeRoles( "hod"),
        syllabusController.createSyllabus
    )
    .get('/',validate(syllabusValidation.get),syllabusController.showSyllabus)
    .patch(
        '/:syllabusId',
        upload.single('media'),
        validate(syllabusValidation.update),
        isAuthenticate,
        authorizeRoles("hod"),
        syllabusController.updateSyllabus
    )
    .delete(
        '/:syllabusId',
        validate(syllabusValidation.delete),
        isAuthenticate,
        authorizeRoles("hod"),
        syllabusController.deleteSyllabus
    );

export const syllabusRouter = router;

