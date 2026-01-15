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
import { Loader2, Calendar } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useWorkspaceStore } from "@/lib/store";

interface CreateCycleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCycleModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCycleModalProps) {
  const { teams } = useWorkspaceStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [selectedTeamId, setSelectedTeamId] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [error, setError] = React.useState("");

  // Select first team by default
  React.useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Set default dates (2 weeks from now)
  React.useEffect(() => {
    if (!startDate) {
      const today = new Date();
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(today.getDate() + 14);

      setStartDate(today.toISOString().split("T")[0]);
      setEndDate(twoWeeksLater.toISOString().split("T")[0]);
    }
  }, [startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) {
      setError("Please select a team");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = getSupabaseClient();

      // Get the next cycle number for this team
      const { data: existingCycles, error: countError } = await supabase
        .from("cycles")
        .select("number")
        .eq("team_id", selectedTeamId)
        .order("number", { ascending: false })
        .limit(1);

      if (countError) throw countError;

      const nextNumber =
        existingCycles && existingCycles.length > 0
          ? (existingCycles[0] as any).number + 1
          : 1;

      const { data, error: cycleError } = await supabase
        .from("cycles")
        .insert([
          {
            team_id: selectedTeamId,
            number: nextNumber,
            name: name || `Cycle ${nextNumber}`,
            starts_at: startDate,
            ends_at: endDate,
          },
        ] as any)
        .select()
        .single();

      if (cycleError) {
        console.error("Cycle creation error:", cycleError);
        throw new Error(cycleError.message);
      }

      console.log("Cycle created successfully:", data);

      // Reset form and close
      setName("");
      setStartDate("");
      setEndDate("");
      setSelectedTeamId(teams[0]?.id || "");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create cycle";
      console.error("Error creating cycle:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create cycle</DialogTitle>
          <DialogDescription>
            Cycles help you plan and track work over fixed periods of time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cycle name (optional)</Label>
            <Input
              id="name"
              placeholder="Sprint 1, Q1 Planning, ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
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
              Create cycle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
