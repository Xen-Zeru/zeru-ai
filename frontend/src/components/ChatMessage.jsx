import {
    Bot,
    Copy,
    Check,
    UserRound,
    FileText,
} from "lucide-react";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function checkIsImage(fileName, fileType) {
    if (fileType && fileType.startsWith("image/")) return true;
    if (fileName && /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(fileName)) return true;
    return false;
}

export default function ChatMessage({
    message,
}) {
    const [copied, setCopied] = useState(false);

    const isUser = message.role === "user";

    const attachmentMatch = message.content?.match(/📎\s*(?:Attached file:\s*)?([^\n]+)/i);
    const fileName = message.fileName || attachmentMatch?.[1];
    const fileType = message.fileType;
    const fileData = message.fileData;

    const isImg = checkIsImage(fileName, fileType);
    const cleanContent = message.content
        ? message.content.replace(/\n*📎\s*(?:Attached file:\s*)?[^\n]+/gi, "").trim()
        : "";

    const copyMessage = async () => {
        try {
            await navigator.clipboard.writeText(
                message.content
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <div
            className={`
        flex
        gap-3
        animate-slide-in

        ${isUser
                    ? "justify-end"
                    : "justify-start"
                }
      `}
        >
            {/* AI avatar */}
            {!isUser && (
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
            shadow-lg
            shadow-violet-500/10
          "
                >
                    <Bot size={16} />
                </div>
            )}

            {/* Message content wrapper - stacks image, file, and text */}
            <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]">
                {/* Image attachment - no background */}
                {isUser && fileName && isImg && fileData && (
                    <img
                        src={
                            fileData.startsWith("data:")
                                ? fileData
                                : `data:${fileType || "image/png"};base64,${fileData}`
                        }
                        alt={fileName}
                        className="max-h-[320px] w-auto rounded-lg shadow-lg"
                    />
                )}

                {/* File attachment - no gradient, separate styling */}
                {isUser && fileName && !isImg && fileData && (
                    <div className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white backdrop-blur-md border border-white/15 shadow-md hover:bg-white/15 transition">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/20 text-white">
                            <FileText size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-white">{fileName}</p>
                            <p className="text-[11px] text-white/70 mt-0.5">
                                {fileType ? fileType.split("/")[1].toUpperCase() : "ATTACHMENT"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Message bubble - text only with gradient for user messages */}
                <div
                    className={`
          group

          ${isUser
                                ? `
                rounded-2xl
                rounded-br-md
                bg-gradient-to-br
                from-violet-600
                to-indigo-600
                px-4 py-2.5
                text-white
                shadow-lg
                shadow-violet-500/10
              `
                                : `
                min-w-0
              `
                            }
        `}
                >
                    <div
                        className={`
            whitespace-pre-wrap
            break-words
            text-sm
            leading-6

            ${!isUser
                                ? "text-zinc-700 dark:text-zinc-300"
                                : ""
                            }
          `}
                    >
                        {isUser ? (
                            <div>{cleanContent || "Please analyze the attached file"}</div>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    h1: ({ children, ...props }) => (
                                        <h1 className="mt-3 mb-1.5 text-lg font-bold text-zinc-900 dark:text-white" {...props}>{children}</h1>
                                    ),
                                h2: ({ children, ...props }) => (
                                    <h2 className="mt-3 mb-1.5 text-base font-bold text-zinc-900 dark:text-white" {...props}>{children}</h2>
                                ),
                                h3: ({ children, ...props }) => (
                                    <h3 className="mt-3 mb-1.5 text-sm font-bold text-zinc-900 dark:text-white" {...props}>{children}</h3>
                                ),
                                p: ({ children, ...props }) => <p className="mb-2 last:mb-0" {...props}>{children}</p>,
                                strong: ({ children, ...props }) => (
                                    <strong className="font-semibold text-zinc-900 dark:text-white" {...props}>{children}</strong>
                                ),
                                ul: ({ children, ...props }) => (
                                    <ul className="mb-2 ml-4 list-disc space-y-0.5" {...props}>{children}</ul>
                                ),
                                ol: ({ children, ...props }) => (
                                    <ol className="mb-2 ml-4 list-decimal space-y-0.5" {...props}>{children}</ol>
                                ),
                                li: ({ children, ...props }) => <li className="leading-6" {...props}>{children}</li>,
                                code: ({ children, ...props }) => (
                                    <code
                                        className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-violet-600 dark:bg-zinc-800 dark:text-violet-300"
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                ),
                                pre: ({ children, ...props }) => (
                                    <pre
                                        className="my-3 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-900 p-3 font-mono text-xs text-zinc-100 dark:border-zinc-800"
                                        {...props}
                                    >
                                        {children}
                                    </pre>
                                ),
                                hr: ({ ...props }) => (
                                    <hr className="my-4 border-zinc-200 dark:border-zinc-800" {...props} />
                                ),
                                blockquote: ({ children, ...props }) => (
                                    <blockquote className="my-3 border-l-2 border-violet-500 pl-3 italic text-zinc-600 dark:text-zinc-400" {...props}>{children}</blockquote>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        )}
                    </div>

                    {!isUser && (
                        <button
                            type="button"
                            onClick={copyMessage}
                            className="
              mt-2
              flex
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-1
              text-[10px]
              text-zinc-400
              opacity-0
              transition
              hover:bg-zinc-100
              hover:text-zinc-600
              group-hover:opacity-100

              dark:hover:bg-zinc-900
              dark:hover:text-zinc-300
            "
                        >
                            {copied ? (
                                <>
                                    <Check size={12} />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    Copy
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* User avatar */}
            {isUser && (
                <div
                    className="
            flex h-8 w-8
            shrink-0
            items-center justify-center
            rounded-xl
            bg-zinc-200
            text-zinc-600

            dark:bg-zinc-800
            dark:text-zinc-300
          "
                >
                    <UserRound size={16} />
                </div>
            )}
        </div>
    );
}