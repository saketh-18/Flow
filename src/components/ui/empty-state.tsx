"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileStack,
  FolderKanban,
  Layers,
  ListTodo,
  Settings,
  Tags,
  Users,
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-lg bg-muted/50 p-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states for common scenarios
export function EmptyIssues({ onCreateIssue }: { onCreateIssue?: () => void }) {
  return (
    <EmptyState
      icon={<ListTodo className="h-10 w-10" />}
      title="No issues yet"
      description="Issues help you track work, bugs, and features. Create your first issue to get started organizing your team's work."
      actionLabel="Create issue"
      onAction={onCreateIssue}
    />
  );
}

export function EmptyProjects({
  onCreateProject,
}: {
  onCreateProject?: () => void;
}) {
  return (
    <EmptyState
      icon={<FolderKanban className="h-10 w-10" />}
      title="Projects"
      description="Projects help you organize related issues together. Use them to track features, releases, or any collection of work."
      actionLabel="Create project"
      onAction={onCreateProject}
    />
  );
}

export function EmptyTeams({ onCreateTeam }: { onCreateTeam?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-10 w-10" />}
      title="No teams"
      description="Teams are where your work lives. Create a team to start organizing issues and collaborating with your colleagues."
      actionLabel="Create team"
      onAction={onCreateTeam}
    />
  );
}

export function EmptyLabels({ onCreateLabel }: { onCreateLabel?: () => void }) {
  return (
    <EmptyState
      icon={<Tags className="h-10 w-10" />}
      title="Labels"
      description="Labels help categorize and filter issues. Create labels for bug types, areas of the product, or any custom categories you need."
      actionLabel="Create label"
      onAction={onCreateLabel}
    />
  );
}

export function EmptyBacklog() {
  return (
    <EmptyState
      icon={<Layers className="h-10 w-10" />}
      title="Backlog is empty"
      description="Nice work! Your backlog is clear. New issues that aren't scheduled yet will appear here."
    />
  );
}

export function EmptySearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<FileStack className="h-10 w-10" />}
      title="No results found"
      description={
        query
          ? `No issues match "${query}". Try adjusting your search or filters.`
          : "Try adjusting your filters or search terms."
      }
    />
  );
}
