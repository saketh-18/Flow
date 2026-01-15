import { Issue } from "./database.types";

// Re-export database types
export * from "./database.types";

// UI State types
export interface SidebarState {
  isCollapsed: boolean;
  activeSection: string | null;
}

export interface CommandPaletteState {
  isOpen: boolean;
  mode: "default" | "create" | "search" | "ai";
}

export interface SelectionState {
  selectedIssueIds: string[];
  focusedIssueId: string | null;
}

// Filter types
export interface IssueFilters {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  labels?: string[];
  project?: string;
  cycle?: string;
  search?: string;
}

export interface ViewDisplayOptions {
  groupBy?: "status" | "priority" | "assignee" | "project" | "none";
  sortBy?: "created_at" | "updated_at" | "priority" | "due_date" | "sort_order";
  sortDirection?: "asc" | "desc";
  showSubIssues?: boolean;
  showCompletedIssues?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Action types for optimistic updates
export type IssueAction =
  | { type: "create"; payload: Issue }
  | { type: "update"; payload: Partial<Issue> & { id: string } }
  | { type: "delete"; payload: { id: string } }
  | { type: "reorder"; payload: { id: string; sortOrder: number } };

// Keyboard shortcut types
export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "shift" | "alt" | "meta")[];
  description: string;
  action: () => void;
  scope?: "global" | "issues" | "editor";
}

// AI types
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AISuggestion {
  type: "assignee" | "label" | "priority" | "project" | "duplicate";
  value: string;
  confidence: number;
  reason?: string;
}

export interface AITriageResult {
  suggestedAssignee?: string;
  suggestedLabels?: string[];
  suggestedPriority?: string;
  suggestedProject?: string;
  possibleDuplicates?: Array<{
    issueId: string;
    title: string;
    similarity: number;
  }>;
}
