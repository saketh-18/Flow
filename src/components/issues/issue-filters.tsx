"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  X,
  Circle,
  CircleDot,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Minus,
  User,
  Tag,
  Folder,
  RotateCcw,
} from "lucide-react";
import type {
  WorkflowState,
  IssuePriority,
  User as UserType,
  Project,
} from "@/types";

interface IssueFiltersProps {
  workflowStates: WorkflowState[];
  users: UserType[];
  labels: { id: string; name: string; color: string }[];
  projects: Project[];
  onFiltersChange: (filters: IssueFilterState) => void;
  filters: IssueFilterState;
}

export interface IssueFilterState {
  statuses: string[];
  priorities: IssuePriority[];
  assignees: string[];
  labels: string[];
  projects: string[];
}

const priorityOptions: {
  value: IssuePriority;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "urgent", label: "Urgent", icon: AlertCircle },
  { value: "high", label: "High", icon: ArrowUp },
  { value: "medium", label: "Medium", icon: ArrowRight },
  { value: "low", label: "Low", icon: ArrowDown },
  { value: "none", label: "No priority", icon: Minus },
];

const getStatusIcon = (type: string) => {
  switch (type) {
    case "backlog":
      return Circle;
    case "unstarted":
      return CircleDot;
    case "started":
      return CircleDot;
    case "completed":
      return CheckCircle2;
    case "cancelled":
      return XCircle;
    default:
      return Circle;
  }
};

export function IssueFilters({
  workflowStates,
  users,
  labels,
  projects,
  onFiltersChange,
  filters,
}: IssueFiltersProps) {
  const activeFilterCount =
    filters.statuses.length +
    filters.priorities.length +
    filters.assignees.length +
    filters.labels.length +
    filters.projects.length;

  const toggleStatus = (statusId: string) => {
    const newStatuses = filters.statuses.includes(statusId)
      ? filters.statuses.filter((s) => s !== statusId)
      : [...filters.statuses, statusId];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const togglePriority = (priority: IssuePriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority];
    onFiltersChange({ ...filters, priorities: newPriorities });
  };

  const toggleAssignee = (userId: string) => {
    const newAssignees = filters.assignees.includes(userId)
      ? filters.assignees.filter((a) => a !== userId)
      : [...filters.assignees, userId];
    onFiltersChange({ ...filters, assignees: newAssignees });
  };

  const toggleLabel = (labelId: string) => {
    const newLabels = filters.labels.includes(labelId)
      ? filters.labels.filter((l) => l !== labelId)
      : [...filters.labels, labelId];
    onFiltersChange({ ...filters, labels: newLabels });
  };

  const toggleProject = (projectId: string) => {
    const newProjects = filters.projects.includes(projectId)
      ? filters.projects.filter((p) => p !== projectId)
      : [...filters.projects, projectId];
    onFiltersChange({ ...filters, projects: newProjects });
  };

  const clearFilters = () => {
    onFiltersChange({
      statuses: [],
      priorities: [],
      assignees: [],
      labels: [],
      projects: [],
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1",
              filters.statuses.length > 0 && "bg-primary/10 border-primary/50"
            )}
          >
            <Circle className="h-3.5 w-3.5" />
            Status
            {filters.statuses.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filters.statuses.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {workflowStates.map((state) => {
            const Icon = getStatusIcon(state.type);
            return (
              <DropdownMenuCheckboxItem
                key={state.id}
                checked={filters.statuses.includes(state.id)}
                onCheckedChange={() => toggleStatus(state.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className="h-3.5 w-3.5"
                    style={{ color: state.color || undefined }}
                  />
                  {state.name}
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Priority Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1",
              filters.priorities.length > 0 && "bg-primary/10 border-primary/50"
            )}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Priority
            {filters.priorities.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filters.priorities.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {priorityOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={filters.priorities.includes(option.value)}
              onCheckedChange={() => togglePriority(option.value)}
            >
              <div className="flex items-center gap-2">
                <option.icon className="h-3.5 w-3.5" />
                {option.label}
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Assignee Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1",
              filters.assignees.length > 0 && "bg-primary/10 border-primary/50"
            )}
          >
            <User className="h-3.5 w-3.5" />
            Assignee
            {filters.assignees.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {filters.assignees.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by assignee</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.assignees.includes("unassigned")}
            onCheckedChange={() => toggleAssignee("unassigned")}
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">
                ?
              </div>
              Unassigned
            </div>
          </DropdownMenuCheckboxItem>
          {users.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.id}
              checked={filters.assignees.includes(user.id)}
              onCheckedChange={() => toggleAssignee(user.id)}
            >
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium">
                  {(user.display_name || user.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                {user.display_name || user.email}
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Label Filter */}
      {labels.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1",
                filters.labels.length > 0 && "bg-primary/10 border-primary/50"
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              Label
              {filters.labels.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.labels.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by label</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {labels.map((label) => (
              <DropdownMenuCheckboxItem
                key={label.id}
                checked={filters.labels.includes(label.id)}
                onCheckedChange={() => toggleLabel(label.id)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Project Filter */}
      {projects.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1",
                filters.projects.length > 0 && "bg-primary/10 border-primary/50"
              )}
            >
              <Folder className="h-3.5 w-3.5" />
              Project
              {filters.projects.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {filters.projects.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuCheckboxItem
                key={project.id}
                checked={filters.projects.includes(project.id)}
                onCheckedChange={() => toggleProject(project.id)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: project.color || "#6366f1" }}
                  />
                  {project.name}
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          onClick={clearFilters}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
