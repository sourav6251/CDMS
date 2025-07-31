//app.js
import express from "express"
import bodyParser from "body-parser"

import corsConfig from "./src/config/cors.config.js"
import { syllabusRouter } from "./src/routes/syllabus.routes.js"
import { certificateRouter } from "./src/routes/certificate.routes.js"
import { meetingRouter } from "./src/routes/meeting.routes.js"
import { noticeboardRouter } from "./src/routes/noticeboard.routes.js"
import { userRouter } from "./src/routes/user.routes.js"
import { routineRouter } from "./src/routes/routin.routes.js"
import mailConfiguration from "./src/config/mail.configuration.js"
import { Users } from "./src/model/user.model.js"
import { NormalUser } from "./src/model/normaluser.model.js"
import { Routines } from "./src/model/routine.model.js"

const server = express()

server.use(corsConfig)
mailConfiguration
server.use(bodyParser.json({ limit: "50mb" }))
server.use(express.json({ limit: "50mb" }))
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))


server.use('/api/v1/certificate', certificateRouter)
server.use('/api/v1/syllabus', syllabusRouter)
server.use('/api/v1/user', userRouter)
server.use('/api/v1/meeting', meetingRouter)
server.use('/api/v1/noticeboard', noticeboardRouter)
server.use('/api/v1/routines', routineRouter)
// server.use('/api/v1/mail', mailRouter)

server.get("/", (req, res) => {
    res.send("application is running ")
    // .json({
    //     message: "all ok "
    // })
})


export default server