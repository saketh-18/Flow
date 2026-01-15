"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useWorkspaceStore } from "@/lib/store";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const teamColors = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ef4444", // Red
  "#14b8a6", // Teal
];

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const router = useRouter();
  const { currentWorkspace, addTeam } = useWorkspaceStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState(teamColors[0]);
  const [error, setError] = React.useState("");

  // Auto-generate key from name
  React.useEffect(() => {
    if (name && !key) {
      const generatedKey = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
      setKey(generatedKey);
    }
  }, [name, key]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    setIsLoading(true);
    setError("");

    try {
      const supabase = getSupabaseClient();

      // Create the team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([
          {
            workspace_id: currentWorkspace.id,
            name,
            key: key.toUpperCase(),
            color: selectedColor,
          },
        ] as any)
        .select()
        .single();

      if (teamError) {
        throw new Error(teamError.message);
      }

      // Create default workflow states for the team
      const defaultStates = [
        { name: "Backlog", type: "backlog", color: "#6b7280", position: 0 },
        { name: "Todo", type: "unstarted", color: "#6b7280", position: 1 },
        { name: "In Progress", type: "started", color: "#eab308", position: 2 },
        { name: "In Review", type: "started", color: "#3b82f6", position: 3 },
        { name: "Done", type: "completed", color: "#22c55e", position: 4 },
        { name: "Canceled", type: "canceled", color: "#ef4444", position: 5 },
      ];

      const { error: statesError } = await (
        supabase.from("workflow_states") as any
      ).insert(
        defaultStates.map((state) => ({
          ...state,
          team_id: (team as any).id,
        }))
      );

      if (statesError) {
        console.error("Failed to create workflow states:", statesError);
      }

      // Add team to store
      addTeam(team as any);
      console.log("Team created successfully:", team);

      // Reset form and close
      setName("");
      setKey("");
      setSelectedColor(teamColors[0]);
      onOpenChange(false);

      // Navigate to the new team
      router.push(
        `/${currentWorkspace.slug}/team/${(team as any).key.toLowerCase()}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Teams help organize your work. Each team has its own issues, board,
            and workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team name</Label>
            <Input
              id="name"
              placeholder="Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Team identifier</Label>
            <Input
              id="key"
              placeholder="ENG"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              maxLength={5}
              required
            />
            <p className="text-xs text-muted-foreground">
              Used in issue IDs like {key || "ENG"}-123
            </p>
          </div>

          <div className="space-y-2">
            <Label>Team color</Label>
            <div className="flex gap-2">
              {teamColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "h-6 w-6 rounded-full transition-all",
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-offset-background"
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: color, outlineColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name || !key}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
