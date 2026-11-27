const mongoose = require("mongoose")

const circuitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, //to store _id field
        required: true,
        // unique: true  //uncomment this to not allow a single user to save more than one file
    },
    fileName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        default: "application/gzip",
    },
    fileData: { //actual graph
        type: Buffer,
        required: true,
    }

})

circuitSchema.index({ userId: 1, fileName: 1 }, { unique: true });

module.exports = mongoose.model("circuit", circuitSchema) //create a model and export it