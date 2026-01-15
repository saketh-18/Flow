"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  Issue,
  IssueWithRelations,
  InsertTables,
  UpdateTables,
  IssueFilters,
} from "@/types";

// Query keys
export const issueKeys = {
  all: ["issues"] as const,
  lists: () => [...issueKeys.all, "list"] as const,
  list: (filters: IssueFilters) => [...issueKeys.lists(), filters] as const,
  details: () => [...issueKeys.all, "detail"] as const,
  detail: (id: string) => [...issueKeys.details(), id] as const,
  team: (teamId: string) => [...issueKeys.all, "team", teamId] as const,
};

// Fetch issues with relations
export function useIssues(teamId?: string, filters?: IssueFilters) {
  return useQuery({
    queryKey: teamId ? issueKeys.team(teamId) : issueKeys.list(filters || {}),
    queryFn: async () => {
      const supabase = getSupabaseClient();

      let query = supabase
        .from("issues")
        .select(
          `
          *,
          state:workflow_states(*),
          assignee:users!issues_assignee_id_fkey(*),
          creator:users!issues_creator_id_fkey(*),
          project:projects(*),
          cycle:cycles(*),
          team:teams(*)
        `
        )
        .order("sort_order", { ascending: true });

      if (teamId) {
        query = query.eq("team_id", teamId);
      }

      if (filters?.status?.length) {
        query = query.in("state_id", filters.status);
      }

      if (filters?.priority?.length) {
        query = query.in("priority", filters.priority);
      }

      if (filters?.assignee?.length) {
        query = query.in("assignee_id", filters.assignee);
      }

      if (filters?.project) {
        query = query.eq("project_id", filters.project);
      }

      if (filters?.cycle) {
        query = query.eq("cycle_id", filters.cycle);
      }

      if (filters?.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as IssueWithRelations[];
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// Fetch single issue
export function useIssue(issueId: string) {
  return useQuery({
    queryKey: issueKeys.detail(issueId),
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("issues")
        .select(
          `
          *,
          state:workflow_states(*),
          assignee:users!issues_assignee_id_fkey(*),
          creator:users!issues_creator_id_fkey(*),
          project:projects(*),
          cycle:cycles(*),
          team:teams(*),
          labels:issue_labels(label:labels(*))
        `
        )
        .eq("id", issueId)
        .single();

      if (error) throw error;
      return data as IssueWithRelations;
    },
    enabled: !!issueId,
  });
}

// Create issue
export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issue: InsertTables<"issues">) => {
      const supabase = getSupabaseClient();

      // Get the next issue number for this team
      const { data: maxIssue } = await supabase
        .from("issues")
        .select("number")
        .eq("team_id", issue.team_id)
        .order("number", { ascending: false })
        .limit(1);

      const issueArray = (maxIssue as any[]) || [];
      const nextNumber = (issueArray[0]?.number || 0) + 1;

      const { data, error } = (await (supabase.from("issues") as any)
        .insert({ ...issue, number: nextNumber } as Record<string, unknown>)
        .select()
        .single()) as any;

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
  });
}

// Update issue with optimistic updates
export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: UpdateTables<"issues"> & { id: string }) => {
      const supabase = getSupabaseClient();

      const { data, error } = (await (supabase.from("issues") as any)
        .update({ ...updates, updated_at: new Date().toISOString() } as Record<
          string,
          unknown
        >)
        .eq("id", id)
        .select()
        .single()) as any;

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: issueKeys.all });

      // Snapshot previous value
      const previousIssues = queryClient.getQueriesData({
        queryKey: issueKeys.all,
      });

      // Optimistically update all issue lists
      queryClient.setQueriesData(
        { queryKey: issueKeys.lists() },
        (old: IssueWithRelations[] | undefined) => {
          if (!old) return old;
          return old.map((issue) =>
            issue.id === id ? { ...issue, ...updates } : issue
          );
        }
      );

      // Optimistically update detail
      queryClient.setQueryData(
        issueKeys.detail(id),
        (old: IssueWithRelations | undefined) => {
          if (!old) return old;
          return { ...old, ...updates };
        }
      );

      return { previousIssues };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousIssues) {
        for (const [queryKey, data] of context.previousIssues) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
  });
}

// Delete issue
export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const supabase = getSupabaseClient();

      console.log("🗑️ Deleting issue:", issueId);

      const { data, error } = await supabase
        .from("issues")
        .delete()
        .eq("id", issueId)
        .select();

      if (error) {
        console.error("❌ Delete error:", error);
        throw new Error(`Failed to delete issue: ${error.message}`);
      }

      console.log("✅ Issue deleted successfully:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("🔄 Invalidating issue queries after delete");
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
    onError: (error: Error) => {
      console.error("❌ Delete mutation error:", error.message);
      alert(`Failed to delete issue: ${error.message}`);
    },
  });
}

// Reorder issues (for drag and drop)
export function useReorderIssues() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: Array<{ id: string; sort_order: number; state_id?: string }>
    ) => {
      const supabase = getSupabaseClient();

      // Update all issues in parallel
      const promises = updates.map(({ id, ...data }) =>
        (supabase.from("issues") as any)
          .update({ ...data, updated_at: new Date().toISOString() } as Record<
            string,
            unknown
          >)
          .eq("id", id)
      );

      await Promise.all(promises);
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: issueKeys.all });

      const previousIssues = queryClient.getQueriesData({
        queryKey: issueKeys.all,
      });

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: issueKeys.lists() },
        (old: IssueWithRelations[] | undefined) => {
          if (!old) return old;
          return old.map((issue) => {
            const update = updates.find((u) => u.id === issue.id);
            if (update) {
              return { ...issue, ...update };
            }
            return issue;
          });
        }
      );

      return { previousIssues };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) {
        for (const [queryKey, data] of context.previousIssues) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.all });
    },
  });
}
