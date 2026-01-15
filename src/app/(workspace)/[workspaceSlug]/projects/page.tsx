"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyProjects } from "@/components/ui/empty-state";
import { CreateProjectModal } from "@/components/projects/create-project-modal";

export default function ProjectsPage() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false);
  // TODO: Fetch real projects from Supabase
  const projects: any[] = [];

  return (
    <div className="flex flex-col h-full">
      <Header title="Projects" showViewSwitcher={false} />

      <ScrollArea className="flex-1">
        {projects.length === 0 ? (
          <EmptyProjects
            onCreateProject={() => {
              setIsCreateProjectOpen(true);
            }}
          />
        ) : (
          <div className="p-6 max-w-6xl mx-auto">
            {/* Projects will be listed here */}
          </div>
        )}
      </ScrollArea>

      <CreateProjectModal
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
