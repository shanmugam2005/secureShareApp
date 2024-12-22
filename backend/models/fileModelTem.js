const mongoose = require("mongoose");

const fileModelTem = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: "User", // Assuming you have a 'User' model
    },
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    mode: {
        type: Boolean,
        required: true, // true for write mode, false for read mode
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const File = mongoose.model("File", fileModelTem);

module.exports = File;
