import express from "express";
import multer from "multer";
import noticeboardValidation from "../validations/noticeboard.validation.js";
import { validate } from "../middlewares/validate.middleware.js";
import noticeboardController from "../controller/noticeboard.controller.js";
import {
    authorizeRoles,
    isAuthenticate,
} from "../middlewares/authentication.middleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
});

router
    .post(
        "/",
        validate(noticeboardValidation.create),
        isAuthenticate,
        authorizeRoles("hod"),
        upload.single("media"),
        noticeboardController.createNotice
    )
    .get("/", noticeboardController.showNotices)
    .patch(
        "/:noticeId",
        isAuthenticate,
        authorizeRoles("hod"),
        upload.single("media"),
        noticeboardController.updateNotice
    )
    .delete(
        "/:noticeId",
        validate(noticeboardValidation.delete),
        isAuthenticate,
        authorizeRoles("hod"),
        noticeboardController.deleteNotice
    );

export const noticeboardRouter = router;
