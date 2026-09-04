const express = require("express")
const cors = require("cors")
const router = require("./router/file.router")

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello brother")
})

app.use("/file", router)

module.exports = app