/**
 * Sidebar Component
 *
 * Left sidebar focused on screenshot list management and device preset selection.
 * Navigation controls (project, language, platform) have moved to TopBar.
 * Screenshots support drag-and-drop reordering via dnd-kit.
 */

import {
  getDevicePresetsForPlatform,
  getDevicePresetSummary,
} from "@device-presets";
import type { DevicePresetId } from "../types.ts";
import { SortableScreenshotCard } from "./SortableScreenshotCard.tsx";
import { SidebarItemCard } from "./SidebarItemCard.tsx";
import { selectScreenshots, useAppStore } from "../store/index.ts";
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

export function Sidebar() {
  const selectedPlatform = useAppStore((s) => s.selectedPlatform);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const screenshots = useAppStore(selectScreenshots);

  const {
    setSelectedItem,
    addScreenshot,
    addFeatureGraphic,
    removeScreenshot,
    removeFeatureGraphic,
    reorderScreenshots,
    getDefaultDevicePreset,
    updateDefaultDevicePreset,
  } = useAppStore.getState();

  const platformPresets = getDevicePresetsForPlatform(selectedPlatform);
  const platformDefaultDevicePresetId = getDefaultDevicePreset();
  const screenshotItems = screenshots.filter((x) => x.role === "screenshot");
  const screenshotIds = screenshotItems.map((s) => s.id);

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
            {screenshotItems.length}{" "}
            {screenshotItems.length === 1 ? "item" : "items"}
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
            {screenshotItems.map((screenshot, index) => (
              <SortableScreenshotCard
                key={screenshot.id}
                id={screenshot.id}
                title={`Screenshot ${index + 1}`}
                isSelected={selectedItem?.type === "screenshot" &&
                  selectedItem.id === screenshot.id}
                onSelect={() =>
                  setSelectedItem({ type: "screenshot", id: screenshot.id })}
                onDelete={() => removeScreenshot(screenshot.id)}
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
        {selectedPlatform === "android" && (() => {
          const fg = screenshots.find((x) => x.role === "feature-graphic");
          return (
            <>
              <div className="text-xs text-zinc-500 uppercase tracking-wider mt-4 mb-1.5 font-medium">
                Feature Graphic
              </div>
              {fg
                ? (
                  <SidebarItemCard
                    title="Feature Graphic"
                    isSelected={selectedItem?.type === "screenshot" &&
                      selectedItem.id === fg.id}
                    onSelect={() =>
                      setSelectedItem({ type: "screenshot", id: fg.id })}
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
          );
        })()}
      </div>

      {/* Device Preset */}
      <div className="px-3 py-3 border-t border-zinc-800">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 font-medium">
          Device
        </div>
        <select
          value={platformDefaultDevicePresetId}
          onChange={(e) =>
            updateDefaultDevicePreset(
              selectedPlatform,
              (e.target as HTMLSelectElement).value as DevicePresetId,
            )}
          className="w-full px-2.5 py-1.5 rounded text-xs bg-zinc-800 border border-zinc-700"
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
