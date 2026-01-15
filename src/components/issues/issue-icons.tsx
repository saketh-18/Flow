"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  Minus,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssuePriority, WorkflowStateType } from "@/types";

// Status icons by workflow state type
export const statusIcons: Record<
  WorkflowStateType,
  React.ComponentType<{ className?: string }>
> = {
  backlog: CircleDashed,
  unstarted: Circle,
  started: CircleDot,
  completed: CircleCheck,
  canceled: CircleX,
};

export const statusColors: Record<WorkflowStateType, string> = {
  backlog: "text-muted-foreground",
  unstarted: "text-muted-foreground",
  started: "text-yellow-500",
  completed: "text-green-500",
  canceled: "text-muted-foreground",
};

// Priority icons
export const priorityIcons: Record<
  IssuePriority,
  React.ComponentType<{ className?: string }>
> = {
  urgent: AlertCircle,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: Minus,
};

export const priorityColors: Record<IssuePriority, string> = {
  urgent: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  none: "text-muted-foreground",
};

export const priorityLabels: Record<IssuePriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "No priority",
};

interface StatusIconProps {
  type: WorkflowStateType;
  className?: string;
}

export function StatusIcon({ type, className }: StatusIconProps) {
  const Icon = statusIcons[type];
  return <Icon className={cn("h-4 w-4", statusColors[type], className)} />;
}

interface PriorityIconProps {
  priority: IssuePriority;
  className?: string;
}

export function PriorityIcon({ priority, className }: PriorityIconProps) {
  const Icon = priorityIcons[priority];
  return (
    <Icon className={cn("h-4 w-4", priorityColors[priority], className)} />
  );
}
