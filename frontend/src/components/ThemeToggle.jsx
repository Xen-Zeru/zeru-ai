import {
    Moon,
    Sun,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className="
        flex h-9 w-9 items-center justify-center
        rounded-xl
        border border-zinc-200
        bg-white
        text-zinc-600
        transition
        hover:bg-zinc-100

        dark:border-zinc-800
        dark:bg-zinc-900
        dark:text-zinc-400
        dark:hover:bg-zinc-800
      "
        >
            {theme === "dark" ? (
                <Sun size={17} />
            ) : (
                <Moon size={17} />
            )}
        </button>
    );
}