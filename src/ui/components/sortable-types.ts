/**
 * Shared type for passing dnd-kit sortable props from a wrapper
 * component into a display component.
 */

import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

export interface SortableProps {
  setNodeRef: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging: boolean;
}
