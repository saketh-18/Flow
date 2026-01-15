"use client";

import { Header } from "@/components/layout/header";
import { IssueBoard } from "@/components/issues";
import type { Team, IssueWithRelations, WorkflowState } from "@/types";

interface BoardClientProps {
  team: Team;
  issues: IssueWithRelations[];
  workflowStates: WorkflowState[];
}

export function BoardClient({
  team,
  issues,
  workflowStates,
}: BoardClientProps) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Board" teamKey={team.key} showViewSwitcher={false} />
      <div className="flex-1 overflow-hidden">
        <IssueBoard issues={issues} workflowStates={workflowStates} />
      </div>
    </div>
  );
}
