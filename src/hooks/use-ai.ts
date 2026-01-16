"use client";

import * as React from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIContext {
  currentTeam?: string;
  currentProject?: string;
  currentIssue?: {
    id: string;
    title: string;
    description?: string;
  };
}

interface UseAIChatOptions {
  context?: AIContext;
  onAction?: (action: AIAction) => void;
}

interface AIAction {
  type: string;
  payload: Record<string, unknown>;
}

interface IssueSuggestion {
  suggestedPriority: string;
  issueType: string;
  suggestedLabels: string[];
  confidence: number;
  reasoning: string;
}

interface ParsedCommand {
  action: string;
  parameters: Record<string, unknown>;
  confidence: number;
  interpretation: string;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const sendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: options.context,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullContent += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: fullContent }
                        : m
                    )
                  );
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, options.context]
  );

  const clearMessages = React.useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

export function useAISuggestions() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<IssueSuggestion | null>(
    null
  );

  const getSuggestions = React.useCallback(
    async (title: string, description?: string) => {
      if (!title.trim()) return null;

      setIsLoading(true);
      try {
        const response = await fetch("/api/ai/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });

        if (!response.ok) throw new Error("Failed to get suggestions");

        const data = await response.json();
        setSuggestions(data);
        return data;
      } catch (err) {
        console.error("Failed to get AI suggestions:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { suggestions, isLoading, getSuggestions };
}

export function useAICommand() {
  const [isLoading, setIsLoading] = React.useState(false);

  const parseCommand = React.useCallback(
    async (input: string): Promise<ParsedCommand | null> => {
      if (!input.trim()) return null;

      setIsLoading(true);
      try {
        const response = await fetch("/api/ai/parse-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        });

        if (!response.ok) throw new Error("Failed to parse command");

        return await response.json();
      } catch (err) {
        console.error("Failed to parse command:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { parseCommand, isLoading };
}
