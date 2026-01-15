-- Flow Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Workspace Members (junction table)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL, -- Short identifier like "ENG", "DES"
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(workspace_id, key)
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Workflow States (per team)
CREATE TABLE IF NOT EXISTS workflow_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('backlog', 'unstarted', 'started', 'completed', 'canceled')),
  color TEXT DEFAULT '#6b7280',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Labels (per team)
CREATE TABLE IF NOT EXISTS labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, name)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'paused', 'completed', 'canceled')),
  lead_id UUID REFERENCES users(id) ON DELETE SET NULL,
  start_date DATE,
  target_date DATE,
  sort_order DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cycles (Sprints)
CREATE TABLE IF NOT EXISTS cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Issues
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'none' CHECK (priority IN ('none', 'low', 'medium', 'high', 'urgent')),
  state_id UUID NOT NULL REFERENCES workflow_states(id) ON DELETE RESTRICT,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  cycle_id UUID REFERENCES cycles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  estimate INTEGER CHECK (estimate >= 0 AND estimate <= 21),
  due_date DATE,
  sort_order DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(team_id, number)
);

-- Issue Labels (junction table)
CREATE TABLE IF NOT EXISTS issue_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(issue_id, label_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity Log
CREATE TABLE IF NOT EXISTS issue_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_workspace ON teams(workspace_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_states_team ON workflow_states(team_id);
CREATE INDEX IF NOT EXISTS idx_labels_team ON labels(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_team ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_cycles_team ON cycles(team_id);
CREATE INDEX IF NOT EXISTS idx_issues_team ON issues(team_id);
CREATE INDEX IF NOT EXISTS idx_issues_state ON issues(state_id);
CREATE INDEX IF NOT EXISTS idx_issues_assignee ON issues(assignee_id);
CREATE INDEX IF NOT EXISTS idx_issues_project ON issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_cycle ON issues(cycle_id);
CREATE INDEX IF NOT EXISTS idx_issues_parent ON issues(parent_id);
CREATE INDEX IF NOT EXISTS idx_issue_labels_issue ON issue_labels(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_labels_label ON issue_labels(label_id);
CREATE INDEX IF NOT EXISTS idx_comments_issue ON comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_history_issue ON issue_history(issue_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users: Can read their own data, and data of users in same workspace
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can read workspace members"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm1
      JOIN workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
      WHERE wm1.user_id = auth.uid() AND wm2.user_id = users.id
    )
  );

-- Workspaces: minimal policies to allow creation and basic access
-- Read: any authenticated user (we can tighten later if needed)
CREATE POLICY "Users can read workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Insert: allow any authenticated user to create a workspace
CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update: owners/admins only
CREATE POLICY "Workspace owners/admins can update workspace"
  ON workspaces FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Delete: owners/admins only
CREATE POLICY "Workspace owners/admins can delete workspace"
  ON workspaces FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Workspace Members: minimal policies to avoid recursion
-- Read: allow authenticated users to read (safe enough for now, adjust later)
CREATE POLICY "Workspace members can read"
  ON workspace_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Insert: a user can insert their own membership row
CREATE POLICY "Users can insert self membership"
  ON workspace_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Update: a user can update their own membership row
CREATE POLICY "Users can update own membership"
  ON workspace_members FOR UPDATE
  USING (user_id = auth.uid());

-- Delete: a user can delete their own membership row
CREATE POLICY "Users can delete own membership"
  ON workspace_members FOR DELETE
  USING (user_id = auth.uid());

-- Teams: Workspace members can read, team leads can update
CREATE POLICY "Workspace members can read teams"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = teams.workspace_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage teams"
  ON teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = teams.workspace_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Team Members
CREATE POLICY "Workspace members can read team members"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = team_members.team_id AND wm.user_id = auth.uid()
    )
  );

-- Workflow States: Team members can read
CREATE POLICY "Team members can read workflow states"
  ON workflow_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = workflow_states.team_id AND wm.user_id = auth.uid()
    )
  );

-- Workflow States: Workspace members can create (needed during team setup)
CREATE POLICY "Workspace members can create workflow states"
  ON workflow_states FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = workflow_states.team_id AND wm.user_id = auth.uid()
    )
  );

-- Workflow States: Workspace admins can update/delete
CREATE POLICY "Workspace admins can manage workflow states"
  ON workflow_states FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = workflow_states.team_id 
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Workspace admins can delete workflow states"
  ON workflow_states FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = workflow_states.team_id 
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

-- Labels: Team members can read
CREATE POLICY "Team members can read labels"
  ON labels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = labels.team_id AND wm.user_id = auth.uid()
    )
  );

-- Labels: Workspace members can create (needed during team setup)
CREATE POLICY "Workspace members can create labels"
  ON labels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = labels.team_id AND wm.user_id = auth.uid()
    )
  );

-- Projects: Team members can read
CREATE POLICY "Team members can read projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = projects.team_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = projects.team_id AND wm.user_id = auth.uid()
    )
  );

-- Cycles: Team members can read
CREATE POLICY "Team members can read cycles"
  ON cycles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = cycles.team_id AND wm.user_id = auth.uid()
    )
  );

-- Issues: Team members can read and create
CREATE POLICY "Team members can read issues"
  ON issues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = issues.team_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create issues"
  ON issues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = issues.team_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can update issues"
  ON issues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = issues.team_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can delete issues"
  ON issues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM teams t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE t.id = issues.team_id AND wm.user_id = auth.uid()
    )
  );

-- Issue Labels
CREATE POLICY "Team members can read issue labels"
  ON issue_labels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM issues i
      JOIN teams t ON t.id = i.team_id
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE i.id = issue_labels.issue_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can manage issue labels"
  ON issue_labels FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM issues i
      JOIN teams t ON t.id = i.team_id
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE i.id = issue_labels.issue_id AND wm.user_id = auth.uid()
    )
  );

-- Comments
CREATE POLICY "Team members can read comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM issues i
      JOIN teams t ON t.id = i.team_id
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE i.id = comments.issue_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM issues i
      JOIN teams t ON t.id = i.team_id
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE i.id = comments.issue_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (user_id = auth.uid());

-- Issue History
CREATE POLICY "Team members can read issue history"
  ON issue_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM issues i
      JOIN teams t ON t.id = i.team_id
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE i.id = issue_history.issue_id AND wm.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_workflow_states_updated_at
  BEFORE UPDATE ON workflow_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cycles_updated_at
  BEFORE UPDATE ON cycles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to generate issue number per team
CREATE OR REPLACE FUNCTION generate_issue_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(number), 0) + 1 INTO NEW.number
  FROM issues
  WHERE team_id = NEW.team_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_issue_number_trigger
  BEFORE INSERT ON issues
  FOR EACH ROW
  WHEN (NEW.number IS NULL)
  EXECUTE FUNCTION generate_issue_number();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, display_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to log issue changes
CREATE OR REPLACE FUNCTION log_issue_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.title != NEW.title THEN
    INSERT INTO issue_history (issue_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'title', OLD.title, NEW.title);
  END IF;
  
  IF OLD.state_id != NEW.state_id THEN
    INSERT INTO issue_history (issue_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'state_id', OLD.state_id::text, NEW.state_id::text);
  END IF;
  
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO issue_history (issue_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'priority', OLD.priority, NEW.priority);
  END IF;
  
  IF OLD.assignee_id IS DISTINCT FROM NEW.assignee_id THEN
    INSERT INTO issue_history (issue_id, user_id, field, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'assignee_id', OLD.assignee_id::text, NEW.assignee_id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_issue_changes_trigger
  AFTER UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION log_issue_changes();

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================
-- Seed data is disabled by default
-- Each user creates their own workspace through the onboarding flow
-- Uncomment below if you need to add demo data for testing


-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for issues table
ALTER PUBLICATION supabase_realtime ADD TABLE issues;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE issue_history;
