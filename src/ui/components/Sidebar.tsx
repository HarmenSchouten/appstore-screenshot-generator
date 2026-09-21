/**
 * Sidebar Component
 *
 * Left sidebar focused on screenshot list management and device preset selection.
 * Navigation controls (project, language, platform) have moved to TopBar.
 * Screenshots support drag-and-drop reordering via dnd-kit.
 */

import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { arrayMove } from "@dnd-kit/sortable";
import { getDevicePreset, getDevicePresetsForPlatform } from "@device-presets";
import type { DevicePresetId } from "@ui/types.ts";
import { SidebarItemCard } from "./SidebarItemCard.tsx";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import { useScreenshotActions, useSelection } from "@hooks";
import { SortableList, SortableRow } from "@ui/components/primitives/index.ts";
import { Select } from "@ui/components/inputs/index.ts";

function SidebarInner() {
  const selection = useSelection();
  const screenshots = useScreenshotActions();

  // Ids only, shallow-compared: the sidebar renders positional titles and
  // selection state, so editing a layer must not re-render it (#64).
  const screenshotIds = useAppStore(
    useShallow((s) =>
      selectScreenshots(s, selection.lang, selection.platform)
        .filter((x) => x.role === "screenshot")
        .map((x) => x.id)
    ),
  );
  const featureGraphicId = useAppStore((s) =>
    selectScreenshots(s, selection.lang, selection.platform)
      .find((x) => x.role === "feature-graphic")?.id ?? null
  );

  // A subscription, not getState(): this reads config, and the sidebar no
  // longer re-renders on every config change to pick the new value up.
  const platformDefaultDevicePresetId = useAppStore((s) =>
    s.getDefaultDevicePreset(selection.platform)
  );

  const updateDefaultDevicePreset = useAppStore((s) =>
    s.updateDefaultDevicePreset
  );

  const platformPresets = getDevicePresetsForPlatform(selection.platform);

  return (
    <aside className="w-[268px] bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Screenshots
          </span>
          <span className="text-[11px] text-zinc-600 tabular-nums">
            {screenshotIds.length}{" "}
            {screenshotIds.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Scrollable screenshot list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
        <SortableList
          ids={screenshotIds}
          onMove={(from, to) =>
            screenshots.reorder(arrayMove(screenshotIds, from, to))}
        >
          {screenshotIds.map((id, index) => (
            <SortableRow key={id} id={id}>
              {(sortable) => (
                <SidebarItemCard
                  title={`Screenshot ${index + 1}`}
                  isSelected={selection.screenshotId === id}
                  onSelect={() => screenshots.select(id)}
                  onDelete={() => screenshots.remove(id)}
                  sortable={sortable}
                />
              )}
            </SortableRow>
          ))}
        </SortableList>

        <button
          type="button"
          onClick={screenshots.add}
          className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 transition-colors"
        >
          <i className="fa-solid fa-plus mr-1" /> Add Screenshot
        </button>

        {/* Feature Graphic (Android only) */}
        {selection.platform === "android" && (
          <>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-1.5 font-medium">
              Feature Graphic
            </div>
            {featureGraphicId
              ? (
                <SidebarItemCard
                  title="Feature Graphic"
                  isSelected={selection.screenshotId === featureGraphicId}
                  onSelect={() => screenshots.select(featureGraphicId)}
                  onDelete={screenshots.removeFeatureGraphic}
                />
              )
              : (
                <button
                  type="button"
                  onClick={screenshots.addFeatureGraphic}
                  className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 transition-colors"
                >
                  <i className="fa-solid fa-plus mr-1" /> Add Feature Graphic
                </button>
              )}
          </>
        )}
      </div>

      {/* Device Preset */}
      <div className="px-3 py-3 border-t border-zinc-800">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 font-medium">
          Default device
        </div>
        <Select<DevicePresetId>
          value={platformDefaultDevicePresetId}
          onChange={(id) => updateDefaultDevicePreset(selection.platform, id)}
          options={platformPresets.map((p) => ({
            value: p.id,
            label: p.label,
          }))}
          className="px-2.5 py-1.5 text-xs rounded"
        />
        <div className="mt-1.5 text-[10px] text-zinc-600">
          {getDevicePreset(platformDefaultDevicePresetId).summary}
        </div>
      </div>
    </aside>
  );
}

/**
 * Memoised: the sidebar takes no props, so it re-renders only when one of
 * its own subscriptions changes — not whenever App does.
 */
export const Sidebar = memo(SidebarInner);
