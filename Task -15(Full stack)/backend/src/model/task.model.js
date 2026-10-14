import mongoose from "mongoose";

const taskSchemaModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength:[100,"title must be 100 character only"]
    },
    description: {
        type: String,
        required: true,
        trim:true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default:"medium"
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default:"pending"
    }
},
    {
    timestamps:true
})

const taskModel = mongoose.model("task", taskSchemaModel)
export default taskModel