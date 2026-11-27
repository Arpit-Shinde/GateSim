const mongoose = require("mongoose");
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully! 🚀");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Kill the app if it can't connect to the DB
    }
}
module.exports = connectToDB
