"use client";

import * as React from "react";
import {
  X,
  Calendar,
  User,
  Tag,
  FolderKanban,
  Timer,
  Link2,
} from "lucide-react";
import { cn, formatDateFull } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { StatusIcon, PriorityIcon, priorityLabels } from "./issue-icons";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { useIssue, useUpdateIssue } from "@/hooks/use-issues";
import type { IssuePriority, WorkflowStateType } from "@/types";

export function IssueDetailPanel() {
  const { isIssuePanelOpen, selectedIssueId, closeIssuePanel } = useUIStore();
  const { teamMembers } = useWorkspaceStore();
  const { data: issue, isLoading } = useIssue(selectedIssueId || "");
  const updateIssue = useUpdateIssue();

  if (!isIssuePanelOpen || !selectedIssueId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-[480px] border-l bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="w-[480px] border-l bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Issue not found</p>
      </div>
    );
  }

  const issueKey = issue.team
    ? `${issue.team.key}-${issue.number}`
    : `ISSUE-${issue.number}`;

  const handlePriorityChange = (priority: IssuePriority) => {
    updateIssue.mutate({ id: issue.id, priority });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    updateIssue.mutate({
      id: issue.id,
      assignee_id: assigneeId || null,
    });
  };

  const handleDescriptionChange = (content: any) => {
    updateIssue.mutate({ id: issue.id, description: content });
  };

  return (
    <div className="w-[480px] border-l bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <StatusIcon
            type={(issue.state?.type as WorkflowStateType) || "unstarted"}
          />
          <span className="text-sm font-mono text-muted-foreground">
            {issueKey}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={closeIssuePanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl font-semibold">{issue.title}</h2>
          </div>

          {/* Properties */}
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">Status</span>
              <div className="flex items-center gap-2">
                <StatusIcon
                  type={(issue.state?.type as WorkflowStateType) || "unstarted"}
                />
                <span className="text-sm">
                  {issue.state?.name || "No Status"}
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">
                Priority
              </span>
              <Select
                value={issue.priority}
                onValueChange={(value) =>
                  handlePriorityChange(value as IssuePriority)
                }
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <PriorityIcon priority={issue.priority} />
                      <span>{priorityLabels[issue.priority]}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <PriorityIcon priority={value as IssuePriority} />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-24">
                Assignee
              </span>
              <Select
                value={issue.assignee_id || ""}
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Unassigned">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={issue.assignee.avatar_url}
                          fallback={
                            issue.assignee.display_name || issue.assignee.email
                          }
                          size="xs"
                        />
                        <span>
                          {issue.assignee.display_name || issue.assignee.email}
                        </span>
                      </div>
                    ) : (
                      "Unassigned"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={member.avatar_url}
                          fallback={member.display_name || member.email}
                          size="xs"
                        />
                        <span>{member.display_name || member.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Labels */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground w-24 pt-1">
                  Labels
                </span>
                <div className="flex flex-wrap gap-1">
                  {issue.labels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      style={{ borderColor: label.color, color: label.color }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Project */}
            {issue.project && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-24">
                  Project
                </span>
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{issue.project.name}</span>
                </div>
              </div>
            )}

            {/* Cycle */}
            {issue.cycle && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-24">
                  Cycle
                </span>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {issue.cycle.name || `Cycle ${issue.cycle.number}`}
                  </span>
                </div>
              </div>
            )}

            {/* Due Date */}
            {issue.due_date && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-24">
                  Due Date
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDateFull(issue.due_date)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <div className="border rounded-md min-h-[200px]">
              <RichTextEditor
                content={issue.description}
                onChange={handleDescriptionChange}
                placeholder="Add a description..."
              />
            </div>
          </div>

          {/* Activity / Comments section placeholder */}
          <div>
            <h3 className="text-sm font-medium mb-2">Activity</h3>
            <div className="text-sm text-muted-foreground">
              <p>Created {formatDateFull(issue.created_at)}</p>
              {issue.creator && (
                <p>by {issue.creator.display_name || issue.creator.email}</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
