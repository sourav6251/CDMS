
import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory as Buffer
export const upload = multer({ storage });
