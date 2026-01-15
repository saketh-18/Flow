"use client";

import * as React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Filter, Eye, EyeOff } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useWorkspaceStore } from "@/lib/store";

interface CreateViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialFilters?: ViewFilters;
}

interface ViewFilters {
  statuses?: string[];
  priorities?: string[];
  assignees?: string[];
  labels?: string[];
}

const viewIcons = [
  { value: "filter", label: "Filter", icon: Filter },
  { value: "eye", label: "View", icon: Eye },
];

export function CreateViewModal({
  open,
  onOpenChange,
  onSuccess,
  initialFilters,
}: CreateViewModalProps) {
  const { teams, currentUser } = useWorkspaceStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedTeamId, setSelectedTeamId] = React.useState("");
  const [isShared, setIsShared] = React.useState(false);
  const [error, setError] = React.useState("");

  // Select first team by default
  React.useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) {
      setError("Please select a team");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a view name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = getSupabaseClient();

      const { data, error: viewError } = await supabase
        .from("views")
        .insert([
          {
            team_id: selectedTeamId,
            name: name.trim(),
            description: description || null,
            filters: initialFilters || {},
            creator_id: currentUser?.id,
            is_shared: isShared,
          },
        ] as any)
        .select()
        .single();

      if (viewError) {
        console.error("View creation error:", viewError);
        throw new Error(viewError.message);
      }

      console.log("View created successfully:", data);

      // Reset form and close
      setName("");
      setDescription("");
      setIsShared(false);
      setSelectedTeamId(teams[0]?.id || "");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create view";
      console.error("Error creating view:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save current view</DialogTitle>
          <DialogDescription>
            Save your current filters and settings as a reusable view.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">View name</Label>
            <Input
              id="name"
              placeholder="My assigned issues, Bug triage, ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What this view shows..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <select
              id="team"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2">
            <button
              type="button"
              onClick={() => setIsShared(!isShared)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isShared ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
                  isShared ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              {isShared ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">
                {isShared ? "Shared with team" : "Private view"}
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save view
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
