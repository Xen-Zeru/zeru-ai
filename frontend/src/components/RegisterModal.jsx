import {
    Eye,
    EyeOff,
    LoaderCircle,
    UserPlus,
    X,
} from "lucide-react";

import { useState } from "react";

export default function RegisterModal({
    open,
    onClose,
    onRegister,
    onLogin,
}) {
    const [name, setName] = useState("");
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] =
        useState(false);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Please complete all fields."
            );

            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        try {
            setLoading(true);

            await onRegister(
                name,
                email,
                password
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            onClose();
        } catch (error) {
            setError(
                error.message ||
                "Unable to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
            onMouseDown={onClose}
        >
            <div
                className="
          w-full max-w-md
          rounded-3xl
          border
          border-zinc-200
          bg-white
          p-6
          shadow-2xl

          dark:border-zinc-800
          dark:bg-zinc-950

          sm:p-8
        "
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="flex items-center justify-between">
                    <div
                        className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-violet-100
              text-violet-600

              dark:bg-violet-500/10
              dark:text-violet-300
            "
                    >
                        <UserPlus size={20} />
                    </div>

                    <button
                        onClick={onClose}
                        className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-zinc-400
              hover:bg-zinc-100

              dark:hover:bg-zinc-900
            "
                    >
                        <X size={18} />
                    </button>
                </div>

                <h2
                    className="
            mt-6
            text-2xl
            font-bold
            text-zinc-900

            dark:text-white
          "
                >
                    Create your account
                </h2>

                <p
                    className="
            mt-2
            text-sm
            leading-6
            text-zinc-500
          "
                >
                    Create an account to save your chats
                    and continue using Zeru AI.
                </p>

                {error && (
                    <div
                        className="
              mt-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3 py-2.5
              text-xs
              text-red-600

              dark:border-red-500/20
              dark:bg-red-500/5
              dark:text-red-400
            "
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Your name"
                            className="
                h-11
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                px-3
                text-sm
                outline-none
                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-500/10

                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-white
              "
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            className="
                h-11
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                px-3
                text-sm
                outline-none
                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-500/10

                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-white
              "
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="At least 6 characters"
                                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  px-3
                  pr-11
                  text-sm
                  outline-none
                  focus:border-violet-400
                  focus:ring-4
                  focus:ring-violet-500/10

                  dark:border-zinc-800
                  dark:bg-zinc-900
                  dark:text-white
                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  p-2
                  text-zinc-400
                "
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Confirm password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Repeat your password"
                            className="
                h-11
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                px-3
                text-sm
                outline-none
                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-500/10

                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-white
              "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-violet-500/20
              transition
              hover:from-violet-500
              hover:to-indigo-500
              disabled:opacity-60
            "
                    >
                        {loading && (
                            <LoaderCircle
                                size={16}
                                className="animate-spin"
                            />
                        )}

                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    Already have an account?{" "}
                    <button
                        onClick={onLogin}
                        className="
              font-semibold
              text-violet-600
              dark:text-violet-400
            "
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}