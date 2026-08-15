import {
    ArrowUp,
    LoaderCircle,
    Paperclip,
    X,
    FileText,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

export default function ChatInput({
    onSend,
    loading,
    remainingFreeMessages,
}) {
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        textarea.style.height =
            `${Math.min(textarea.scrollHeight, 140)}px`;
    }, [input]);

    const handleSubmit = async (e) => {
        e?.preventDefault();

        const message = input.trim() || (file ? `Please analyze the attached file: ${file.name}` : "");

        if (!message || loading) return;

        setInput("");

        await onSend(message, file);

        setFile(null);
        setFilePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            handleSubmit();
        }
    };

    const handleFile = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        // Create preview for images
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFilePreview(event.target?.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    return (
        <div
            className="
        shrink-0
        border-t
        border-zinc-200
        bg-white
        px-3
        pb-4
        pt-4

        dark:border-zinc-800
        dark:bg-[#09090b]

        sm:px-6
        sm:pb-6
        sm:pt-6
      "
        >
            <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-3xl"
            >
                {/* File preview - ChatGPT style */}
                {file && (
                    <div className="mb-3">
                        {/* Image preview - Compact thumbnail */}
                        {filePreview ? (
                            <div
                                className="
                relative
                inline-block
                rounded-lg
                border
                border-zinc-200
                overflow-hidden
                shadow-sm
                transition-all
                hover:shadow-md
                group

                dark:border-zinc-700
              "
                            >
                                <img
                                    src={filePreview}
                                    alt={file.name}
                                    className="h-24 w-24 object-cover"
                                />
                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setFilePreview(null);

                                        if (fileInputRef.current) {
                                            fileInputRef.current.value =
                                                "";
                                        }
                                    }}
                                    className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-zinc-400
                  shadow
                  transition
                  hover:bg-red-50
                  hover:text-red-500
                  opacity-0
                  group-hover:opacity-100

                  dark:border
                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:hover:bg-red-500/10
                  dark:hover:text-red-400
                "
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            /* File card for non-image files */
                            <div
                                className="
                group
                relative
                inline-flex
                rounded-lg
                border
                border-zinc-200
                bg-white
                p-3
                shadow-sm
                transition-all
                hover:border-zinc-300
                hover:shadow-md

                dark:border-zinc-700
                dark:bg-zinc-800
                dark:hover:border-zinc-600
              "
                            >
                                {/* File icon */}
                                <div
                                    className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  bg-gradient-to-br
                  from-violet-500/10
                  to-indigo-500/10
                  dark:from-violet-500/20
                  dark:to-indigo-500/20
                "
                                >
                                    <FileText
                                        size={24}
                                        className="text-violet-500"
                                    />
                                </div>

                                {/* File info */}
                                <div className="ml-3 flex flex-col justify-center">
                                    <p
                                        className="
                    max-w-[150px]
                    truncate
                    text-xs
                    font-semibold
                    text-zinc-800
                    dark:text-zinc-200
                  "
                                        title={file.name}
                                    >
                                        {file.name}
                                    </p>

                                    <p
                                        className="
                        mt-0.5
                        text-[10px]
                        text-zinc-500
                        dark:text-zinc-400
                      "
                                    >
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setFilePreview(null);

                                        if (fileInputRef.current) {
                                            fileInputRef.current.value =
                                                "";
                                        }
                                    }}
                                    className="
                      absolute
                      -right-2
                      -top-2
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-zinc-400
                      shadow
                      transition
                      hover:bg-red-50
                      hover:text-red-500

                      dark:border
                      dark:border-zinc-700
                      dark:bg-zinc-900
                      dark:hover:bg-red-500/10
                      dark:hover:text-red-400
                    "
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div
                    className="
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-3
            shadow-sm
            transition

            focus-within:border-violet-400
            focus-within:ring-4
            focus-within:ring-violet-500/10
            focus-within:shadow-md

            dark:border-zinc-700
            dark:bg-zinc-800
            dark:focus-within:border-violet-500/40
            dark:focus-within:ring-violet-500/20
          "
                >
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        rows={1}
                        placeholder="Message Zeru AI..."
                        className="
              block
              max-h-[140px]
              min-h-[28px]
              w-full
              resize-none
              overflow-y-auto
              bg-transparent
              px-0
              py-0
              text-sm
              leading-6
              text-zinc-800
              outline-none
              placeholder:text-zinc-400

              dark:text-zinc-200
              dark:placeholder:text-zinc-500
            "
                    />

                    <div
                        className="
              mt-2
              flex
              items-center
              justify-between
              gap-2
            "
                    >
                        <div className="flex items-center gap-1">

                            {/* File upload */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFile}
                                accept="image/*,.pdf,.txt,.doc,.docx"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                disabled={loading}
                                title="Attach file"
                                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg
                  text-zinc-500
                  transition
                  hover:bg-zinc-100
                  hover:text-zinc-700

                  dark:text-zinc-400
                  dark:hover:bg-zinc-700
                  dark:hover:text-zinc-200
                "
                            >
                                <Paperclip size={16} />
                            </button>

                            {remainingFreeMessages !==
                                null &&
                                remainingFreeMessages !==
                                undefined && (
                                    <span
                                        className="
                      hidden
                      text-[10px]
                      text-zinc-400

                      sm:block
                    "
                                    >
                                        {remainingFreeMessages} free{" "}
                                        message
                                        {remainingFreeMessages !==
                                            1
                                            ? "s"
                                            : ""}{" "}
                                        remaining
                                    </span>
                                )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                (!input.trim() && !file) || loading
                            }
                            className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                bg-zinc-100
                text-zinc-500
                transition

                enabled:bg-gradient-to-br
                enabled:from-violet-500
                enabled:to-indigo-600
                enabled:text-white
                enabled:shadow-md
                enabled:hover:from-violet-600
                enabled:hover:to-indigo-700

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:bg-zinc-700
                dark:text-zinc-400
                dark:enabled:shadow-lg
                dark:enabled:shadow-violet-500/20
              "
                        >
                            {loading ? (
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <ArrowUp size={17} />
                            )}
                        </button>
                    </div>
                </div>

                <div
                    className="
            mt-2
            hidden
            justify-center
            text-[9px]
            text-zinc-400
            sm:flex
          "
                >
                    <span>
                        Enter to send · Shift + Enter for
                        new line
                    </span>
                </div>
            </form>
        </div>
    );
}