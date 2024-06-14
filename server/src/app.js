import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

app.use(
  cors({
    credentials:true,
    origin: 'http://localhost:5173' 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("uploads"))
app.use(cookieParser());


import userRoute from "./Routes/user.route.js";
app.use("/api/v1/users", userRoute);
export default app;
