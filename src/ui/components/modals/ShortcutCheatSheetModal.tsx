import { APP_SHORTCUTS } from "@hooks";
import { formatForDisplay } from "@tanstack/react-hotkeys";

interface ShortcutCheatSheetModalProps {
  onClose: () => void;
}

export function ShortcutCheatSheetModal(
  { onClose }: ShortcutCheatSheetModalProps,
) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg w-[420px] max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <div>
            <h2 className="font-bold text-lg">Keyboard Shortcuts</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              All available shortcuts at a glance
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl p-1"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <div className="space-y-1.5">
            {APP_SHORTCUTS.map((shortcut) => (
              <div
                key={shortcut.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/30"
              >
                <i
                  className={`${shortcut.icon} text-zinc-500 text-sm w-4 text-center`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-zinc-300">
                    {shortcut.label}
                  </span>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {shortcut.description}
                  </p>
                </div>
                <kbd className="bg-zinc-700 rounded px-1.5 py-0.5 text-[11px] font-mono text-zinc-300 shrink-0">
                  {formatForDisplay(shortcut.keys)}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
