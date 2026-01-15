"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Search,
  Plus,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react";

interface IssueHeaderProps {
  title: string;
  issueCount: number;
  viewMode: "list" | "board";
  onViewModeChange: (mode: "list" | "board") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateIssue: () => void;
  onSaveView?: () => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  children?: React.ReactNode;
}

const sortOptions = [
  { value: "updated", label: "Last updated" },
  { value: "created", label: "Created date" },
  { value: "priority", label: "Priority" },
  { value: "manual", label: "Manual" },
];

export function IssueHeader({
  title,
  issueCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onCreateIssue,
  onSaveView,
  showFilters,
  onToggleFilters,
  children,
}: IssueHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Title and count */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{title}</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {issueCount}
          </span>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="w-64 pl-9 h-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Toggle filters */}
          {onToggleFilters && (
            <Button
              variant={showFilters ? "secondary" : "ghost"}
              size="sm"
              onClick={onToggleFilters}
              className="h-9"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filter
            </Button>
          )}

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={onSortChange}
              >
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View mode toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-r-none"
              onClick={() => onViewModeChange("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "board" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-l-none"
              onClick={() => onViewModeChange("board")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Save view */}
          {onSaveView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveView}
              className="h-9"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}

          {/* Create issue */}
          <Button size="sm" onClick={onCreateIssue} className="h-9">
            <Plus className="h-4 w-4 mr-1" />
            New issue
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      {children && showFilters && (
        <div className="px-6 pb-3 pt-1">{children}</div>
      )}
    </div>
  );
}
