import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "dotenv";

import db from "./db.js";
import router from "./routes/index.js";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/", router);
app.use(ErrorHandlingMiddleware);

const launch = async () => {
    try {
        await db.authenticate();
        await db.sync();
        app.listen(PORT, () => console.log(`Server is currently running on port: ${PORT}`));
    } catch (e) {
        console.error(e)
    }
}

launch();