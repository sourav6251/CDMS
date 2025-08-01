import cors from "cors";

const corsConfig = cors({
    // origin: ["*" ],
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
});
console.log("FRONTEND URI=>",process.env.FRONTEND_URI);

export default corsConfig;
