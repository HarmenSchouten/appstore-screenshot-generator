/**
 * SortableScreenshotCard — wraps SidebarItemCard with dnd-kit sortable.
 *
 * Follows the same pattern as SortableLayerCard in the layer editor.
 */

import { useSortable } from "@dnd-kit/sortable";
import { SidebarItemCard } from "./SidebarItemCard.tsx";

export function SortableScreenshotCard({
  id,
  title,
  isSelected,
  onSelect,
  onDelete,
}: {
  id: string;
  title: string;
  isSelected: boolean;
  onSelect: () => void;
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
    <SidebarItemCard
      title={title}
      isSelected={isSelected}
      onSelect={onSelect}
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
