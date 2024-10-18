import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"

const app = express()
dotenv.config()

app.get("/", (req, res) => {
    res.send("hellow world")
})

app.listen(3000, () => {
    connectDB()
    console.log("server in running on port 3000");
})