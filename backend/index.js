import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // allow us to parse json data from the request body as req.body 
app.use(cookieParser()) // allow us to parse cookies from the request headers as req.cookies

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log("server in running on port ",PORT);
})