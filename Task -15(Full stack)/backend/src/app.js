import express from "express"
import taskRouter from "./router/task.router.js"

const app = express()

app.use(express.json())

app.use("/api/task",taskRouter)

export default app