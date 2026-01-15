"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { useCreateIssue } from "@/hooks/use-issues";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import type { IssuePriority, WorkflowState } from "@/types";

const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.any().optional(),
  priority: z.enum(["urgent", "high", "medium", "low", "none"]).default("none"),
  assignee_id: z.string().optional(),
  project_id: z.string().optional(),
  state_id: z.string().min(1, "Please select a status"),
});

type CreateIssueForm = {
  title: string;
  description?: unknown;
  priority: IssuePriority;
  assignee_id?: string;
  project_id?: string;
  state_id: string;
};

export function CreateIssueModal() {
  const { isCreateIssueOpen, closeCreateIssue } = useUIStore();
  const { currentTeam, currentUser, teamMembers } = useWorkspaceStore();
  const createIssue = useCreateIssue();
  const [isAISuggesting, setIsAISuggesting] = React.useState(false);
  const [workflowStates, setWorkflowStates] = React.useState<WorkflowState[]>(
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateIssueForm>({
    resolver: zodResolver(createIssueSchema) as any,
    defaultValues: {
      priority: "none",
      state_id: "",
    },
  });

  // Fetch workflow states when modal opens and team is available
  React.useEffect(() => {
    // Only fetch if modal is open and team exists
    if (!isCreateIssueOpen || !currentTeam?.id) {
      console.log(
        "Modal not open or no team. isOpen:",
        isCreateIssueOpen,
        "teamId:",
        currentTeam?.id
      );
      return;
    }

    const fetchStates = async () => {
      try {
        const url = `/api/teams/${currentTeam.id}/workflow-states`;
        console.log("Fetching from URL:", url);
        const response = await fetch(url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Failed to fetch workflow states. Status:",
            response.status,
            "Error:",
            errorText
          );
          return;
        }

        const states = await response.json();
        console.log("Workflow states fetched successfully:", states);

        if (Array.isArray(states) && states.length > 0) {
          setWorkflowStates(states);
          // Set first state as default
          setValue("state_id", states[0].id);
          console.log("Set default state to:", states[0].id);
        } else {
          console.warn("No workflow states returned from API");
          setWorkflowStates([]);
        }
      } catch (error) {
        console.error("Error fetching workflow states:", error);
        setWorkflowStates([]);
      }
    };

    fetchStates();
  }, [isCreateIssueOpen, currentTeam?.id, setValue]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isCreateIssueOpen) {
      reset({
        title: "",
        description: undefined,
        priority: "none",
        assignee_id: undefined,
        project_id: undefined,
        state_id: "",
      });
      setWorkflowStates([]);
    }
  }, [isCreateIssueOpen, reset]);

  const title = watch("title");
  const description = watch("description");

  const onSubmit = async (data: CreateIssueForm) => {
    if (!currentTeam || !currentUser) {
      console.error("No team or user selected");
      return;
    }

    try {
      console.log("Creating issue with data:", {
        title: data.title,
        priority: data.priority,
        state_id: data.state_id,
        team_id: currentTeam.id,
        assignee_id: data.assignee_id,
      });

      await createIssue.mutateAsync({
        title: data.title,
        description: data.description as any,
        priority: data.priority as IssuePriority,
        team_id: currentTeam.id,
        creator_id: currentUser.id,
        assignee_id:
          data.assignee_id === "unassigned"
            ? undefined
            : data.assignee_id || undefined,
        project_id: data.project_id || undefined,
        state_id: data.state_id,
        number: 0,
        sort_order: Date.now(),
      });
      console.log("Issue created successfully!");
      reset();
      closeCreateIssue();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Failed to create issue:", errorMsg);
      alert(`Error creating issue: ${errorMsg}`);
    }
  };

  const handleAISuggest = async () => {
    if (!title) return;

    setIsAISuggesting(true);
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || "",
          teamId: currentTeam?.id,
        }),
      });

      if (response.ok) {
        const suggestions = await response.json();
        if (suggestions.suggestedPriority) {
          setValue("priority", suggestions.suggestedPriority);
        }
        if (suggestions.suggestedAssignee) {
          setValue("assignee_id", suggestions.suggestedAssignee);
        }
      }
    } catch (error) {
      console.error("AI suggestion failed:", error);
    } finally {
      setIsAISuggesting(false);
    }
  };

  return (
    <Dialog open={isCreateIssueOpen} onOpenChange={closeCreateIssue}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Create Issue
            {currentTeam && (
              <span className="text-sm font-normal text-muted-foreground">
                in {currentTeam.name}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new issue with title, description, status, priority, and
            assignee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Input
              {...register("title")}
              placeholder="Issue title"
              className="text-lg font-medium border-0 px-0 focus-visible:ring-0 focus:outline-0"
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="min-h-[150px] border rounded-md">
            <RichTextEditor
              content={description}
              onChange={(content) => setValue("description", content)}
              placeholder="Add description..."
            />
          </div>

          {/* Properties */}
          <div className="flex flex-wrap gap-2">
            {/* Status */}
            <Select
              value={watch("state_id") || ""}
              onValueChange={(value) => {
                console.log("Status changed to:", value);
                setValue("state_id", value);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {workflowStates.length === 0 && (
                  <div className="p-2 text-sm text-gray-500">
                    No states available
                  </div>
                )}
                {workflowStates.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority */}
            <Select
              value={watch("priority")}
              onValueChange={(value) =>
                setValue("priority", value as IssuePriority)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🔵 Low</SelectItem>
                <SelectItem value="none">⚪ No priority</SelectItem>
              </SelectContent>
            </Select>

            {/* Assignee */}
            <Select
              value={watch("assignee_id") || "unassigned"}
              onValueChange={(value) =>
                setValue(
                  "assignee_id",
                  value === "unassigned" ? undefined : value
                )
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.display_name || member.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* AI Suggest Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAISuggest}
              disabled={!title || isAISuggesting}
              className="ml-auto"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isAISuggesting ? "Suggesting..." : "AI Suggest"}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={closeCreateIssue}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
