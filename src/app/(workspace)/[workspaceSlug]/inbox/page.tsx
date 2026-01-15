"use client";

import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox as InboxIcon } from "lucide-react";

export default function InboxPage() {
  // TODO: Fetch real inbox items from Supabase (notifications, mentions, assignments)
  const inboxItems: any[] = [];

  return (
    <div className="flex flex-col h-full">
      <Header title="Inbox" showViewSwitcher={false} />

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          {inboxItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-lg bg-muted/50 p-4 text-muted-foreground">
                <InboxIcon className="h-10 w-10" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Inbox Zero!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                You're all caught up. Notifications, mentions, and issue
                assignments will appear here when they arrive.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Inbox items will be listed here */}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
