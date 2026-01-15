"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  LogOut,
  Loader2,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useWorkspaceStore } from "@/lib/store";

const settingsNav = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, currentWorkspace } = useWorkspaceStore();
  const [activeSection, setActiveSection] = React.useState("profile");
  const [isLoading, setIsLoading] = React.useState(false);

  // Profile form state
  const [displayName, setDisplayName] = React.useState(
    currentUser?.display_name || ""
  );
  const [email, setEmail] = React.useState(currentUser?.email || "");

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = (await (supabase.from("users") as any)
        .update({ display_name: displayName })
        .eq("id", currentUser.id)) as any;

      if (error) throw error;
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" showViewSwitcher={false} />

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Navigation */}
        <div className="w-56 border-r p-4">
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                size="sm"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-500/10"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Sign out
          </Button>
        </div>

        {/* Settings Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl p-6 space-y-6">
            {activeSection === "profile" && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your personal information
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar
                    fallback={currentUser?.display_name || currentUser?.email}
                    size="lg"
                  />
                  <Button variant="outline" size="sm">
                    Change avatar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display name</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input value={email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save changes
                  </Button>
                </div>
              </>
            )}

            {activeSection === "workspace" && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Workspace</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your workspace settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Workspace name
                    </label>
                    <Input
                      defaultValue={currentWorkspace?.name || ""}
                      placeholder="Workspace name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workspace URL</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        flow.app/
                      </span>
                      <Input
                        defaultValue={currentWorkspace?.slug || ""}
                        placeholder="workspace-slug"
                      />
                    </div>
                  </div>

                  <Button>Save changes</Button>
                </div>
              </>
            )}

            {activeSection === "appearance" && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Appearance</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how Flow looks
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Light
                      </Button>
                      <Button variant="outline" size="sm">
                        Dark
                      </Button>
                      <Button variant="secondary" size="sm">
                        System
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Notification settings coming soon.
                </p>
              </>
            )}

            {activeSection === "security" && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your security settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-1">Change password</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Update your password to keep your account secure
                    </p>
                    <Button variant="outline" size="sm">
                      Change password
                    </Button>
                  </div>

                  <div className="rounded-lg border border-red-200 dark:border-red-900 p-4">
                    <h3 className="font-medium text-red-600 mb-1">
                      Danger zone
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete your account and all data
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete account
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
