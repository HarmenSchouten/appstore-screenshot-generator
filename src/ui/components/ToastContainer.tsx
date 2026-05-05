import { useAppStore } from "../store/index.ts";
import type { ToastItem } from "../store/types.ts";

const ICON: Record<ToastItem["type"], string> = {
  error: "fa-solid fa-circle-exclamation text-red-400",
  success: "fa-solid fa-circle-check text-green-400",
  info: "fa-solid fa-circle-info text-indigo-400",
};

const BORDER: Record<ToastItem["type"], string> = {
  error: "border-l-red-500",
  success: "border-l-green-500",
  info: "border-l-indigo-500",
};

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-[360px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-zinc-800 border border-zinc-700 border-l-4 ${
            BORDER[toast.type]
          } rounded-lg p-3 shadow-xl animate-slideIn flex items-start gap-2.5`}
        >
          <i className={`${ICON[toast.type]} mt-0.5 text-sm`} />
          <span className="text-sm text-zinc-200 flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-zinc-500 hover:text-zinc-300 text-xs ml-2 mt-0.5"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
