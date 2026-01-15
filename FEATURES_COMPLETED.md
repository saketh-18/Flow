# Flow Clone - Completed Features

## Phase 1: Issue Creation ✅

- ✅ Create issues modal with form validation
- ✅ Dialog accessibility (DialogDescription)
- ✅ Workflow states loading
- ✅ Issue form submission with auto-increment numbering
- ✅ React Query for client-side refetch on modal close
- ✅ Issues list display after creation

## Phase 2: Issue Options Menu ✅

- ✅ Copy Issue ID (e.g., "TEAM-123")
- ✅ Copy Link (copies full URL to clipboard)
- ✅ Open in New Tab (opens issue detail page in new window)
- ✅ Delete Issue (with confirmation dialog)
  - Note: DELETE RLS policy added to schema.sql - needs to be applied in Supabase dashboard

## Current Implementation Details

### Issue Card Component (`src/components/issues/issue-card.tsx`)

- Dropdown menu with 4 actions
- Copy actions use `navigator.clipboard.writeText()`
- Open in new tab uses `window.open(link, "_blank")`
- Delete uses `useDeleteIssue()` hook with confirmation
- All actions prevent event propagation to avoid triggering row click

### Delete Issue Hook (`src/hooks/use-issues.ts`)

- Mutation function calls Supabase DELETE endpoint
- Auto-invalidates all issue queries on success
- Refetches issues list automatically

### Database Changes

- Added DELETE RLS policy for issues in `supabase/schema.sql`
- Policy allows team members to delete issues they have access to
- Needs to be manually applied in Supabase dashboard (SQL editor)

---

## Next Iteration Features to Build

### 1. Issue Filtering & Search

- [ ] Filter issues by status/priority/assignee
- [ ] Search issues by title/description
- [ ] Saved filters

### 2. Issue Details Panel

- [ ] Show more detailed view in sidebar/modal
- [ ] Edit description with rich text editor
- [ ] View comments and activity feed
- [ ] Add issue relationships (blocks, related, duplicate)

### 3. Bulk Actions

- [ ] Select multiple issues
- [ ] Bulk change status
- [ ] Bulk add labels
- [ ] Bulk delete

### 4. Advanced Sorting & Grouping

- [ ] Group by multiple fields
- [ ] Custom sorting options
- [ ] Save view preferences

### 5. Issue Templates

- [ ] Create issue templates with predefined fields
- [ ] Template quick create

### 6. Notifications

- [ ] Issue assignment notifications
- [ ] Comment mentions
- [ ] Status change notifications

### 7. Projects & Cycles

- [ ] Create and manage projects
- [ ] Create and manage cycles/sprints
- [ ] Assign issues to cycles

### 8. Labels Management

- [ ] Create custom labels with colors
- [ ] Add/remove labels from issues
- [ ] Label-based filtering

### 9. Archived Issues

- [ ] Archive completed issues
- [ ] View archived issues
- [ ] Restore archived issues

### 10. Analytics & Reporting

- [ ] Issue velocity charts
- [ ] Burndown charts
- [ ] Team productivity metrics

---

## Database Schema Status

Tables Created:

- ✅ users
- ✅ workspaces
- ✅ workspace_members
- ✅ teams
- ✅ team_members
- ✅ workflow_states
- ✅ labels
- ✅ projects
- ✅ cycles
- ✅ issues
- ✅ issue_labels
- ✅ comments
- ✅ issue_history

RLS Policies Applied:

- ✅ SELECT/INSERT/UPDATE for issues
- ✅ DELETE for issues (added, needs Supabase sync)
- ✅ All other CRUD operations for related tables

---

## How to Apply Database Changes

To apply the DELETE policy for issues:

1. Go to Supabase Dashboard
2. Go to SQL Editor
3. Run the following:

```sql
CREATE POLICY "Team members can delete issues"
  ON issues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = issues.team_id AND wm.user_id = auth.uid()
    )
  );
```

---

## Tech Stack

- **Frontend**: Next.js 16.1.1, React, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form, Zod validation
- **State Management**: Zustand (UI state), React Query (server state)
- **Database**: Supabase PostgreSQL with RLS
- **Drag & Drop**: @dnd-kit (for board view)
- **Styling**: Tailwind CSS
