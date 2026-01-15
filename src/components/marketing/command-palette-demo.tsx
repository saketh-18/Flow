"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Circle,
  Layers,
  Settings,
  Users,
} from "lucide-react";

interface CommandItem {
  id: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  description?: string;
}

const commands: CommandItem[] = [
  { id: "create", icon: Plus, label: "Create new issue", shortcut: "C" },
  { id: "search", icon: Search, label: "Search issues", shortcut: "/" },
  { id: "active", icon: Circle, label: "Go to Active", shortcut: "G A" },
  { id: "backlog", icon: Layers, label: "Go to Backlog", shortcut: "G B" },
  { id: "team", icon: Users, label: "Switch team", shortcut: "G T" },
  { id: "settings", icon: Settings, label: "Open settings", shortcut: "G S" },
];

export function CommandPaletteDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Auto-open animation
  React.useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-type animation
  React.useEffect(() => {
    if (!isOpen) return;

    const typeSequence = async () => {
      await new Promise((r) => setTimeout(r, 500));
      const text = "create";
      for (let i = 0; i <= text.length; i++) {
        setQuery(text.slice(0, i));
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 800));
      setSelectedIndex(0);
      await new Promise((r) => setTimeout(r, 500));
      setIsOpen(false);
      await new Promise((r) => setTimeout(r, 1500));
      setQuery("");
      setSelectedIndex(0);
      setIsOpen(true);
    };

    typeSequence();
    const interval = setInterval(typeSequence, 6000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Keyboard hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4"
      >
        <span>Press</span>
        <kbd className="px-2 py-1 rounded border bg-card font-mono text-xs">
          ⌘K
        </kbd>
        <span>to open</span>
      </motion.div>

      {/* Command palette mockup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg mx-auto rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                readOnly
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="px-2 py-1 rounded border bg-muted font-mono text-xs text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="py-2 max-h-64 overflow-auto">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <motion.div
                    key={cmd.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <cmd.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-0.5 rounded border bg-muted font-mono text-xs text-muted-foreground">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">
                    ↵
                  </kbd>
                  Select
                </span>
              </div>
              <span>Flow Command Palette</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
