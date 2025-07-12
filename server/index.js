//index.js main entry file
import "dotenv/config";

import server from "./app.js";
import { dbConnection } from "./src/config/database.config.js";

const PORT = process.env.PORT;

dbConnection();

server.listen(PORT || 8080, () => {
    console.log(" your server is running successfully ", PORT);
});
