import { useState } from "react";
import {
    MessageSquare,
    Plus,
    Search,
    Sparkles,
    Pin,
    Trash2,
    X,
    LogOut,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

export default function Sidebar({
    user,
    chats = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onToggleFavorite,
    onRenameChat,
    onLogin,
    onRegister,
    onLogoutClick,
    mobileOpen,
    onClose,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [pinnedMinimized, setPinnedMinimized] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    const searchFilteredChats = chats.filter((chat) => {
        return (
            !searchQuery.trim() ||
            (chat.title &&
                chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const pinnedChats = searchFilteredChats.filter((chat) => !!chat.isFavorite);
    const unpinnedChats = searchFilteredChats.filter((chat) => !chat.isFavorite);

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
                            className="h-9 w-9 rounded-full bg-white p-0.5 object-cover shrink-0 shadow-sm border border-zinc-200/50 dark:border-zinc-800"
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

                {/* Pinned Section */}
                <div className="px-4 pt-5">
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Pinned
                        </p>
                        <div className="flex items-center gap-2">
                            {user && (
                                <span className="text-[10px] text-zinc-500">
                                    {pinnedChats.length}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setPinnedMinimized(!pinnedMinimized)}
                                className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                                title={pinnedMinimized ? "Reveal pinned conversations" : "Minimize pinned conversations"}
                            >
                                {pinnedMinimized ? (
                                    <ChevronRight size={14} />
                                ) : (
                                    <ChevronDown size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    {!pinnedMinimized && (
                        <div className="mt-2 space-y-1">
                            {pinnedChats.length === 0 && (
                                <div className="rounded-xl border border-dashed border-zinc-200 p-3 text-center dark:border-zinc-800">
                                    <Pin size={16} className="mx-auto text-zinc-300 dark:text-zinc-700" />
                                    <p className="mt-1 text-[11px] text-zinc-400">
                                        No pinned chats yet.
                                    </p>
                                </div>
                            )}

                            {pinnedChats.map((chat) => (
                                <div
                                    key={chat._id}
                                    className={`
                                        group
                                        relative
                                        flex items-center gap-1.5
                                        rounded-xl
                                        px-2 py-0.5
                                        transition

                                        ${activeChatId === chat._id
                                            ? "bg-violet-50 dark:bg-violet-500/10"
                                            : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                        }
                                    `}
                                >
                                    <MessageSquare
                                        size={16}
                                        className={`shrink-0 ml-1 transition-colors ${
                                            activeChatId === chat._id
                                                ? "text-violet-600 dark:text-violet-400"
                                                : "text-amber-500 dark:text-amber-400"
                                        }`}
                                    />

                                    {editingChatId === chat._id ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (editingTitle.trim() && onRenameChat) {
                                                    onRenameChat(chat._id, editingTitle.trim());
                                                }
                                                setEditingChatId(null);
                                            }}
                                            className="min-w-0 flex-1 px-1 py-1"
                                        >
                                            <input
                                                type="text"
                                                autoFocus
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onBlur={() => {
                                                    if (editingTitle.trim() && editingTitle.trim() !== chat.title && onRenameChat) {
                                                        onRenameChat(chat._id, editingTitle.trim());
                                                    }
                                                    setEditingChatId(null);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Escape") setEditingChatId(null);
                                                }}
                                                className="w-full rounded-md border border-violet-500 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm outline-none dark:bg-zinc-800 dark:text-zinc-100"
                                            />
                                        </form>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelectChat(chat._id);
                                                onClose();
                                            }}
                                            title={chat.title || "New conversation"}
                                            className="min-w-0 flex-1 py-2 text-left"
                                        >
                                            <span
                                                className={`block truncate text-xs ${
                                                    activeChatId === chat._id
                                                        ? "font-semibold text-violet-700 dark:text-violet-300"
                                                        : "text-zinc-600 dark:text-zinc-400"
                                                }`}
                                            >
                                                {chat.title || "New conversation"}
                                            </span>
                                        </button>
                                    )}

                                    <div className="relative mr-1 shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                                            }}
                                            className={`
                                                flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition
                                                ${openMenuId === chat._id
                                                    ? "flex bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                                    : "hidden group-hover:flex hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                                }
                                            `}
                                            title="More options"
                                        >
                                            <MoreHorizontal size={15} />
                                        </button>

                                        {openMenuId === chat._id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(null);
                                                    }}
                                                />

                                                <div
                                                    className="absolute right-0 top-8 z-50 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingChatId(chat._id);
                                                            setEditingTitle(chat.title || "New conversation");
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    >
                                                        <Pencil size={13} className="text-zinc-400" />
                                                        Rename
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (onToggleFavorite) onToggleFavorite(chat._id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                    >
                                                        <Pin size={13} className="text-amber-500" />
                                                        Unpinned
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            onDeleteChat(chat._id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                    >
                                                        <Trash2 size={13} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Conversations Section */}
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
                            Conversations
                        </p>

                        <div className="flex items-center gap-2">
                            {user && (
                                <span className="text-[10px] text-zinc-500">
                                    {unpinnedChats.length}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setMinimized(!minimized)}
                                className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                                title={minimized ? "Reveal conversations" : "Minimize conversations"}
                            >
                                {minimized ? (
                                    <ChevronRight size={14} />
                                ) : (
                                    <ChevronDown size={14} />
                                )}
                            </button>
                        </div>
                    </div>

                    {!minimized && (
                        <div className="mt-2 space-y-1">

                        {unpinnedChats.length === 0 && (
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

                        {unpinnedChats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`
                                    group
                                    relative
                                    flex items-center gap-1.5
                                    rounded-xl
                                    px-2 py-0.5
                                    transition

                                    ${activeChatId === chat._id
                                        ? "bg-violet-50 dark:bg-violet-500/10"
                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                    }
                                `}
                            >
                                {/* Conversation Icon */}
                                <MessageSquare
                                    size={16}
                                    className={`shrink-0 ml-1 transition-colors ${
                                        activeChatId === chat._id
                                            ? "text-violet-600 dark:text-violet-400"
                                            : "text-zinc-400 dark:text-zinc-500"
                                    }`}
                                />

                                {/* Title / Inline Rename Input */}
                                {editingChatId === chat._id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (editingTitle.trim() && onRenameChat) {
                                                onRenameChat(chat._id, editingTitle.trim());
                                            }
                                            setEditingChatId(null);
                                        }}
                                        className="min-w-0 flex-1 px-1 py-1"
                                    >
                                        <input
                                            type="text"
                                            autoFocus
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                            onBlur={() => {
                                                if (editingTitle.trim() && editingTitle.trim() !== chat.title && onRenameChat) {
                                                    onRenameChat(chat._id, editingTitle.trim());
                                                }
                                                setEditingChatId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") {
                                                    setEditingChatId(null);
                                                }
                                            }}
                                            className="w-full rounded-md border border-violet-500 bg-white px-2 py-1 text-xs text-zinc-900 shadow-sm outline-none dark:bg-zinc-800 dark:text-zinc-100"
                                        />
                                    </form>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelectChat(chat._id);
                                            onClose();
                                        }}
                                        title={chat.title || "New conversation"}
                                        className="min-w-0 flex-1 py-2 text-left"
                                    >
                                        <span
                                            className={`block truncate text-xs ${
                                                activeChatId === chat._id
                                                    ? "font-semibold text-violet-700 dark:text-violet-300"
                                                    : "text-zinc-600 dark:text-zinc-400"
                                            }`}
                                        >
                                            {chat.title || "New conversation"}
                                        </span>
                                    </button>
                                )}

                                {/* 3-dots Action Menu */}
                                <div className="relative mr-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                                        }}
                                        className={`
                                            flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition
                                            ${openMenuId === chat._id
                                                ? "flex bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                                : "hidden group-hover:flex hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                            }
                                        `}
                                        title="More options"
                                    >
                                        <MoreHorizontal size={15} />
                                    </button>

                                    {openMenuId === chat._id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(null);
                                                }}
                                            />

                                            <div
                                                className="absolute right-0 top-8 z-50 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Rename */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingChatId(chat._id);
                                                        setEditingTitle(chat.title || "New conversation");
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    <Pencil size={13} className="text-zinc-400" />
                                                    Rename
                                                </button>

                                                {/* Pin */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (onToggleFavorite) onToggleFavorite(chat._id);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                >
                                                    <Pin size={13} className="text-zinc-400" />
                                                    Pin
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onDeleteChat(chat._id);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                                >
                                                    <Trash2 size={13} />
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
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