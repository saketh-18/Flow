"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sparkles,
  Send,
  Loader2,
  X,
  Copy,
  Check,
  Lightbulb,
  ListTodo,
  FileText,
  Zap,
} from "lucide-react";
import { useAIChat } from "@/hooks/use-ai";
import ReactMarkdown from "react-markdown";

interface AIChatPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: {
    currentTeam?: string;
    currentProject?: string;
    currentIssue?: {
      id: string;
      title: string;
      description?: string;
    };
  };
}

const quickActions = [
  {
    icon: ListTodo,
    label: "Break down this task",
    prompt: "Help me break down this task into smaller subtasks",
  },
  {
    icon: FileText,
    label: "Write acceptance criteria",
    prompt: "Help me write acceptance criteria for this issue",
  },
  {
    icon: Lightbulb,
    label: "Suggest improvements",
    prompt: "Suggest improvements or considerations for this issue",
  },
  {
    icon: Zap,
    label: "Estimate effort",
    prompt: "Help me estimate the effort required for this task",
  },
];

export function AIChatPanel({ open, onOpenChange, context }: AIChatPanelProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat({
    context,
  });
  const [input, setInput] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input);
    setInput("");
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <SheetTitle className="text-base">Flow AI</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Your intelligent assistant
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="text-xs"
              >
                Clear chat
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="py-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 mb-4">
                  <Sparkles className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="font-semibold mb-2">How can I help you?</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Ask me anything about your issues, projects, or get help with
                  task management.
                </p>
              </div>

              {context?.currentIssue && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">
                    Quick actions for this issue:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                      >
                        <action.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  Try asking:
                </p>
                {[
                  "How should I prioritize my backlog?",
                  "Help me write a bug report template",
                  "What are the best practices for sprint planning?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    {message.role === "assistant" && message.content && (
                      <button
                        onClick={() =>
                          copyToClipboard(message.content, message.id)
                        }
                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {error && (
          <div className="px-6 py-2 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 border-t bg-background"
        >
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Flow AI anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by Groq AI • Responses may not always be accurate
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
