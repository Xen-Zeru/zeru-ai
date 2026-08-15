const crypto = require("crypto");

const { generateResponse } = require("../services/chatService");

const Chat = require("../models/Chat");
const GuestUsage = require("../models/GuestUsage");

const FREE_MESSAGES = 3;

const handleChat = async (req, res) => {
  try {
    const {
      message,
      chatId,
      fileData,
      fileName,
      fileType,
      history: guestHistory = [],
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message content is required.",
      });
    }

    /*
     * ========================================
     * AUTHENTICATED USER
     * ========================================
     */

    if (req.user) {
      let chat;

      if (chatId) {
        chat = await Chat.findOne({
          _id: chatId,
          user: req.user.id,
        });
      }

      if (!chat) {
        chat = await Chat.create({
          user: req.user.id,
          title: message.substring(0, 50),
          messages: [],
        });
      }

      // Prior messages history context - send full conversation history
      // for better context understanding across entire chat
      const priorHistory = chat.messages || [];

      chat.messages.push({
        role: "user",
        content: message,
        fileName: fileName || undefined,
        fileType: fileType || undefined,
        fileData: fileData || undefined,
      });

      const reply = await generateResponse(
        message,
        fileData
          ? {
            name: fileName || "uploaded-file",
            type: fileType || "unknown",
            data: fileData,
          }
          : null,
        priorHistory
      );

      chat.messages.push({
        role: "assistant",
        content: reply,
      });

      await chat.save();

      return res.json({
        reply,
        chatId: chat._id,
      });
    }

    /*
     * ========================================
     * GUEST USER
     * ========================================
     */

    let sessionId = req.cookies.guestSession;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      res.cookie(
        "guestSession",
        sessionId,
        {
          httpOnly: true,
          sameSite: "lax",
          secure:
            process.env.NODE_ENV === "production",
          maxAge:
            30 * 24 * 60 * 60 * 1000,
        }
      );
    }

    let usage = await GuestUsage.findOne({
      sessionId,
    });

    if (!usage) {
      usage = await GuestUsage.create({
        sessionId,
        messageCount: 0,
      });
    }

    if (usage.messageCount >= FREE_MESSAGES) {
      return res.status(403).json({
        code: "LOGIN_REQUIRED",
        error:
          "You have used your 3 free AI messages. Please login to continue.",
      });
    }

    const reply = await generateResponse(
      message,
      fileData
        ? {
          name: fileName || "uploaded-file",
          type: fileType || "unknown",
          data: fileData,
        }
        : null,
      guestHistory
    );

    usage.messageCount += 1;

    await usage.save();

    res.json({
      reply,
      remainingFreeMessages:
        FREE_MESSAGES - usage.messageCount,
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error: "Unable to process your message.",
    });
  }
};

const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .select("title isFavorite createdAt updatedAt")
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ error: "Unable to retrieve chat history." });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOne({ _id: id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.json({ chat });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ error: "Unable to retrieve conversation." });
  }
};

const deleteSingleChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOneAndDelete({ _id: id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.json({ message: "Conversation deleted successfully." });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ error: "Unable to delete conversation." });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOne({ _id: id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    chat.isFavorite = !chat.isFavorite;
    await chat.save();

    res.json({ chat });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ error: "Unable to update favorite status." });
  }
};

module.exports = {
  handleChat,
  getUserChats,
  getSingleChat,
  deleteSingleChat,
  toggleFavorite,
};