"use client";

import * as React from "react";
import { Bell, HelpCircle, LayoutGrid, List, Menu, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUIStore, useWorkspaceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  teamKey?: string;
  showViewSwitcher?: boolean;
}

export function Header({
  title = "Issues",
  teamKey,
  showViewSwitcher = true,
}: HeaderProps) {
  const { currentView, setCurrentView, toggleSidebar, openCommandPalette } =
    useUIStore();
  const { currentUser } = useWorkspaceStore();

  return (
    <header className="flex h-12 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {teamKey && (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                {teamKey}
              </span>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          <h1 className="text-sm font-semibold">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {showViewSwitcher && (
          <>
            <div className="flex items-center rounded-md border p-0.5">
              <Button
                variant={currentView === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setCurrentView("list")}
                className="h-6 w-6"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={currentView === "board" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setCurrentView("board")}
                className="h-6 w-6"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={currentView === "timeline" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setCurrentView("timeline")}
                className="h-6 w-6"
              >
                <Timer className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6 mx-2" />
          </>
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => openCommandPalette()}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon-sm">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="ml-1">
              <Avatar
                src={currentUser?.avatar_url}
                fallback={
                  currentUser?.display_name || currentUser?.email || "U"
                }
                size="xs"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {currentUser?.display_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.email || "user@example.com"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openCommandPalette()}>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
