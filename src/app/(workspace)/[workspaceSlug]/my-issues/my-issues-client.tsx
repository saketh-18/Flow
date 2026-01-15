"use client";

import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueList } from "@/components/issues";
import { Circle } from "lucide-react";
import type { IssueWithRelations } from "@/types";

interface MyIssuesClientProps {
  issues: IssueWithRelations[];
}

export function MyIssuesClient({ issues }: MyIssuesClientProps) {
  return (
    <div className="flex flex-col h-full">
      <Header title="My Issues" showViewSwitcher />

      <ScrollArea className="flex-1">
        {issues.length > 0 ? (
          <IssueList issues={issues} groupBy="status" />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-lg bg-muted/50 p-4 text-muted-foreground">
              <Circle className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No assigned issues</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Issues assigned to you will appear here. You can view all team
              issues from the sidebar.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
