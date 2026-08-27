const noteModel = require("../models/note.model");

const createNoteController = async (req, res) => {
    try {
        const { title, description } = req.body;

        const createNote = await noteModel.create({
            title,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Note Successfully created",
            data: createNote,
        });
    } catch (error) {
        console.error("Create note error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getAllNoteController = async (req, res) => {
    try {
        const getAllNotes = await noteModel.find();

        return res.status(200).json({
            success: true,
            message: "Notes Successfully fetch",
            data: getAllNotes,
        });
    } catch (error) {
        console.error("error from get all", error);

        return res.status(500).json({
            message: "internal server error",
        });
    }
};

const deleteNoteController = async (req, res) => {
    try {
        const { id } = req.params;

        await noteModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Note successfully delete",
        });
    } catch (error) {
        console.error("error from delete note controller", error);

        return res.status(500).json({
            message: "internal server error",
        });
    }
};

const updateNoteController = async (req, res) => {
    try {
        const { id } = req.params;
        const noteBody = req.body;

        const updateNote = await noteModel.findByIdAndUpdate(id, noteBody, { new: true });

        return res.status(200).json({
            success: true,
            message: "notes successfully updated",
            data: updateNote,
        });
    } catch (error) {
        console.error("error from update note controller", error);

        return res.status(500).json({
            message: "internal server error",
        });
    }
};

const singleEnityController = async (req, res) => {
    try {
        const noteId = req.params.id
        const noteBody = req.body

        const updateNotes = await noteModel.findByIdAndUpdate(noteId, noteBody,{new:true})
        
        return res.status(200).json({
            success:true,
            message: "Notes successfully changes",
            data:updateNotes
        })
    } catch (error) {
        console.error("error from single Update Notes", error)
        
        return res.status(500).json({
            success: true,
            message:"internal server error"
        })
    }
}
module.exports = {
    createNoteController,
    getAllNoteController,
    deleteNoteController,
    updateNoteController,
    singleEnityController
};