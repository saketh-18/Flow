"use client";

import { Header } from "@/components/layout/header";
import { IssueList, IssueBoard } from "@/components/issues";
import { useUIStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Team, IssueWithRelations, WorkflowState } from "@/types";
import React from "react";

interface TeamPageClientProps {
  team: Team;
  issues: IssueWithRelations[];
  workflowStates: WorkflowState[];
}

export function TeamPageClient({
  team,
  issues: initialIssues,
  workflowStates,
}: TeamPageClientProps) {
  const { currentView, displayOptions, isCreateIssueOpen } = useUIStore();
  const queryClient = useQueryClient();

  // Fetch issues from client side (with React Query for auto-refetching)
  const { data: issues = initialIssues, isLoading } = useQuery({
    queryKey: ["issues", team.id],
    queryFn: async () => {
      console.log("Fetching issues for team:", team.id);
      const response = await fetch(`/api/issues?teamId=${team.id}`);
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to fetch issues:", error);
        throw new Error(error.error || "Failed to fetch issues");
      }
      const data = await response.json();
      console.log("Issues fetched:", data);
      return data;
    },
    initialData: initialIssues,
    staleTime: 0, // Always consider data stale to refetch on focus
    retry: 1, // Retry once on failure
  });

  // Refetch issues when modal closes (new issue was created)
  React.useEffect(() => {
    if (!isCreateIssueOpen) {
      queryClient.invalidateQueries({ queryKey: ["issues", team.id] });
    }
  }, [isCreateIssueOpen, team.id, queryClient]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Active Issues" teamKey={team.key} showViewSwitcher />

      {currentView === "board" ? (
        <IssueBoard issues={issues} workflowStates={workflowStates} />
      ) : (
        <ScrollArea className="flex-1">
          <IssueList
            issues={issues}
            groupBy={displayOptions.groupBy}
            isLoading={isLoading}
          />
        </ScrollArea>
      )}
    </div>
  );
}
