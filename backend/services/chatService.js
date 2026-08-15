// services/chatService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Candidate models to attempt sequentially if primary model is unavailable
const DEFAULT_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.0-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const generateResponse = async (userMessage, fileObj = null, history = []) => {
  // Support object parameter format
  if (typeof userMessage === "object" && userMessage !== null && userMessage.userMessage) {
    fileObj = userMessage.fileObj || null;
    history = userMessage.history || [];
    userMessage = userMessage.userMessage;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return `[Mock AI Response]: You said "${userMessage}". (Please set a valid GEMINI_API_KEY in backend/.env)`;
  }

  // Construct candidate list (custom GEMINI_MODEL env var prioritized if set)
  const candidateModels = [];
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim() !== "") {
    candidateModels.push(process.env.GEMINI_MODEL.trim());
  }
  for (const modelName of DEFAULT_MODELS) {
    if (!candidateModels.includes(modelName)) {
      candidateModels.push(modelName);
    }
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  // Build multi-turn content array for Gemini
  const contents = [];

  if (Array.isArray(history) && history.length > 0) {
    // Use full history for better context (Gemini models can handle larger context)
    // This allows the AI to remember earlier parts of the conversation
    const historyToUse = history;

    for (const msg of historyToUse) {
      if (!msg || !msg.content) continue;

      const role =
        msg.role === "assistant" || msg.role === "model"
          ? "model"
          : "user";

      const parts = [{ text: msg.content }];

      if (msg.fileData && msg.fileType && msg.fileType.startsWith("image/")) {
        parts.push({
          inlineData: {
            mimeType: msg.fileType,
            data: msg.fileData,
          },
        });
      }

      contents.push({
        role,
        parts,
      });
    }
  }

  // Current turn
  const currentParts = [{ text: userMessage }];

  if (fileObj && fileObj.data) {
    const mimeType = fileObj.type || "";
    const fileName = fileObj.name || "attached-file";

    if (
      mimeType.startsWith("text/") ||
      mimeType === "application/json" ||
      mimeType === "application/xml" ||
      mimeType === "application/javascript" ||
      /\.(txt|json|js|jsx|ts|tsx|html|css|md|csv|py|java|c|cpp|h|xml|log|env|yml|yaml)$/i.test(fileName)
    ) {
      try {
        const decodedText = Buffer.from(fileObj.data, "base64").toString("utf-8");
        currentParts.push({
          text: `\n\n[Attached File: ${fileName}]\n\`\`\`\n${decodedText}\n\`\`\``,
        });
      } catch {
        currentParts.push({
          inlineData: {
            mimeType: mimeType || "application/octet-stream",
            data: fileObj.data,
          },
        });
      }
    } else {
      currentParts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: fileObj.data,
        },
      });
    }
  }

  contents.push({
    role: "user",
    parts: currentParts,
  });

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: "You are Zeru AI, a helpful, intelligent, and friendly AI assistant.",
      });

      // Format prior history for Gemini startChat
      const formattedHistory = [];
      if (Array.isArray(history) && history.length > 0) {
        // Use full history for better context awareness
        for (const msg of history) {
          if (!msg || !msg.content) continue;
          const role =
            msg.role === "assistant" || msg.role === "model"
              ? "model"
              : "user";

          const parts = [{ text: msg.content }];
          if (msg.fileData && msg.fileType && msg.fileType.startsWith("image/")) {
            parts.push({
              inlineData: {
                mimeType: msg.fileType,
                data: msg.fileData,
              },
            });
          }
          formattedHistory.push({ role, parts });
        }
      }

      // Current turn parts
      const currentParts = [{ text: userMessage }];

      if (fileObj && fileObj.data) {
        const mimeType = fileObj.type || "";
        const fileName = fileObj.name || "attached-file";

        if (
          mimeType.startsWith("text/") ||
          mimeType === "application/json" ||
          mimeType === "application/xml" ||
          mimeType === "application/javascript" ||
          /\.(txt|json|js|jsx|ts|tsx|html|css|md|csv|py|java|c|cpp|h|xml|log|env|yml|yaml)$/i.test(fileName)
        ) {
          try {
            const decodedText = Buffer.from(fileObj.data, "base64").toString("utf-8");
            currentParts.push({
              text: `\n\n[Attached File: ${fileName}]\n\`\`\`\n${decodedText}\n\`\`\``,
            });
          } catch {
            currentParts.push({
              inlineData: {
                mimeType: mimeType || "application/octet-stream",
                data: fileObj.data,
              },
            });
          }
        } else {
          currentParts.push({
            inlineData: {
              mimeType: mimeType || "image/png",
              data: fileObj.data,
            },
          });
        }
      }

      if (formattedHistory.length > 0) {
        const chatSession = model.startChat({
          history: formattedHistory,
        });
        const result = await chatSession.sendMessage(currentParts);
        const response = await result.response;
        return response.text();
      } else {
        const result = await model.generateContent(currentParts);
        const response = await result.response;
        return response.text();
      }
    } catch (error) {
      console.warn(
        `Gemini model '${modelName}' failed (${error.message}). Trying next available model...`,
      );
      lastError = error;
    }
  }

  console.error("All candidate Gemini models failed. Last error:", lastError);
  throw new Error(
    `Failed to generate response from Gemini API: ${lastError ? lastError.message : "Unknown error"}`,
  );
};

module.exports = { generateResponse };