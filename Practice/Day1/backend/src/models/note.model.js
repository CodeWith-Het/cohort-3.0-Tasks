const mongoose = require("mongoose")

const noteSchemaModel = new mongoose.Schema({
    title: String,
    description:String
})

const noteModel = mongoose.model("note", noteSchemaModel)
module.exports = noteModel