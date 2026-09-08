/**
 * Sidebar Component
 *
 * Left sidebar focused on screenshot list management and device preset selection.
 * Navigation controls (project, language, platform) have moved to TopBar.
 * Screenshots support drag-and-drop reordering via dnd-kit.
 */

import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  getDevicePresetsForPlatform,
  getDevicePresetSummary,
} from "@device-presets";
import type { DevicePresetId } from "@ui/types.ts";
import { SortableScreenshotCard } from "./SortableScreenshotCard.tsx";
import { SidebarItemCard } from "./SidebarItemCard.tsx";
import { selectScreenshots, useAppStore } from "@ui/store/index.ts";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function SidebarInner() {
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const selectedScreenshotId = useAppStore((s) => s.selectedScreenshotId);

  // Ids only, shallow-compared: the sidebar renders positional titles and
  // selection state, so editing a layer must not re-render it (#64).
  const screenshotIds = useAppStore(
    useShallow((s) =>
      selectScreenshots(s)
        .filter((x) => x.role === "screenshot")
        .map((x) => x.id)
    ),
  );
  const featureGraphicId = useAppStore((s) =>
    selectScreenshots(s).find((x) => x.role === "feature-graphic")?.id ?? null
  );

  // A subscription, not getState(): this reads config, and the sidebar no
  // longer re-renders on every config change to pick the new value up.
  const platformDefaultDevicePresetId = useAppStore((s) =>
    s.getDefaultDevicePreset()
  );

  const {
    setSelectedScreenshotId,
    addScreenshot,
    addFeatureGraphic,
    removeScreenshot,
    removeFeatureGraphic,
    reorderScreenshots,
    updateDefaultDevicePreset,
  } = useAppStore.getState();

  const platformPresets = getDevicePresetsForPlatform(selectedPlatform);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = screenshotIds.indexOf(active.id as string);
    const newIndex = screenshotIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(screenshotIds, oldIndex, newIndex);
    reorderScreenshots(reordered);
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={screenshotIds}
            strategy={verticalListSortingStrategy}
          >
            {screenshotIds.map((id, index) => (
              <SortableScreenshotCard
                key={id}
                id={id}
                title={`Screenshot ${index + 1}`}
                isSelected={selectedScreenshotId === id}
                onSelect={() => setSelectedScreenshotId(id)}
                onDelete={() => removeScreenshot(id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={addScreenshot}
          className="w-full py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 border border-dashed border-zinc-600 transition-colors"
        >
          <i className="fa-solid fa-plus mr-1" /> Add Screenshot
        </button>

        {/* Feature Graphic (Android only) */}
        {selectedPlatform === "android" && (
          <>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-1.5 font-medium">
              Feature Graphic
            </div>
            {featureGraphicId
              ? (
                <SidebarItemCard
                  title="Feature Graphic"
                  isSelected={selectedScreenshotId === featureGraphicId}
                  onSelect={() => setSelectedScreenshotId(featureGraphicId)}
                  onDelete={removeFeatureGraphic}
                />
              )
              : (
                <button
                  type="button"
                  onClick={addFeatureGraphic}
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
        <select
          value={platformDefaultDevicePresetId}
          onChange={(e) =>
            updateDefaultDevicePreset(
              selectedPlatform,
              (e.target as HTMLSelectElement).value as DevicePresetId,
            )}
          className="w-full px-2.5 py-1.5 rounded text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-indigo-500"
        >
          {platformPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
        <div className="mt-1.5 text-[10px] text-zinc-600">
          {getDevicePresetSummary(platformDefaultDevicePresetId)}
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
