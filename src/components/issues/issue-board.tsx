"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueCard } from "./issue-card";
import { StatusIcon } from "./issue-icons";
import { useReorderIssues } from "@/hooks/use-issues";
import type {
  IssueWithRelations,
  WorkflowState,
  WorkflowStateType,
} from "@/types";

interface IssueBoardProps {
  issues: IssueWithRelations[];
  workflowStates: WorkflowState[];
  onCreateIssue?: (stateId: string) => void;
}

interface Column {
  id: string;
  title: string;
  type: WorkflowStateType;
  color?: string | null;
  issues: IssueWithRelations[];
}

function SortableIssueCard({ issue }: { issue: IssueWithRelations }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(isDragging && "opacity-50")}
    >
      <BoardCard issue={issue} />
    </div>
  );
}

function BoardCard({ issue }: { issue: IssueWithRelations }) {
  const issueKey = issue.team
    ? `${issue.team.key}-${issue.number}`
    : `ISSUE-${issue.number}`;

  return (
    <div className="p-3 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xs text-muted-foreground font-mono">
          {issueKey}
        </span>
      </div>
      <p className="text-sm font-medium line-clamp-2 mb-2">{issue.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {issue.labels?.slice(0, 2).map((label) => (
            <span
              key={label.id}
              className="h-1.5 w-6 rounded-full"
              style={{ backgroundColor: label.color }}
            />
          ))}
        </div>
        {issue.assignee && (
          <div
            className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium"
            title={issue.assignee.display_name || issue.assignee.email}
          >
            {(issue.assignee.display_name || issue.assignee.email || "?")
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

export function IssueBoard({
  issues,
  workflowStates,
  onCreateIssue,
}: IssueBoardProps) {
  const reorderIssues = useReorderIssues();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [columns, setColumns] = React.useState<Column[]>([]);

  // Initialize columns from workflow states
  React.useEffect(() => {
    const cols: Column[] = workflowStates.map((state) => ({
      id: state.id,
      title: state.name,
      type: state.type,
      color: state.color,
      issues: issues
        .filter((issue) => issue.state_id === state.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));
    setColumns(cols);
  }, [issues, workflowStates]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeIssue = React.useMemo(
    () => issues.find((i) => i.id === activeId),
    [activeId, issues]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    // Find which columns the issues belong to
    const activeColumn = columns.find((col) =>
      col.issues.some((i) => i.id === activeIssueId)
    );
    const overColumn =
      columns.find((col) => col.issues.some((i) => i.id === overId)) ||
      columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setColumns((prev) => {
      const activeIssue = activeColumn.issues.find(
        (i) => i.id === activeIssueId
      );
      if (!activeIssue) return prev;

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            issues: col.issues.filter((i) => i.id !== activeIssueId),
          };
        }
        if (col.id === overColumn.id) {
          const overIndex = col.issues.findIndex((i) => i.id === overId);
          const newIssues = [...col.issues];
          if (overIndex >= 0) {
            newIssues.splice(overIndex, 0, activeIssue);
          } else {
            newIssues.push(activeIssue);
          }
          return { ...col, issues: newIssues };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    // Find the column containing the active issue
    const column = columns.find((col) =>
      col.issues.some((i) => i.id === activeIssueId)
    );

    if (!column) return;

    const oldIndex = column.issues.findIndex((i) => i.id === activeIssueId);
    const newIndex = column.issues.findIndex((i) => i.id === overId);

    if (
      oldIndex !== newIndex ||
      column.id !== issues.find((i) => i.id === activeIssueId)?.state_id
    ) {
      const newIssues = arrayMove(
        column.issues,
        oldIndex,
        newIndex >= 0 ? newIndex : column.issues.length - 1
      );

      // Calculate new sort orders
      const updates = newIssues.map((issue, index) => ({
        id: issue.id,
        sort_order: index * 1000,
        state_id: column.id,
      }));

      reorderIssues.mutate(updates);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full p-4 overflow-x-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 flex flex-col bg-muted/30 rounded-lg"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <StatusIcon type={column.type} />
                <span className="text-sm font-medium">{column.title}</span>
                <span className="text-xs text-muted-foreground">
                  {column.issues.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onCreateIssue?.(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Content */}
            <ScrollArea className="flex-1 p-2">
              <SortableContext
                items={column.issues.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {column.issues.map((issue) => (
                    <SortableIssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </SortableContext>
              {column.issues.length === 0 && (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                  No issues
                </div>
              )}
            </ScrollArea>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeIssue && (
          <div className="rotate-3 scale-105">
            <BoardCard issue={activeIssue} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
