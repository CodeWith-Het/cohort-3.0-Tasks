import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("Database successfully connected");
    } catch (error) {
        console.error("Error from connect to DB:", error);
    }
};

export default connectToDB;