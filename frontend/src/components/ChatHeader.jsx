import {
    Menu,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export default function ChatHeader({
    onMenuClick,
    user,
    onLogin,
}) {
    return (
        <header
            className="
        flex h-[68px] shrink-0
        items-center justify-between
        border-b
        border-zinc-200
        bg-white/90
        px-4
        backdrop-blur-xl

        dark:border-zinc-800/70
        dark:bg-[#09090b]/90

        sm:px-6
      "
        >
            <div className="flex items-center gap-3">

                {/* Mobile menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            text-zinc-500
            hover:bg-zinc-100
            hover:text-zinc-900

            dark:hover:bg-zinc-900
            dark:hover:text-white

            lg:hidden
          "
                >
                    <Menu size={19} />
                </button>

                <img
                    src="/zeru.png"
                    alt="Zeru AI"
                    className="h-9 w-9 rounded-full bg-white p-0.5 object-cover shrink-0 shadow-sm border border-zinc-200/50 dark:border-zinc-800"
                />

                <div>
                    <h1
                        className="
              text-sm
              font-semibold
              text-zinc-900

              dark:text-white
            "
                    >
                        Zeru AI
                    </h1>

                    <p
                        className="
              text-[11px]
              text-zinc-500
            "
                    >
                        AI Assistant
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">

                <ThemeToggle />

                {!user && (
                    <button
                        type="button"
                        onClick={onLogin}
                        className="
              hidden
              rounded-xl
              bg-zinc-900
              px-4 py-2
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-zinc-700

              dark:bg-white
              dark:text-zinc-900
              dark:hover:bg-zinc-200

              sm:block
            "
                    >
                        Login
                    </button>
                )}

                {user && (
                    <div
                        className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-violet-100
              text-xs
              font-bold
              text-violet-600

              dark:bg-violet-500/10
              dark:text-violet-300
            "
                        title={user.name}
                    >
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </header>
    );
}