import mongoose from "mongoose";

const connectToDB =async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/task-management-api").then(() => {
            console.log("Connect to database")
        })
    } catch (error) {
        console.error("Error from Database",error)
    }
}

export default connectToDB