import cors from "cors";

const corsConfig = cors({
    // origin: ["*" ],
    origin: ["http://localhost:3000","https://college-department-management-syste.vercel.app","college-department-management-git-53c152-skds-projects-c76a720c.vercel.app" ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
});

export default corsConfig;
