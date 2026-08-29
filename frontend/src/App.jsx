import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import LogoutModal from "./components/LogoutModal";

import {
  useAuth,
} from "./context/AuthContext";

import {
  getChat,
  getChats,
  deleteChat,
  sendMessage,
  toggleFavoriteChat,
  renameChat,
} from "./services/chatApi";

function App() {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  } = useAuth();

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("zeru_guest_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("zeru_active_chat_id") || null;
  });

  const [loading, setLoading] =
    useState(false);

  const [
    remainingFreeMessages,
    setRemainingFreeMessages,
  ] = useState(3);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [
    registerOpen,
    setRegisterOpen,
  ] = useState(false);

  const [logoutOpen, setLogoutOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * Save guest messages locally when guest sends message
   */
  useEffect(() => {
    if (!isAuthenticated) {
      if (messages.length > 0) {
        localStorage.setItem("zeru_guest_messages", JSON.stringify(messages));
      } else {
        localStorage.removeItem("zeru_guest_messages");
      }
    }
  }, [messages, isAuthenticated]);

  /*
   * Load chat history after login
   */
  const loadChats = useCallback(async (targetChatId = null) => {
    try {
      const data = await getChats();
      const fetchedChats = data.chats || [];

      setChats(fetchedChats);

      if (fetchedChats.length > 0) {
        const savedId = targetChatId || localStorage.getItem("zeru_active_chat_id");
        const validChat = fetchedChats.find((c) => c._id === savedId);
        const chatToSelect = validChat ? savedId : fetchedChats[0]._id;

        if (chatToSelect) {
          try {
            const chatData = await getChat(chatToSelect);
            setActiveChatId(chatToSelect);
            localStorage.setItem("zeru_active_chat_id", chatToSelect);
            setMessages(chatData.chat?.messages || []);
          } catch {
            // fallback
          }
        }
      } else {
        setActiveChatId(null);
        setMessages([]);
        localStorage.removeItem("zeru_active_chat_id");
      }
    } catch (error) {
      console.warn(
        "Could not load chats:",
        error.message
      );
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setChats([]);
      return;
    }

    // Clear guest messages when authenticated
    localStorage.removeItem("zeru_guest_messages");
    loadChats();
  }, [isAuthenticated, loadChats]);

  /*
   * New conversation
   */
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setError("");
    localStorage.removeItem("zeru_active_chat_id");
    localStorage.removeItem("zeru_guest_messages");
  };

  /*
   * Select existing conversation
   */
  const handleSelectChat = async (
    chatId
  ) => {
    try {
      setError("");

      const data = await getChat(chatId);

      setActiveChatId(chatId);
      localStorage.setItem("zeru_active_chat_id", chatId);

      setMessages(
        data.chat?.messages || []
      );
    } catch (error) {
      setError(
        error.message ||
        "Unable to load conversation."
      );
    }
  };

  /*
   * Delete conversation
   */
  const handleDeleteChat = async (
    chatId
  ) => {
    try {
      await deleteChat(chatId);

      setChats((current) =>
        current.filter(
          (chat) => chat._id !== chatId
        )
      );

      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (error) {
      setError(
        error.message ||
        "Unable to delete conversation."
      );
    }
  };

  /*
   * Toggle favorite conversation
   */
  const handleToggleFavorite = async (chatId) => {
    setChats((current) =>
      current.map((chat) =>
        chat._id === chatId ? { ...chat, isFavorite: !chat.isFavorite } : chat
      )
    );

    if (isAuthenticated) {
      try {
        await toggleFavoriteChat(chatId);
      } catch (error) {
        console.warn("Could not toggle favorite on backend:", error.message);
      }
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    setChats((prev) =>
      prev.map((c) => (c._id === chatId ? { ...c, title: newTitle } : c))
    );

    if (isAuthenticated) {
      try {
        await renameChat(chatId, newTitle);
      } catch (error) {
        console.warn("Could not rename chat on backend:", error.message);
      }
    }
  };

  /*
   * Send message
   */
  const handleSendMessage = async (
    text,
    file
  ) => {
    if (!text.trim() || loading) return;

    setError("");

    setLoading(true);

    try {
      let fileData = null;
      let fileName = null;
      let fileType = null;

      if (file) {
        fileData = await fileToBase64(file);
        fileName = file.name;
        fileType = file.type;
      }

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        fileName,
        fileType,
        fileData,
      };

      setMessages((current) => [
        ...current,
        userMessage,
      ]);

      const data = await sendMessage({
        message: text,
        chatId: activeChatId,
        fileData,
        fileName,
        fileType,
        history: messages.slice(-14),
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "I couldn't generate a response.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      /*
       * Guest user
       */
      if (
        typeof data.remainingFreeMessages ===
        "number"
      ) {
        setRemainingFreeMessages(
          data.remainingFreeMessages
        );
      }

      /*
       * Authenticated user
       */
      if (data.chatId) {
        setActiveChatId(data.chatId);
        localStorage.setItem("zeru_active_chat_id", data.chatId);

        if (isAuthenticated) {
          loadChats(data.chatId);
        }
      }
    } catch (error) {
      if (
        error.code === "LOGIN_REQUIRED"
      ) {
        setLoginOpen(true);
      } else {
        setError(
          error.message ||
          "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    handleSendMessage(text, null);
  };

  const handleLogin = async (
    email,
    password
  ) => {
    await login(email, password);

    setRemainingFreeMessages(null);

    setLoginOpen(false);

    setRegisterOpen(false);

    await loadChats();
  };

  const handleRegister = async (
    name,
    email,
    password
  ) => {
    await register(
      name,
      email,
      password
    );

    setRemainingFreeMessages(null);

    setLoginOpen(false);

    setRegisterOpen(false);

    await loadChats();
  };

  const handleLogout = async () => {
    await logout();

    handleNewChat();

    setRemainingFreeMessages(3);
    localStorage.removeItem("zeru_active_chat_id");
    localStorage.removeItem("zeru_guest_messages");
  };

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  return (
    <div
      className="
        flex
        h-dvh
        w-full
        overflow-hidden
        bg-zinc-50
        text-zinc-900

        dark:bg-[#09090b]
        dark:text-zinc-100
      "
    >
      {/* Sidebar */}
      <Sidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onToggleFavorite={handleToggleFavorite}
        onRenameChat={handleRenameChat}
        onLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onLogoutClick={handleLogoutClick}
        mobileOpen={mobileSidebar}
        onClose={() =>
          setMobileSidebar(false)
        }
      />

      {/* Main application */}
      <main
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
        <ChatHeader
          user={user}
          onMenuClick={() =>
            setMobileSidebar(true)
          }
          onLogin={() => {
            setRegisterOpen(false);
            setLoginOpen(true);
          }}
        />

        {/* Error */}
        {error && (
          <div
            className="
              shrink-0
              border-b
              border-red-200
              bg-red-50
              px-4 py-2

              dark:border-red-500/10
              dark:bg-red-500/5
            "
          >
            <div
              className="
                mx-auto
                flex
                max-w-3xl
                items-center
                gap-2
                text-xs
                text-red-600
                dark:text-red-400
              "
            >
              <AlertCircle size={14} />

              <span className="flex-1">
                {error}
              </span>

              <button
                onClick={() => setError("")}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <ChatWindow
          messages={messages}
          loading={loading}
          onSuggestion={handleSuggestion}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          loading={loading}
          remainingFreeMessages={
            isAuthenticated
              ? null
              : remainingFreeMessages
          }
        />
      </main>

      {/* Login */}
      <LoginModal
        open={loginOpen}
        onClose={() =>
          setLoginOpen(false)
        }
        onLogin={handleLogin}
        onRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      {/* Register */}
      <RegisterModal
        open={registerOpen}
        onClose={() =>
          setRegisterOpen(false)
        }
        onRegister={handleRegister}
        onLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      {/* Logout Confirmation */}
      <LogoutModal
        open={logoutOpen}
        onClose={() =>
          setLogoutOpen(false)
        }
        onConfirm={handleLogout}
      />
    </div>
  );
}

/*
 * Convert a File to Base64.
 */
function fileToBase64(file) {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        /*
         * Remove:
         * data:image/png;base64,
         */
        const base64 =
          String(result).split(",")[1];

        resolve(base64);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    }
  );
}

export default App;