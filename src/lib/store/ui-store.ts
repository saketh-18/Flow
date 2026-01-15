import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SidebarState,
  CommandPaletteState,
  SelectionState,
  IssueFilters,
  ViewDisplayOptions,
} from "@/types";

interface UIStore {
  // Sidebar state
  sidebar: SidebarState;
  toggleSidebar: () => void;
  setSidebarSection: (section: string | null) => void;

  // Command palette state
  commandPalette: CommandPaletteState;
  openCommandPalette: (mode?: CommandPaletteState["mode"]) => void;
  closeCommandPalette: () => void;

  // Selection state
  selection: SelectionState;
  selectIssue: (id: string, multi?: boolean) => void;
  deselectIssue: (id: string) => void;
  clearSelection: () => void;
  setFocusedIssue: (id: string | null) => void;

  // View state
  currentView: "list" | "board" | "timeline";
  setCurrentView: (view: "list" | "board" | "timeline") => void;

  // Filters
  filters: IssueFilters;
  setFilters: (filters: IssueFilters) => void;
  clearFilters: () => void;

  // Display options
  displayOptions: ViewDisplayOptions;
  setDisplayOptions: (options: Partial<ViewDisplayOptions>) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Issue detail panel
  isIssuePanelOpen: boolean;
  selectedIssueId: string | null;
  openIssuePanel: (issueId: string) => void;
  closeIssuePanel: () => void;

  // Create issue modal
  isCreateIssueOpen: boolean;
  openCreateIssue: () => void;
  closeCreateIssue: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Sidebar
      sidebar: {
        isCollapsed: false,
        activeSection: null,
      },
      toggleSidebar: () =>
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isCollapsed: !state.sidebar.isCollapsed,
          },
        })),
      setSidebarSection: (section) =>
        set((state) => ({
          sidebar: { ...state.sidebar, activeSection: section },
        })),

      // Command palette
      commandPalette: {
        isOpen: false,
        mode: "default",
      },
      openCommandPalette: (mode = "default") =>
        set({ commandPalette: { isOpen: true, mode } }),
      closeCommandPalette: () =>
        set({ commandPalette: { isOpen: false, mode: "default" } }),

      // Selection
      selection: {
        selectedIssueIds: [],
        focusedIssueId: null,
      },
      selectIssue: (id, multi = false) =>
        set((state) => ({
          selection: {
            ...state.selection,
            selectedIssueIds: multi
              ? [...state.selection.selectedIssueIds, id]
              : [id],
            focusedIssueId: id,
          },
        })),
      deselectIssue: (id) =>
        set((state) => ({
          selection: {
            ...state.selection,
            selectedIssueIds: state.selection.selectedIssueIds.filter(
              (i) => i !== id
            ),
          },
        })),
      clearSelection: () =>
        set((state) => ({
          selection: { ...state.selection, selectedIssueIds: [] },
        })),
      setFocusedIssue: (id) =>
        set((state) => ({
          selection: { ...state.selection, focusedIssueId: id },
        })),

      // View
      currentView: "list",
      setCurrentView: (view) => set({ currentView: view }),

      // Filters
      filters: {},
      setFilters: (filters) => set({ filters }),
      clearFilters: () => set({ filters: {} }),

      // Display options
      displayOptions: {
        groupBy: "status",
        sortBy: "sort_order",
        sortDirection: "asc",
        showSubIssues: true,
        showCompletedIssues: true,
      },
      setDisplayOptions: (options) =>
        set((state) => ({
          displayOptions: { ...state.displayOptions, ...options },
        })),

      // Theme
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Issue panel
      isIssuePanelOpen: false,
      selectedIssueId: null,
      openIssuePanel: (issueId) =>
        set({ isIssuePanelOpen: true, selectedIssueId: issueId }),
      closeIssuePanel: () =>
        set({ isIssuePanelOpen: false, selectedIssueId: null }),

      // Create issue
      isCreateIssueOpen: false,
      openCreateIssue: () => set({ isCreateIssueOpen: true }),
      closeCreateIssue: () => set({ isCreateIssueOpen: false }),
    }),
    {
      name: "flow-ui-storage",
      partialize: (state) => ({
        sidebar: state.sidebar,
        theme: state.theme,
        displayOptions: state.displayOptions,
        currentView: state.currentView,
      }),
    }
  )
);
