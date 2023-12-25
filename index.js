import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import route from "./routes/userRoute.js"

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(()=>{
    console.log("DB connected succesfully");

    app.listen(PORT,()=>{
        console.log(`Server is running on port: ${PORT}`);
    })
}).catch((error)=>console.log(error))

app.use("/api/users/",route)