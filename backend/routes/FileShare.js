const express = require("express");
const mongoose = require("mongoose");
const File = require("../models/fileModelTem"); // Import the File schema
const router = express.Router();

// File Share Endpoint
router.post("/fileShare", async (req, res) => {
    const { userId, fileName, fileUrl,mode } = req.body;

    // Validate Input
    if (!userId || !fileName || !fileUrl || !mode ) {
        return res.status(400).json(req.body);
    }

    try {
        // Create a new file entry
        const newFile = new File({
            userId,
            fileName,
            fileUrl,
            mode
        });
        const savedFile = await newFile.save();
        res.status(201).json({ message: "File shared successfully", data: savedFile });
    } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports = router;
