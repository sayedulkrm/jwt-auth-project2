import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import user from "./routes/userRoutes.js";

config({
    path: "./config/config.env",
});

const app = express();

app.use("/api/v1", user);

app.get("/", (req, res) => {
    res.send(
        `Server is Running. To check Frontend Click <a href="${process.env.FRONTEND_URL}"> here </a>`
    );
});

export default app;

// Always use Error Middleware at the end of all function
app.use(ErrorMiddleware);
