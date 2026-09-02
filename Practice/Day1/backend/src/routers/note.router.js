const express = require("express")
const { createNoteController, getAllNoteController, deleteNoteController, updateNoteController, singleEnityController } = require("../controllers/note.controller")

const noteRouter = express.Router()

noteRouter.post("/create", createNoteController)
noteRouter.get("/getnotes", getAllNoteController)
noteRouter.delete("/delete/:id", deleteNoteController)
noteRouter.put("/update/:id", updateNoteController)
noteRouter.patch("/:id/single",singleEnityController)

module.exports = noteRouter