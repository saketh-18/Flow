"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { issueKeys } from "./use-issues";

interface UseRealtimeOptions {
  teamId?: string;
  enabled?: boolean;
}

export function useRealtime({
  teamId,
  enabled = true,
}: UseRealtimeOptions = {}) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const supabase = getSupabaseClient();

    // Subscribe to issue changes
    const channel = supabase
      .channel(`issues-${teamId || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "issues",
          ...(teamId ? { filter: `team_id=eq.${teamId}` } : {}),
        },
        (payload) => {
          // Invalidate queries to refetch
          queryClient.invalidateQueries({ queryKey: issueKeys.all });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          // Invalidate the specific issue detail
          if (payload.new && "issue_id" in payload.new) {
            queryClient.invalidateQueries({
              queryKey: issueKeys.detail(payload.new.issue_id as string),
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [teamId, enabled, queryClient]);

  return channelRef.current;
}

// Presence hook for showing active users
export function usePresence(roomId: string) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const channel = supabase.channel(`presence-${roomId}`, {
      config: {
        presence: {
          key: roomId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // Handle presence state updates
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // Handle user join
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // Handle user leave
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this user's presence
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId]);

  return channelRef.current;
}
