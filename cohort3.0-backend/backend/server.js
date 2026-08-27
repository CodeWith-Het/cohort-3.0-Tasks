require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

const startServer = async () => {
    try {
        await connectToDB();
        const port = process.env.PORT || 5000;

        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();