const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Database");
    } catch (error) {
        console.log("error from databse",error)
    }
}

module.exports = connectToDB