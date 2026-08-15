import {
    Bot,
    LoaderCircle,
} from "lucide-react";

import ChatMessage from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";

export default function ChatWindow({
    messages,
    loading,
    onSuggestion,
}) {
    if (messages.length === 0) {
        return (
            <div className="min-h-0 flex-1 overflow-y-auto">
                <WelcomeScreen
                    onSuggestion={onSuggestion}
                />
            </div>
        );
    }

    return (
        <div
            className="
        min-h-0
        flex-1
        overflow-y-auto
      "
        >
            <div
                className="
          mx-auto
          w-full
          max-w-3xl
          space-y-3
          px-4
          py-4
          sm:px-6
        "
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={
                            message.id ||
                            `${message.role}-${index}`
                        }
                        message={message}
                    />
                ))}

                {loading && (
                    <div className="flex gap-3">
                        <div
                            className="
                flex h-8 w-8
                shrink-0
                items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-500
                to-indigo-600
                text-white
              "
                        >
                            <Bot size={16} />
                        </div>

                        <div
                            className="
                flex items-center gap-2
                rounded-2xl
                bg-zinc-100
                px-4 py-3

                dark:bg-zinc-900
              "
                        >
                            <span className="text-xs text-zinc-500">
                                Zeru is thinking
                            </span>

                            <LoaderCircle
                                size={14}
                                className="
                  animate-spin
                  text-violet-500
                "
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}