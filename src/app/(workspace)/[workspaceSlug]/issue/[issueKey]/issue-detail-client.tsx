"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  LinkIcon,
  MoreHorizontal,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityIcon, StatusIcon } from "@/components/issues/issue-icons";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { useUpdateIssue } from "@/hooks/use-issues";
import type {
  IssueWithRelations,
  WorkflowState,
  User,
  IssuePriority,
} from "@/types";

interface Comment {
  id: string;
  body: string;
  created_at: string;
  user: User | null;
}

interface IssueDetailClientProps {
  issue: IssueWithRelations;
  workflowStates: WorkflowState[];
  teamMembers: User[];
  comments: Comment[];
  workspaceSlug: string;
}

export function IssueDetailClient({
  issue,
  workflowStates,
  teamMembers,
  comments: initialComments,
  workspaceSlug,
}: IssueDetailClientProps) {
  const router = useRouter();
  const updateIssue = useUpdateIssue();
  const [comments, setComments] = React.useState(initialComments);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [description, setDescription] = React.useState(issue.description);
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);

  const issueKey = issue.team
    ? `${issue.team.key}-${issue.number}`
    : `ISSUE-${issue.number}`;

  const handleStatusChange = async (stateId: string) => {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        state_id: stateId,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handlePriorityChange = async (priority: IssuePriority) => {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        priority,
      });
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        assignee_id: assigneeId || null,
      });
    } catch (error) {
      console.error("Failed to update assignee:", error);
    }
  };

  const handleDescriptionSave = async () => {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        description,
      });
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/issues/${issue.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3 border-b">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {issueKey}
          </Badge>
          {issue.team && (
            <Link
              href={`/${workspaceSlug}/team/${issue.team.key.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {issue.team.name}
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl p-6 space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-semibold">{issue.title}</h1>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Description
                </h2>
                {!isEditingDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-2">
                  <div className="border rounded-md min-h-37.5">
                    <RichTextEditor
                      content={description}
                      onChange={setDescription}
                      placeholder="Add a description..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleDescriptionSave}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDescription(issue.description);
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: description as string,
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground">No description</p>
                  )}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Activity
              </h2>

              {comments.length > 0 && (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar
                        fallback={
                          comment.user?.display_name || comment.user?.email
                        }
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.user?.display_name ||
                              comment.user?.email ||
                              "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)} at{" "}
                            {formatTime(comment.created_at)}
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p>{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="flex gap-3">
                <Avatar fallback="You" size="sm" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar */}
        <div className="w-72 border-l p-4 space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={issue.state_id || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No status">
                  {issue.state && (
                    <div className="flex items-center gap-2">
                      <StatusIcon type={issue.state.type} />
                      <span>{issue.state.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {workflowStates.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    <div className="flex items-center gap-2">
                      <StatusIcon type={state.type} />
                      <span>{state.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Priority
            </label>
            <Select
              value={issue.priority || "none"}
              onValueChange={(value) =>
                handlePriorityChange(value as IssuePriority)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No priority">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority={issue.priority || "none"} />
                    <span className="capitalize">
                      {issue.priority || "No priority"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority="urgent" />
                    <span>Urgent</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority="high" />
                    <span>High</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority="medium" />
                    <span>Medium</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority="low" />
                    <span>Low</span>
                  </div>
                </SelectItem>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <PriorityIcon priority="none" />
                    <span>No priority</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Assignee
            </label>
            <Select
              value={issue.assignee_id || ""}
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unassigned">
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar
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

          {/* Dates */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(issue.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {formatDate(issue.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
