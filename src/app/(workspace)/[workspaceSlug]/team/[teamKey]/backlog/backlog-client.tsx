"use client";

import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueList } from "@/components/issues";
import { EmptyBacklog } from "@/components/ui/empty-state";
import type { Team, IssueWithRelations } from "@/types";

interface BacklogClientProps {
  team: Team;
  issues: IssueWithRelations[];
}

export function BacklogClient({ team, issues }: BacklogClientProps) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Backlog" teamKey={team.key} showViewSwitcher={false} />

      <ScrollArea className="flex-1">
        {issues.length > 0 ? (
          <IssueList issues={issues} groupBy="priority" />
        ) : (
          <EmptyBacklog />
        )}
      </ScrollArea>
    </div>
  );
}
