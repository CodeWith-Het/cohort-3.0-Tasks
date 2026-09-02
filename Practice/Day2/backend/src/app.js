import express from "express"
import authController from "./controller/auth.controller.js"
const app = express()

app.use(express.json())

app.post("/register",authController.registerUser)
app.post("/login",authController.loginUser)

export default app