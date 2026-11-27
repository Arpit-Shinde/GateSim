require("dotenv").config()
const express = require("express")
const connectToDB = require("./db")
const authRoutes = require("../routes/auth")
const circuitRoutes = require("../routes/circuit")
const cors = require("cors");
const app = express()
const port = process.env.port || 5001;

app.use(cors())
app.use(express.json({limit: "10mb"}))

connectToDB()

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.listen(port, ()=>{
    console.log("server is running on 5001")
})
app.get("/", (req, res)=>{
    res.send("Welcome to the app")
})

app.use("/auth", authRoutes)
app.use("/circuits", circuitRoutes)
