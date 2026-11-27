const express = require("express")
const router = express.Router()
const Circuit = require("../models/Circuit")
const verifyToken = require("../middlewares/verifyToken")

router.post("/save", verifyToken, async (req, res) => {
    try {
        let { fileName, fileDataBase64 } = req.body;

        //convert the fileData string into binary format
        const binaryBuffer = Buffer.from(fileDataBase64, "base64");

        //save as new file, or overwrite existing one
        const savedCircuit = await Circuit.findOneAndUpdate(
            { userId: req.userId, fileName: fileName },
            {
                mimeType: "application/gzip",
                fileData: binaryBuffer,
            },
            { new: true, upsert: true }
        );

        return res.json({
            status: `Saved ${savedCircuit.fileName} to cloud`,
        });
    }
    catch (error) {
        console.error("Cloud save error:", error);
        return res.json({ error: "Failed to save circuit to cloud." });
    }
})

router.get("/load", verifyToken, async (req, res) => {
    try {
        const { fileName } = req.query;

        const circuit = await Circuit.findOne({
            userId: req.userId,
            fileName: fileName.trim(),
        });

        return res.send(circuit.fileData);
    }
    catch(error){
        console.log(error);
        return res.json({error: `${error}`});
    }
})

router.get("/list", verifyToken, async (req, res) => {
    try {
        const circuits = await Circuit.find({ userId: req.userId })
            .select("fileName updatedAt")
            .sort({ updatedAt: -1 });

        return res.json({ circuits });
    } catch (error) {
        console.error("Cloud list error:", error);
        return res.json({ error: "Failed to fetch saved circuits." });
    }
});

module.exports = router