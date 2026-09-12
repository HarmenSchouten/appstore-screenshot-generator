import { formatForDisplay } from "@tanstack/react-hotkeys";
import { SHORTCUT_LIST } from "@hooks";
import { Modal, ModalBody } from "@ui/components/primitives/index.ts";

interface ShortcutCheatSheetModalProps {
  onClose: () => void;
}

export function ShortcutCheatSheetModal(
  { onClose }: ShortcutCheatSheetModalProps,
) {
  return (
    <Modal
      title="Keyboard Shortcuts"
      subtitle="All available shortcuts at a glance"
      size="sm"
      onClose={onClose}
    >
      <ModalBody>
        <div className="space-y-1.5">
          {SHORTCUT_LIST.map((shortcut) => (
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
      </ModalBody>
    </Modal>
  );
}
