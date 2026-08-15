import { useState } from "react";
import {
    Clock3,
    MessageSquare,
    Plus,
    Search,
    Sparkles,
    Star,
    Trash2,
    X,
    LogOut,
    ChevronLeft,
} from "lucide-react";

export default function Sidebar({
    user,
    chats = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onToggleFavorite,
    onLogin,
    onRegister,
    onLogoutClick,
    mobileOpen,
    onClose,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState("all");
    const [minimized, setMinimized] = useState(false);

    const displayedChats = chats.filter((chat) => {
        const titleMatch =
            !searchQuery.trim() ||
            (chat.title &&
                chat.title.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!titleMatch) return false;

        if (filterMode === "favorites") {
            return !!chat.isFavorite;
        }

        return true;
    });

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="
            fixed inset-0 z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px]
          flex-col

          border-r
          border-zinc-200
          bg-white

          dark:border-zinc-800
          dark:bg-[#0c0c0f]

          transition-transform duration-300

          lg:relative
          lg:z-20
          lg:translate-x-0

          ${mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
        `}
            >
                {/* Logo */}
                <div className="flex h-[68px] items-center justify-between px-5">

                    <div className="flex items-center gap-3">

                        <img
                    src="/zeru.png"
                    alt="Zeru AI"
                    className="h-9 w-9 rounded-xl"
                />

                        <div>
                            <h1
                                className="
                  text-sm font-bold
                  text-zinc-900
                  dark:text-white
                "
                            >
                                Zeru AI
                            </h1>

                            <p
                                className="
                  text-[10px]
                  text-zinc-500
                "
                            >
                                Your AI Assistant
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-zinc-400
              hover:bg-zinc-100
              dark:hover:bg-zinc-900
              lg:hidden
            "
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* New chat */}
                <div className="px-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFilterMode("all");
                            onNewChat();
                            onClose();
                        }}
                        className="
              flex w-full items-center justify-center gap-2
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              px-4 py-3
              text-sm
              font-semibold
              text-zinc-800
              transition
              hover:bg-zinc-100

              dark:border-zinc-800
              dark:bg-zinc-900
              dark:text-zinc-200
              dark:hover:bg-zinc-800
            "
                    >
                        <Plus size={17} />
                        New Chat
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-5">
                    <div
                        className="
              flex items-center gap-2
              rounded-xl
              border
              border-zinc-200
              bg-zinc-50
              px-3
              dark:border-zinc-800
              dark:bg-zinc-900/60
            "
                    >
                        <Search
                            size={15}
                            className="text-zinc-400"
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search chats"
                            className="
                h-9 w-full
                bg-transparent
                text-xs
                text-zinc-800
                outline-none
                placeholder:text-zinc-500
                dark:text-zinc-200
              "
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick access */}
                <div className="px-4 pt-6">

                    <p
                        className="
              px-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-zinc-400
            "
                    >
                        Quick Access
                    </p>

                    <div className="mt-2 space-y-1">

                        <button
                            type="button"
                            onClick={() => {
                                setFilterMode("all");
                                onNewChat();
                                onClose();
                            }}
                            className={`
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-left
                text-xs
                font-medium
                transition
                ${filterMode === "all"
                                    ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                }
              `}
                        >
                            <MessageSquare size={16} />
                            New conversation
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFilterMode("all");
                                if (chats.length > 0) {
                                    onSelectChat(chats[0]._id);
                                    onClose();
                                }
                            }}
                            className="
                flex w-full items-center gap-3
                rounded-xl
                px-3 py-2.5
                text-left
                text-xs
                text-zinc-600
                hover:bg-zinc-100
                dark:text-zinc-400
                dark:hover:bg-zinc-900
                transition
              "
                        >
                            <Clock3 size={16} />
                            Recent chats
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFilterMode((curr) =>
                                    curr === "favorites" ? "all" : "favorites"
                                );
                            }}
                            className={`
                flex w-full items-center justify-between
                rounded-xl
                px-3 py-2.5
                text-left
                text-xs
                transition
                ${filterMode === "favorites"
                                    ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <Star
                                    size={16}
                                    className={
                                        filterMode === "favorites"
                                            ? "fill-amber-400 text-amber-500"
                                            : ""
                                    }
                                />
                                Favorites
                            </div>

                            {chats.filter((c) => c.isFavorite).length > 0 && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                    {chats.filter((c) => c.isFavorite).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Chat history */}
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-6">

                    <div className="flex items-center justify-between px-2">
                        <p
                            className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-zinc-400
              "
                        >
                            {filterMode === "favorites"
                                ? "Favorite Conversations"
                                : "Conversations"}
                        </p>

                        <div className="flex items-center gap-2">
                            {user && (
                                <span className="text-[10px] text-zinc-500">
                                    {displayedChats.length}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setMinimized(!minimized)}
                                className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                                title="Minimize"
                            >
                                <ChevronLeft size={14} className={`transition-transform ${ minimized ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 space-y-1">

                        {filterMode === "favorites" &&
                            displayedChats.length === 0 && (
                                <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center dark:border-zinc-800">
                                    <Star size={18} className="mx-auto text-amber-400" />
                                    <p className="mt-2 text-[11px] text-zinc-400">
                                        No favorite chats yet.<br />Hover over any chat and click the star to favorite it!
                                    </p>
                                </div>
                            )}

                        {filterMode !== "favorites" &&
                            displayedChats.length === 0 && (
                                <div
                                    className="
                  rounded-xl
                  border
                  border-dashed
                  border-zinc-200
                  p-4
                  text-center

                  dark:border-zinc-800
                "
                                >
                                    <MessageSquare
                                        size={18}
                                        className="
                    mx-auto
                    text-zinc-300
                    dark:text-zinc-700
                  "
                                    />

                                    <p
                                        className="
                    mt-2
                    text-[11px]
                    text-zinc-400
                  "
                                    >
                                        {user
                                            ? "Your conversations will appear here."
                                            : "Login to save your conversations."}
                                    </p>
                                </div>
                            )}

                        {displayedChats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`
                  group
                  flex items-center gap-1
                  rounded-xl
                  transition

                  ${activeChatId === chat._id
                                        ? "bg-violet-50 dark:bg-violet-500/10"
                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                    }
                `}
                            >
                                {/* Selected indicator circle */}
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center ml-1">
                                    {activeChatId === chat._id ? (
                                        <div className="h-2.5 w-2.5 rounded-full bg-violet-500"></div>
                                    ) : (
                                        <div className="h-2 w-2 rounded-full border border-zinc-300 dark:border-zinc-600"></div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectChat(chat._id);
                                        onClose();
                                    }}
                                    className="
                    min-w-0 flex-1
                    px-2 py-2.5
                    text-left
                  "
                                >
                                    <span
                                        className={`
                        truncate
                        text-xs
                        ${activeChatId === chat._id
                                            ? "font-semibold text-violet-700 dark:text-violet-300"
                                            : "text-zinc-600 dark:text-zinc-400"
                                        }
                      `}
                                    >
                                        {chat.title ||
                                            "New conversation"}
                                    </span>
                                </button>

                                {/* Favorite button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onToggleFavorite) {
                                            onToggleFavorite(chat._id);
                                        }
                                    }}
                                    className={`
                    h-7 w-7 items-center justify-center rounded-lg transition
                    ${chat.isFavorite
                                            ? "flex text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                            : "hidden group-hover:flex text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-amber-500"
                                        }
                  `}
                                    title={
                                        chat.isFavorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    <Star
                                        size={13}
                                        className={
                                            chat.isFavorite
                                                ? "fill-amber-400 text-amber-500"
                                                : ""
                                        }
                                    />
                                </button>

                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat._id);
                                    }}
                                    className="
                    mr-1
                    hidden
                    h-7 w-7
                    items-center justify-center
                    rounded-lg
                    text-zinc-400
                    hover:bg-red-50
                    hover:text-red-500
                    group-hover:flex

                    dark:hover:bg-red-500/10
                  "
                                    title="Delete chat"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">

                    {!user ? (
                        <div
                            className="
                rounded-2xl
                border
                border-violet-200
                bg-violet-50
                p-4

                dark:border-violet-500/10
                dark:bg-violet-500/5
              "
                        >
                            <div
                                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  bg-violet-100
                  text-violet-600
                  dark:bg-violet-500/10
                  dark:text-violet-300
                "
                            >
                                <Sparkles size={16} />
                            </div>

                            <p
                                className="
                  mt-3
                  text-xs
                  font-semibold
                  text-zinc-800
                  dark:text-zinc-200
                "
                            >
                                Get more from Zeru AI
                            </p>

                            <p
                                className="
                  mt-1
                  text-[10px]
                  leading-4
                  text-zinc-500
                "
                            >
                                Login to save chats and
                                continue unlimited conversations.
                            </p>

                            <div className="mt-3 flex gap-2">

                                <button
                                    onClick={onLogin}
                                    className="
                    flex-1
                    rounded-lg
                    bg-violet-600
                    px-3 py-2
                    text-[11px]
                    font-semibold
                    text-white
                    hover:bg-violet-500
                  "
                                >
                                    Login
                                </button>

                                <button
                                    onClick={onRegister}
                                    className="
                    flex-1
                    rounded-lg
                    border
                    border-zinc-200
                    bg-white
                    px-3 py-2
                    text-[11px]
                    font-semibold
                    text-zinc-700
                    hover:bg-zinc-50

                    dark:border-zinc-800
                    dark:bg-zinc-900
                    dark:text-zinc-300
                  "
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="
                flex items-center gap-3
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                p-3

                dark:border-zinc-800
                dark:bg-zinc-900/50
              "
                        >
                            <div
                                className="
                  flex h-9 w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500
                  to-indigo-600
                  text-xs
                  font-bold
                  text-white
                "
                            >
                                {user.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="
                    truncate
                    text-xs
                    font-semibold
                    text-zinc-800
                    dark:text-zinc-200
                  "
                                >
                                    {user.name}
                                </p>

                                <p
                                    className="
                    truncate
                    text-[10px]
                    text-zinc-500
                  "
                                >
                                    {user.email}
                                </p>
                            </div>

                            <button
                                onClick={onLogoutClick}
                                title="Logout"
                                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  text-zinc-400
                  hover:bg-red-50
                  hover:text-red-500

                  dark:hover:bg-red-500/10
                "
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}