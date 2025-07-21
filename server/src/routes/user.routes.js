import express from "express";
import { validate } from "../middlewares/validate.middleware.js";

import userValidation from "../validations/user.validation.js";
import {
    authorizeRoles,
    isAuthenticate,
} from "../middlewares/authentication.middleware.js";
import userController from "../controller/user.controller.js";
import { upload } from "../utils/multerStorage.js";

const router = express.Router();

router
    .post("/create",validate(userValidation.createUser),userController.createUser) //
    .post("/create_hod",validate(userValidation.createUserHod),isAuthenticate,authorizeRoles("admin"),userController.createHod)
    .post("/login", validate(userValidation.login), userController.loginUser)
    // .post("/logins", userController.loginUsers)
    .post("/send_otp",validate(userValidation.sendOtp),userController.generateOtp)
    .post("/verify_otp",validate(userValidation.verifyOtp),userController.verifyOtp)
    .get("/getuser", isAuthenticate, userController.getUserById)
    .get("/getalluser",isAuthenticate,authorizeRoles("admin","hod"),userController.getAllUser)
    // .delete("/",isAuthenticate,userController.deleteUser)
    .put("/",isAuthenticate,validate(userValidation.updateUser),upload.single("photo") ,userController.updateUser)
    .get("/logout",isAuthenticate,userController.logout)
    .put("/update_password",validate(userValidation.updatePassword),isAuthenticate,userController.updatePassword)
    .delete("/",isAuthenticate,userController.deleteUser)
    .delete("/hoddelete/:userID",validate(userValidation.approve),isAuthenticate,authorizeRoles("hod"),userController.hoddelete)
    .put("/approve/:userID",validate(userValidation.approve),isAuthenticate,authorizeRoles("hod"),userController.approveByHOD)
    .get("/external",isAuthenticate,authorizeRoles("hod"),userController.getAllExternalUsers)

export const userRouter = router;
