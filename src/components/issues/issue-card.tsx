"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { MoreHorizontal, Copy, Trash, Link, ExternalLink } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityIcon, StatusIcon } from "./issue-icons";
import { useDeleteIssue } from "@/hooks/use-issues";
import type { IssueWithRelations, WorkflowStateType } from "@/types";

interface IssueCardProps {
  issue: IssueWithRelations;
  isSelected?: boolean;
  isFocused?: boolean;
  showTeam?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function IssueCard({
  issue,
  isSelected = false,
  isFocused = false,
  showTeam = false,
  onClick,
  onDelete,
}: IssueCardProps) {
  const router = useRouter();
  const params = useParams();
  const deleteIssueMutation = useDeleteIssue();

  const issueKey = issue.team
    ? `${issue.team.key}-${issue.number}`
    : `ISSUE-${issue.number}`;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Navigate to issue detail page
    const workspaceSlug = params.workspaceSlug as string;
    router.push(`/${workspaceSlug}/issue/${issueKey.toLowerCase()}`);
  };

  const handleCopyIssueId = () => {
    navigator.clipboard.writeText(issueKey);
  };

  const handleCopyLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const workspaceSlug = params.workspaceSlug as string;
    const link = `${baseUrl}/${workspaceSlug}/issue/${issueKey.toLowerCase()}`;
    navigator.clipboard.writeText(link);
  };

  const handleOpenInNewTab = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const workspaceSlug = params.workspaceSlug as string;
    const link = `${baseUrl}/${workspaceSlug}/issue/${issueKey.toLowerCase()}`;
    window.open(link, "_blank");
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${issueKey}?`)) {
      console.log("🗑️ Delete confirmed for issue:", issueKey, "ID:", issue.id);
      deleteIssueMutation.mutate(issue.id, {
        onSuccess: () => {
          console.log("✅ Delete successful");
          onDelete?.();
        },
        onError: (error) => {
          console.error("❌ Delete failed:", error);
        },
      });
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-2 border-b cursor-pointer transition-colors",
        "hover:bg-accent/50",
        isSelected && "bg-accent",
        isFocused && "ring-1 ring-primary ring-inset"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
    >
      {/* Priority */}
      <div className="flex-shrink-0">
        <PriorityIcon priority={issue.priority} />
      </div>

      {/* Issue Key */}
      <span className="flex-shrink-0 text-xs text-muted-foreground font-mono w-16">
        {issueKey}
      </span>

      {/* Status */}
      <div className="flex-shrink-0">
        <StatusIcon
          type={(issue.state?.type as WorkflowStateType) || "unstarted"}
        />
      </div>

      {/* Title */}
      <span className="flex-1 truncate text-sm">{issue.title}</span>

      {/* Labels */}
      {issue.labels && issue.labels.length > 0 && (
        <div className="hidden sm:flex items-center gap-1">
          {issue.labels.slice(0, 2).map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="text-[10px] px-1.5 py-0"
              style={{ borderColor: label.color, color: label.color }}
            >
              {label.name}
            </Badge>
          ))}
          {issue.labels.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{issue.labels.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Project */}
      {issue.project && (
        <Badge
          variant="secondary"
          className="text-[10px] hidden md:inline-flex"
        >
          {issue.project.name}
        </Badge>
      )}

      {/* Due Date */}
      {issue.due_date && (
        <span className="text-xs text-muted-foreground hidden lg:block">
          {formatDate(issue.due_date)}
        </span>
      )}

      {/* Assignee */}
      <div className="flex-shrink-0">
        {issue.assignee ? (
          <Avatar
            src={issue.assignee.avatar_url}
            fallback={issue.assignee.display_name || issue.assignee.email}
            size="xs"
          />
        ) : (
          <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground/30" />
        )}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCopyIssueId();
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy issue ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Link className="mr-2 h-4 w-4" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleOpenInNewTab();
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
