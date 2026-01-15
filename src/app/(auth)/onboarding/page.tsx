"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, Users, Layers } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

const steps = [
  {
    id: "workspace",
    title: "Create your workspace",
    description: "A workspace is where your team collaborates on projects",
    icon: Building2,
  },
  {
    id: "team",
    title: "Set up your first team",
    description: "Teams help organize work by department or project",
    icon: Users,
  },
  {
    id: "ready",
    title: "You're all set!",
    description: "Start creating issues and managing your projects",
    icon: Layers,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [workspaceSlug, setWorkspaceSlug] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [teamKey, setTeamKey] = React.useState("");

  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);

  // Auto-generate slug from workspace name
  React.useEffect(() => {
    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setWorkspaceSlug(slug);
  }, [workspaceName]);

  // Auto-generate team key from team name
  React.useEffect(() => {
    const key = teamName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
    setTeamKey(key || "");
  }, [teamName]);

  const handleCreateWorkspace = async () => {
    if (!workspaceName || !workspaceSlug) return;
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Create workspace
      const { data: workspace, error: workspaceError } = (await supabase
        .from("workspaces")
        .insert({
          name: workspaceName,
          slug: workspaceSlug,
        } as any)
        .select()
        .single()) as any;

      if (workspaceError) throw workspaceError;

      // Add user as workspace owner
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: workspace?.id,
          user_id: user.id,
          role: "owner",
        } as any);

      if (memberError) throw memberError;

      setWorkspaceId(workspace?.id);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!workspaceId || !teamName || !teamKey) return;
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Create team
      const { data: team, error: teamError } = (await supabase
        .from("teams")
        .insert({
          workspace_id: workspaceId,
          name: teamName,
          key: teamKey.toUpperCase(),
        } as any)
        .select()
        .single()) as any;

      if (teamError) throw teamError;

      // Add user as team member
      await supabase.from("team_members").insert({
        team_id: team?.id,
        user_id: user.id,
        role: "lead",
      } as any);

      // Create default workflow states
      const workflowStates = [
        {
          team_id: team?.id,
          name: "Backlog",
          type: "backlog",
          color: "#6b7280",
          position: 0,
        },
        {
          team_id: team?.id,
          name: "Todo",
          type: "unstarted",
          color: "#6b7280",
          position: 1,
        },
        {
          team_id: team?.id,
          name: "In Progress",
          type: "started",
          color: "#eab308",
          position: 2,
        },
        {
          team_id: team?.id,
          name: "In Review",
          type: "started",
          color: "#3b82f6",
          position: 3,
        },
        {
          team_id: team?.id,
          name: "Done",
          type: "completed",
          color: "#22c55e",
          position: 4,
        },
        {
          team_id: team?.id,
          name: "Canceled",
          type: "canceled",
          color: "#6b7280",
          position: 5,
        },
      ];

      await supabase.from("workflow_states").insert(workflowStates as any);

      // Create default labels
      const labels = [
        { team_id: team?.id, name: "Bug", color: "#ef4444" },
        { team_id: team?.id, name: "Feature", color: "#3b82f6" },
        { team_id: team?.id, name: "Improvement", color: "#10b981" },
        { team_id: team?.id, name: "Documentation", color: "#6b7280" },
      ];

      await supabase.from("labels").insert(labels as any);

      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    router.push(`/${workspaceSlug}`);
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-4">
        {/* Progress */}
        <div className="flex justify-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 w-16 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CurrentIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="workspaceName" className="text-sm font-medium">
                Workspace name
              </label>
              <Input
                id="workspaceName"
                placeholder="Acme Inc."
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="workspaceSlug" className="text-sm font-medium">
                Workspace URL
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">flow.app/</span>
                <Input
                  id="workspaceSlug"
                  placeholder="acme"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleCreateWorkspace}
              disabled={isLoading || !workspaceName || !workspaceSlug}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-sm font-medium">
                Team name
              </label>
              <Input
                id="teamName"
                placeholder="Engineering"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamKey" className="text-sm font-medium">
                Team identifier
              </label>
              <Input
                id="teamKey"
                placeholder="ENG"
                value={teamKey}
                onChange={(e) => setTeamKey(e.target.value.toUpperCase())}
                maxLength={5}
              />
              <p className="text-xs text-muted-foreground">
                Used for issue identifiers like {teamKey || "ENG"}-123
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleCreateTeam}
              disabled={isLoading || !teamName || !teamKey}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Team
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{workspaceName}</p>
                  <p className="text-sm text-muted-foreground">
                    /{workspaceSlug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{teamName}</p>
                  <p className="text-sm text-muted-foreground">{teamKey}</p>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleFinish}>
              Go to Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
