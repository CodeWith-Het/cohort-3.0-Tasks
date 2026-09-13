import mongoose from "mongoose"

const userModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    password: {
        type: String,
        required:true
    }
})

const userModel = mongoose.model("user",userModelSchema)
export default userModel