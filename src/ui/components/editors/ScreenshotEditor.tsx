/**
 * ScreenshotEditor Component
 *
 * Layer-based editor panel. Displays a sortable layer list with
 * drag-and-drop reordering, inline actions, and an "Add Layer" picker.
 */

import { useCallback, useState } from "react";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Screenshot } from "../../types.ts";
import type { Layer } from "../../../types/layers.ts";
import { createDefaultLayer, generateLayerId } from "./layer-meta.ts";
import { SortableLayerCard } from "./SortableLayerCard.tsx";
import { AddLayerMenu } from "./AddLayerMenu.tsx";
import { LayerDetail } from "./LayerDetail.tsx";

// ── Stable ID helper ────────────────────────────────────────────────

/**
 * Ensure every layer has an `id`. Layers loaded from older configs
 * may be missing one — assign on-the-fly so dnd-kit can track them.
 */
function ensureLayerIds(layers: Layer[]): Layer[] {
  let changed = false;
  const result = layers.map((l) => {
    if (l.id) return l;
    changed = true;
    return { ...l, id: generateLayerId() };
  });
  return changed ? result : layers;
}

// ── Main editor ─────────────────────────────────────────────────────

interface ScreenshotEditorProps {
  screenshot: Screenshot;
  onUpdate: (updates: Partial<Screenshot>) => void;
}

export function ScreenshotEditor({
  screenshot,
  onUpdate,
}: ScreenshotEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const layers = ensureLayerIds(screenshot.layers);
  const itemIds = layers.map((l) => l.id);

  const activeIndex = activeLayerId
    ? layers.findIndex((l) => l.id === activeLayerId)
    : -1;
  const activeLayer = activeIndex >= 0 ? layers[activeIndex] : null;

  const handleLayerUpdate = useCallback(
    (updates: Partial<Layer>) => {
      if (activeIndex < 0) return;
      const newLayers = [...layers];
      newLayers[activeIndex] = {
        ...newLayers[activeIndex],
        ...updates,
      } as Layer;
      onUpdate({ layers: newLayers });
    },
    [activeIndex, layers, onUpdate],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove([...layers], oldIndex, newIndex);
    onUpdate({ layers: reordered });
  };

  const handleAdd = (type: Layer["type"]) => {
    const newLayer = createDefaultLayer(type);
    onUpdate({ layers: [...layers, newLayer] });
  };

  const handleDuplicate = (index: number) => {
    const dupe = { ...layers[index], id: generateLayerId() };
    const newLayers = [...layers];
    newLayers.splice(index + 1, 0, dupe);
    onUpdate({ layers: newLayers });
  };

  const handleDelete = (index: number) => {
    onUpdate({ layers: layers.filter((_, i) => i !== index) });
  };

  const isDetail = activeLayer !== null;

  return (
    <div className="editor-sidebar bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden">
      <div className="relative flex-1 flex min-h-0">
        {/* Layer list panel */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-250 ease-out ${
            isDetail ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-zinc-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm text-zinc-200 tracking-wide uppercase">
                  Layers
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {layers.length} layer{layers.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                >
                  <i className="fa-solid fa-circle-info text-m" />
                </button>
                {showInfo && (
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setShowInfo(false)}
                  >
                    <div
                      className="absolute right-3 mt-1 w-72 bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-xl"
                      style={{ top: "3.5rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Arrow */}
                      <div
                        className="absolute -top-1.5 right-3 w-3 h-3 bg-zinc-800 border-l border-t border-zinc-700 rotate-45"
                      />
                      <p className="text-sm text-zinc-200 font-medium mb-2">
                        Layer Composition
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Layers are rendered bottom-to-top. Drag to reorder,
                        click to edit properties. Combine backgrounds, text,
                        phone frames, images, glows, and shapes to compose your
                        screenshot.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Layer list */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {layers.length === 0
              ? (
                <div className="text-center py-12 text-zinc-600">
                  <i className="fa-solid fa-layer-group text-3xl mb-3 block" />
                  <p className="text-sm">No layers yet</p>
                  <p className="text-xs mt-1">
                    Add a layer to start composing your screenshot
                  </p>
                </div>
              )
              : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={itemIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1.5">
                      {layers.map((layer, index) => (
                        <SortableLayerCard
                          key={layer.id}
                          id={layer.id}
                          layer={layer}
                          index={index}
                          onClick={() => setActiveLayerId(layer.id)}
                          onDuplicate={() => handleDuplicate(index)}
                          onDelete={() => handleDelete(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
          </div>

          {/* Add layer button */}
          <div className="relative px-3 pb-3 pt-2 border-t border-zinc-800/60">
            {showAddMenu && (
              <AddLayerMenu
                onAdd={handleAdd}
                onClose={() => setShowAddMenu(false)}
              />
            )}
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus text-xs" />
              Add Layer
            </button>
          </div>
        </div>

        {/* Layer detail panel */}
        <div
          className={`absolute inset-0 flex flex-col transition-transform duration-250 ease-out ${
            isDetail ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {activeLayer && (
            <LayerDetail
              layer={activeLayer}
              index={activeIndex}
              onBack={() => setActiveLayerId(null)}
              onUpdate={handleLayerUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
