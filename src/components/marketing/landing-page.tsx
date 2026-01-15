"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Command,
  Zap,
  GitBranch,
  BarChart3,
  Users,
  Layers,
  Timer,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Header Component
function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-white text-lg">Flow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#method"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Method
            </Link>
            <Link
              href="#customers"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Customers
            </Link>
            <Link
              href="#changelog"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Changelog
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-zinc-200 font-medium px-4"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0b]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-6"
        >
          Flow is a better way
          <br />
          <span className="text-zinc-500">to build products</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Meet the new standard for modern software development.
          <br className="hidden md:block" />
          Streamline issues, sprints, and product roadmaps.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 h-12 text-base font-medium"
            >
              Start building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Keyboard shortcut hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-2 text-sm text-zinc-600"
        >
          <kbd className="px-2 py-1 bg-zinc-800/50 rounded border border-zinc-700/50 text-xs font-mono">
            ⌘
          </kbd>
          <kbd className="px-2 py-1 bg-zinc-800/50 rounded border border-zinc-700/50 text-xs font-mono">
            K
          </kbd>
          <span className="ml-1">to open command palette</span>
        </motion.div>
      </div>
    </section>
  );
}

// App Preview Section
function AppPreviewSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative bg-[#0a0a0b] pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div style={{ y, opacity }} className="relative">
          {/* Glow effect behind the preview */}
          <div className="absolute -inset-10 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-3xl blur-3xl" />

          {/* App preview mockup */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl">
            {/* Window controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded bg-zinc-800 text-xs text-zinc-500">
                  Flow — My Workspace
                </div>
              </div>
            </div>

            {/* App interface mockup */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-56 border-r border-zinc-800 p-3 bg-zinc-900/30">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-4">
                  <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                    M
                  </div>
                  <span className="text-sm text-white font-medium">
                    My Team
                  </span>
                </div>

                <div className="space-y-0.5">
                  {[
                    { label: "Issues", active: true },
                    { label: "Cycles" },
                    { label: "Projects" },
                    { label: "Views" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-2 py-1.5 rounded text-sm ${
                        item.active
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content - Kanban board */}
              <div className="flex-1 p-6 bg-zinc-950/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-white">
                    Active Issues
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded bg-zinc-800 text-xs text-zinc-400">
                      Filter
                    </div>
                    <div className="px-3 py-1.5 rounded bg-zinc-800 text-xs text-zinc-400">
                      View
                    </div>
                  </div>
                </div>

                {/* Kanban columns */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: "Backlog", count: 12, color: "zinc" },
                    { name: "Todo", count: 8, color: "zinc" },
                    { name: "In Progress", count: 4, color: "yellow" },
                    { name: "Done", count: 23, color: "green" },
                  ].map((col) => (
                    <div key={col.name} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            col.color === "yellow"
                              ? "bg-yellow-500"
                              : col.color === "green"
                              ? "bg-green-500"
                              : "bg-zinc-600"
                          }`}
                        />
                        <span className="text-xs text-zinc-400 font-medium">
                          {col.name}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {col.count}
                        </span>
                      </div>

                      {/* Issue cards */}
                      <div className="space-y-2">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                          >
                            <div className="text-xs text-zinc-600 mb-1">
                              FLO-{col.count + i}
                            </div>
                            <div className="text-sm text-zinc-300 mb-2 line-clamp-1">
                              {col.name === "In Progress"
                                ? "Add user authentication flow"
                                : col.name === "Done"
                                ? "Setup database schema"
                                : "Implement feature request"}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-indigo-500/20" />
                              <span className="text-xs text-zinc-600">
                                High
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Built for speed",
      description:
        "Optimized for teams that ship. Fast search, filters, and commands to maximize your productivity.",
    },
    {
      icon: Command,
      title: "Keyboard first",
      description:
        "Navigate anywhere in seconds. Full keyboard shortcuts for power users who prefer keys over clicks.",
    },
    {
      icon: GitBranch,
      title: "Git integration",
      description:
        "Sync with GitHub and GitLab. Automatically link issues to PRs and track deployments.",
    },
    {
      icon: BarChart3,
      title: "Insights & analytics",
      description:
        "Track team velocity, cycle time, and project health with real-time dashboards.",
    },
    {
      icon: Users,
      title: "Built for teams",
      description:
        "Collaborate seamlessly with teammates. Real-time updates, comments, and @mentions.",
    },
    {
      icon: Layers,
      title: "Flexible workflows",
      description:
        "Customize issue states, labels, and priorities to match how your team works.",
    },
  ];

  return (
    <section id="features" className="bg-[#0a0a0b] py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-indigo-400 text-sm font-medium mb-4"
          >
            FEATURES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-medium text-white tracking-tight"
          >
            Everything you need
          </motion.h2>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <feature.icon className="w-5 h-5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Workflow Section
function WorkflowSection() {
  return (
    <section className="bg-[#0a0a0b] py-32 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-indigo-400 text-sm font-medium mb-4"
            >
              WORKFLOW
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6"
            >
              Issue tracking
              <br />
              <span className="text-zinc-500">that just works</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg leading-relaxed mb-8"
            >
              Create issues in seconds. Organize them with projects and cycles.
              Track progress with a beautiful board view or list view.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {[
                "Instant issue creation with markdown support",
                "Automatic backlinks to related issues",
                "Custom fields and issue templates",
                "Time tracking and estimates",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-2xl" />
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
              {/* Issue form mockup */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
                    <Timer className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-zinc-400 text-sm">New Issue</span>
                </div>

                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="text-sm text-white mb-1">
                    Add user authentication
                  </div>
                  <div className="text-xs text-zinc-500">
                    Implement OAuth with Google and GitHub providers
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    High Priority
                  </div>
                  <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
                    Feature
                  </div>
                  <div className="px-2 py-1 rounded bg-zinc-700/50 text-xs text-zinc-400">
                    In Progress
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                    <span className="text-xs text-zinc-400">
                      Assigned to you
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600">FLO-142</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { value: "10k+", label: "Teams using Flow" },
    { value: "2M+", label: "Issues tracked" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "50ms", label: "Average response" },
  ];

  return (
    <section className="bg-[#0a0a0b] py-24 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-semibold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="bg-[#0a0a0b] py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-6"
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-400 mb-10"
        >
          Join thousands of teams already using Flow.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 h-12 text-base font-medium"
            >
              Start for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 bg-transparent hover:bg-white/5 text-white px-6 h-12 text-base"
            >
              Talk to sales
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#0a0a0b] border-t border-zinc-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-white">Flow</span>
            </Link>
            <p className="text-sm text-zinc-500">
              The issue tracker for modern teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "Integrations", "Pricing", "Changelog"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {["Documentation", "API", "Status", "Support"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Privacy", "Terms", "Security"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Flow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page Component
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white antialiased">
      <Header />
      <main>
        <HeroSection />
        <AppPreviewSection />
        <FeaturesSection />
        <WorkflowSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
