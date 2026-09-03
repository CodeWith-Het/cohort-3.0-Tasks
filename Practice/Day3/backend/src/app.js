const express = require("express")
const router = require("./routers/file.router")

const app = express()

app.use(express.json())

app.get("/", (req,res) => {
    res.send("hello bhai")
})

app.use("/file",router)

module.exports = app