import {
    Code2,
    GraduationCap,
    Lightbulb,
    Network,
} from "lucide-react";

const suggestions = [
    {
        icon: Lightbulb,
        title: "Explore an idea",
        description:
            "Explain how artificial intelligence works",
    },

    {
        icon: GraduationCap,
        title: "Help me study",
        description:
            "Teach me the basics of computer networking",
    },

    {
        icon: Code2,
        title: "Write some code",
        description:
            "Create a React component for a login page",
    },

    {
        icon: Network,
        title: "Solve a problem",
        description:
            "Help me troubleshoot my network",
    },
];

export default function WelcomeScreen({
    onSuggestion,
}) {
    return (
        <div
            className="
        flex
        min-h-full
        items-center
        justify-center
        px-4
        py-12
      "
        >
            <div className="w-full max-w-3xl text-center">

                <img
                    src="/zeru.png"
                    alt="Zeru AI"
                    className="mx-auto h-16 w-16 rounded-full bg-white p-1 object-cover shadow-2xl shadow-violet-500/20 border border-zinc-200/50 dark:border-zinc-800"
                />

                <p
                    className="
            mt-7
            text-[11px]
            font-bold
            uppercase
            tracking-[0.25em]
            text-violet-500
          "
                >
                    Your personal AI assistant
                </p>

                <h2
                    className="
            mt-3
            text-4xl
            font-bold
            tracking-tight
            text-zinc-900

            dark:text-white

            sm:text-5xl
          "
                >
                    Hello there!
                    <br />

                    <span className="text-zinc-400 dark:text-zinc-600">
                        How can I help?
                    </span>
                </h2>

                <p
                    className="
            mx-auto
            mt-5
            max-w-xl
            text-sm
            leading-6
            text-zinc-500
          "
                >
                    Ask me anything, learn something new,
                    write code, brainstorm ideas, or simply
                    start a conversation.
                </p>

                <div
                    className="
            mx-auto
            mt-9
            grid
            max-w-2xl
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
                >
                    {suggestions.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() =>
                                    onSuggestion(item.description)
                                }
                                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-white
                  p-4
                  text-left
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-violet-300
                  hover:shadow-lg
                  hover:shadow-violet-500/5

                  dark:border-zinc-800
                  dark:bg-zinc-900/40
                  dark:hover:border-violet-500/30
                "
                            >
                                <div
                                    className="
                    flex h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-zinc-100
                    text-zinc-500
                    transition
                    group-hover:bg-violet-100
                    group-hover:text-violet-600

                    dark:bg-zinc-800
                    dark:text-zinc-400
                    dark:group-hover:bg-violet-500/10
                    dark:group-hover:text-violet-300
                  "
                                >
                                    <Icon size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                      text-sm
                      font-semibold
                      text-zinc-800
                      dark:text-zinc-200
                    "
                                    >
                                        {item.title}
                                    </p>

                                    <p
                                        className="
                      mt-1
                      truncate
                      text-xs
                      text-zinc-500
                    "
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}