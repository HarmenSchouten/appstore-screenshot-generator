/**
 * SortableLayerCard — wraps LayerCard with dnd-kit sortable.
 *
 * Follows the same wrapper pattern as SortableScreenshotCard.
 */

import { useSortable } from "@dnd-kit/sortable";
import type { Layer } from "@app-types";
import { LayerCard } from "./LayerCard.tsx";

export function SortableLayerCard({
  id,
  layer,
  allLayers,
  onClick,
  onDuplicate,
  onDelete,
}: {
  id: string;
  layer: Layer;
  allLayers: Layer[];
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${
        Math.round(transform.y)
      }px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative" as const,
  };

  return (
    <LayerCard
      layer={layer}
      allLayers={allLayers}
      onClick={onClick}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      sortableProps={{
        setNodeRef,
        style,
        attributes,
        listeners,
        isDragging,
      }}
    />
  );
}
