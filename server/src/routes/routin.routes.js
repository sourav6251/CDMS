import express from "express";
// import routineValidation from "../validations/routine.validation.js";
import routineController from "../controller/routine.controller.js";
import { authorizeRoles, isAuthenticate } from "../middlewares/authentication.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import routineValidation from "../validations/routine.validation.js";
// import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router
    .post(
        "/",
        validate(routineValidation.create),
        isAuthenticate,
        authorizeRoles("hod"),
        routineController.createRoutine
    )
    .get("/:semester",validate(routineValidation.show), routineController.showRoutine)
    // .get("/department/:departmentID", routineController.showRoutineDepartment)
    // .patch(
    //     "/:routineId",
    //     isAuthenticate,
    //     routineController.updateRoutine
    // )
    .delete(
        "/",
        validate(routineValidation.delete),
        isAuthenticate,
        authorizeRoles("hod"),
        routineController.deleteRoutine
    );

export const routineRouter = router;