const express = require("express")
const router = require("./router/file.router")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello brother")
})

app.use("/file", router)

module.exports = app