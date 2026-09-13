import mongoose from "mongoose"

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log("database connect to successfully")
        })
    } catch (error) {
        console.error("error from mongoodb ",error)
    }    
}

export default connectToDB