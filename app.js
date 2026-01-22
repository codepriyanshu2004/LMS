import {config} from "dotenv";
config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js"
import errorMiddleware from "./middleware/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import courseRoutes from "./routes/course.route.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: true,
    credentials:true
}));

app.use(morgan("dev"));

app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});



app.use("/ping",(req,res)=>{
    res.send("You are in the root")
})

//routes of 3 modules

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/courses",courseRoutes);






app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware);


export default app;
