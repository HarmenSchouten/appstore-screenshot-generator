/**
 * Drag-to-reorder for a vertical list, the one implementation (#69):
 * `SortableList` owns the dnd-kit context, sensors, axis lock and index
 * bookkeeping; `useSortableRow` gives a row its ref, transform and handle
 * props. `SortableRow` is the render-prop form for a row component that is
 * also rendered outside a list.
 */

import type { CSSProperties, ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface SortableProps {
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging: boolean;
}

const MODIFIERS = [restrictToVerticalAxis, restrictToParentElement];

interface SortableListProps {
  /** Row ids in display order; rows call `useSortableRow(id)`. */
  ids: string[];
  /** A completed drag moved the row at `from` to `to`. */
  onMove: (from: number, to: number) => void;
  children: ReactNode;
}

export function SortableList({ ids, onMove, children }: SortableListProps) {
  const sensors = useSensors(
    // A 4 px threshold keeps a plain click on a row from starting a drag
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) onMove(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={MODIFIERS}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function useSortableRow(id: string): SortableProps {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    transition: { duration: 200, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
  });

  return {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    style: {
      transform: transform
        ? `translate3d(${Math.round(transform.x)}px, ${
          Math.round(transform.y)
        }px, 0)`
        : undefined,
      transition,
      zIndex: isDragging ? 50 : undefined,
      position: "relative",
    },
  };
}

export function SortableRow(
  { id, children }: {
    id: string;
    children: (sortable: SortableProps) => ReactNode;
  },
) {
  const sortable = useSortableRow(id);
  return <>{children(sortable)}</>;
}
