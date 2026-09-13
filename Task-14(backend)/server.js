import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import connectToDB from "./src/config/database.js"

connectToDB()

app.listen(3000, () => {
    console.log("Server started at port 3000")
})