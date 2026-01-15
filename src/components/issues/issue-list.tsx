"use client";

import * as React from "react";
import { IssueCard } from "./issue-card";
import { useUIStore } from "@/lib/store";
import { useDeleteIssue } from "@/hooks/use-issues";
import { EmptyIssues } from "@/components/ui/empty-state";
import type { IssueWithRelations, WorkflowStateType } from "@/types";
import { cn } from "@/lib/utils";

interface IssueListProps {
  issues: IssueWithRelations[];
  groupBy?: "status" | "priority" | "assignee" | "project" | "none";
  isLoading?: boolean;
}

interface GroupedIssues {
  [key: string]: {
    label: string;
    issues: IssueWithRelations[];
    color?: string;
  };
}

const statusOrder: WorkflowStateType[] = [
  "backlog",
  "unstarted",
  "started",
  "completed",
  "canceled",
];

const priorityOrder = ["urgent", "high", "medium", "low", "none"];

export function IssueList({
  issues,
  groupBy = "status",
  isLoading = false,
}: IssueListProps) {
  const { selection, selectIssue, setFocusedIssue, openCreateIssue } =
    useUIStore();
  const deleteIssue = useDeleteIssue();

  const groupedIssues = React.useMemo(() => {
    if (groupBy === "none") {
      return {
        all: { label: "All Issues", issues },
      };
    }

    const groups: GroupedIssues = {};

    for (const issue of issues) {
      let groupKey: string;
      let groupLabel: string;
      let groupColor: string | undefined;

      switch (groupBy) {
        case "status":
          groupKey = issue.state?.type || "unstarted";
          groupLabel = issue.state?.name || "No Status";
          groupColor = issue.state?.color || undefined;
          break;
        case "priority":
          groupKey = issue.priority;
          groupLabel =
            issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);
          break;
        case "assignee":
          groupKey = issue.assignee_id || "unassigned";
          groupLabel = issue.assignee?.display_name || "Unassigned";
          break;
        case "project":
          groupKey = issue.project_id || "no-project";
          groupLabel = issue.project?.name || "No Project";
          groupColor = issue.project?.color || undefined;
          break;
        default:
          groupKey = "all";
          groupLabel = "All Issues";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { label: groupLabel, issues: [], color: groupColor };
      }
      groups[groupKey].issues.push(issue);
    }

    // Sort groups
    if (groupBy === "status") {
      const sorted: GroupedIssues = {};
      for (const status of statusOrder) {
        if (groups[status]) {
          sorted[status] = groups[status];
        }
      }
      return sorted;
    }

    if (groupBy === "priority") {
      const sorted: GroupedIssues = {};
      for (const priority of priorityOrder) {
        if (groups[priority]) {
          sorted[priority] = groups[priority];
        }
      }
      return sorted;
    }

    return groups;
  }, [issues, groupBy]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return <EmptyIssues onCreateIssue={openCreateIssue} />;
  }

  return (
    <div className="flex flex-col">
      {Object.entries(groupedIssues).map(([key, group]) => (
        <div key={key}>
          {groupBy !== "none" && (
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur border-b">
              {group.color && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
              )}
              <span className="text-sm font-medium">{group.label}</span>
              <span className="text-xs text-muted-foreground">
                {group.issues.length}
              </span>
            </div>
          )}
          {group.issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isSelected={selection.selectedIssueIds.includes(issue.id)}
              isFocused={selection.focusedIssueId === issue.id}
              onClick={() => selectIssue(issue.id)}
              onDelete={() => deleteIssue.mutate(issue.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
