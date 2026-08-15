import {
    X,
    LogOut,
    LoaderCircle,
} from "lucide-react";
import { useState } from "react";

export default function LogoutModal({
    open,
    onClose,
    onConfirm,
}) {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
            onClose();
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
        animate-fade-in
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
              bg-red-100
              text-red-600

              dark:bg-red-500/10
              dark:text-red-400
            "
                    >
                        <LogOut size={20} />
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
                    Logout?
                </h2>

                <p
                    className="
            mt-2
            text-sm
            leading-6
            text-zinc-500
          "
                >
                    Are you sure you want to logout? You'll need to login again to access your saved conversations.
                </p>

                <div className="mt-8 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
              flex
              flex-1
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-zinc-200
              bg-white
              text-sm
              font-semibold
              text-zinc-700
              transition
              hover:bg-zinc-50
              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:border-zinc-800
              dark:bg-zinc-900
              dark:text-zinc-300
              dark:hover:bg-zinc-800
            "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="
              flex
              flex-1
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-red-500/20
              transition
              hover:bg-red-500
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
                    >
                        {loading && (
                            <LoaderCircle
                                size={16}
                                className="animate-spin"
                            />
                        )}

                        {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
}
