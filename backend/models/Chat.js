const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        fileName: {
            type: String,
        },

        fileType: {
            type: String,
        },

        fileData: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            default: "New conversation",
            trim: true,
        },

        isFavorite: {
            type: Boolean,
            default: false,
        },

        messages: [messageSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);