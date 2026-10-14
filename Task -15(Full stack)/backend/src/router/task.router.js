import express from "express"
import { createTask, getAllTask, getSingleTask, updateTask } from "../controller/task.controller.js"

const router = express.Router()

router.post("/create", createTask)
router.get("/getall", getAllTask)
router.get("/getsingletask/:id",getSingleTask)
router.patch("/update/:id",updateTask)

export default router