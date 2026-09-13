/**
 * PlatformToggle — Android / iOS segmented control, with the button that
 * copies the current platform's screenshots to the other one.
 */

import type { Platform } from "@app-types";
import { useAppStore } from "@ui/store/index.ts";
import { useCopyPlatformConfig } from "@hooks";
import { SegmentedControl } from "@ui/components/inputs/index.ts";
import { ConfirmBar, useConfirm } from "@ui/components/primitives/index.ts";
import { PLATFORM_META } from "@ui/utils/platform-meta.ts";
import { PLATFORMS } from "@lib";

const PLATFORM_OPTIONS = PLATFORMS.map((value) => ({
  value,
  ...PLATFORM_META[value],
}));

export function PlatformToggle() {
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const setSelectedPlatform = useAppStore((s) => s.setSelectedPlatform);
  const copyPlatform = useCopyPlatformConfig();
  const confirmCopy = useConfirm();

  const other: Platform = selectedPlatform === "android" ? "ios" : "android";

  return (
    <div className="flex items-center gap-1.5">
      <SegmentedControl<Platform>
        options={PLATFORM_OPTIONS}
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        tone="accent"
        size="sm"
      />
      {confirmCopy.armed
        ? (
          <ConfirmBar
            className="h-8 rounded"
            tone="warning"
            message={`Copy to ${PLATFORM_META[other].label}?`}
            confirmLabel="Copy"
            onConfirm={() => {
              copyPlatform.mutate({
                sourcePlatform: selectedPlatform,
                targetPlatform: other,
              });
              confirmCopy.disarm();
            }}
            onCancel={confirmCopy.disarm}
          />
        )
        : (
          <button
            type="button"
            onClick={() => confirmCopy.arm()}
            className="h-8 w-8 flex items-center justify-center text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
            title={`Copy ${selectedPlatform} screenshots to ${
              PLATFORM_META[other].label
            }`}
          >
            <i className="fa-solid fa-arrow-right-arrow-left" />
          </button>
        )}
    </div>
  );
}
