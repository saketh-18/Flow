"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface IssueFormDemoProps {
  className?: string;
}

export function IssueFormDemo({ className }: IssueFormDemoProps) {
  const [title, setTitle] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [showAISuggestion, setShowAISuggestion] = React.useState(false);
  const [aiThinking, setAiThinking] = React.useState(false);

  const sampleTitle = "Add dark mode support to settings page";

  React.useEffect(() => {
    const runDemo = async () => {
      setIsTyping(true);
      setTitle("");
      setShowAISuggestion(false);

      // Type the title
      for (let i = 0; i <= sampleTitle.length; i++) {
        setTitle(sampleTitle.slice(0, i));
        await new Promise((r) => setTimeout(r, 50));
      }

      setIsTyping(false);

      // Show AI thinking
      await new Promise((r) => setTimeout(r, 500));
      setAiThinking(true);
      await new Promise((r) => setTimeout(r, 1200));
      setAiThinking(false);
      setShowAISuggestion(true);

      // Wait and reset
      await new Promise((r) => setTimeout(r, 3000));
    };

    runDemo();
    const interval = setInterval(runDemo, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <span className="text-sm font-medium">New Issue</span>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 rounded border bg-muted font-mono text-xs text-muted-foreground">
              ⌘↵
            </kbd>
            <span className="text-xs text-muted-foreground">to create</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                readOnly
                placeholder="Issue title..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none"
              />
              {isTyping && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-foreground animate-pulse" />
              )}
            </div>
          </div>

          {/* AI Suggestion */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showAISuggestion || aiThinking ? 1 : 0,
              height: showAISuggestion || aiThinking ? "auto" : 0,
            }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium text-violet-500">
                  AI Suggestions
                </span>
                {aiThinking && (
                  <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />
                )}
              </div>
              {showAISuggestion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs">
                      feature
                    </span>
                    <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                      settings
                    </span>
                    <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs">
                      priority: medium
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium">
                      M
                    </div>
                    <span>Suggested: Maya Johnson (Frontend team)</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick fields */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
              Status: Todo
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
              Priority: None
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
              Assignee
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/30">
          <button className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium">
            Create issue
          </button>
        </div>
      </div>
    </div>
  );
}
