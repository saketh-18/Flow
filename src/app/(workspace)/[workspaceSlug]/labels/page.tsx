"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyLabels } from "@/components/ui/empty-state";
import { CreateLabelModal } from "@/components/labels/create-label-modal";

export default function LabelsPage() {
  const [isCreateLabelOpen, setIsCreateLabelOpen] = React.useState(false);
  // TODO: Fetch real labels from Supabase
  const labels: any[] = [];

  return (
    <div className="flex flex-col h-full">
      <Header title="Labels" showViewSwitcher={false} />

      <ScrollArea className="flex-1">
        {labels.length === 0 ? (
          <EmptyLabels
            onCreateLabel={() => {
              setIsCreateLabelOpen(true);
            }}
          />
        ) : (
          <div className="p-6 max-w-4xl mx-auto">
            {/* Labels will be listed here */}
          </div>
        )}
      </ScrollArea>

      <CreateLabelModal
        open={isCreateLabelOpen}
        onOpenChange={setIsCreateLabelOpen}
      />
    </div>
  );
}
