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
// import { mailRouter } from "./src/routes/mail.route.js"
// import "./src/utils/sendRoutineMails.js";

// import { swaggerSpec } from "./src/config/swagger.config.js";


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
    res.send("application is run ")
    // .json({
    //     message: "all ok "
    // })
})


export default server