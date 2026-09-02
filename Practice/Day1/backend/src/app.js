const express = require("express")
const noteRouter = require("./routers/note.router")

const app = express()

app.use(express.json())

app.use("/notes",noteRouter)

module.exports = app