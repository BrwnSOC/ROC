"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  BarChart3,
  AlertTriangle,
  FileText,
  Globe,
  Shield,
  Users,
  Settings,
  Activity,
  BookOpen,
  Database,
  FileCheck,
  Bell,
  TrendingUp,
  Search,
  Clock,
  Target,
  Zap,
  ChevronRight,
  Home,
  Plus,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarData = {
  navMain: [
    {
      title: "Overview",
      icon: Home,
      url: "/dashboard",
      items: [],
    },
    {
      title: "Incident Management",
      icon: AlertTriangle,
      url: "/incidents",
      badge: "12",
      items: [
        { title: "Active Incidents", url: "/incidents/active", icon: Zap },
        { title: "Create Incident", url: "/incidents/create", icon: Plus },
        { title: "Incident Queue", url: "/incidents/queue", icon: Clock },
        { title: "Escalated", url: "/incidents/escalated", icon: TrendingUp },
      ],
    },
    {
      title: "Case Management",
      icon: FileText,
      url: "/cases",
      badge: "8",
      items: [
        { title: "Open Cases", url: "/cases/open", icon: Eye },
        { title: "My Cases", url: "/cases/mine", icon: Users },
        { title: "Case Templates", url: "/cases/templates", icon: FileCheck },
        { title: "Case Analytics", url: "/cases/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Threat Intelligence",
      icon: Globe,
      url: "/threats",
      items: [
        { title: "Threat Feed", url: "/threats/feed", icon: Activity },
        { title: "IOC Management", url: "/threats/ioc", icon: Target },
        { title: "Threat Hunting", url: "/threats/hunting", icon: Search },
        { title: "Attribution", url: "/threats/attribution", icon: Users },
      ],
    },
    {
      title: "Analytics & Reports",
      icon: BarChart3,
      url: "/analytics",
      items: [
        { title: "Security Metrics", url: "/analytics/metrics", icon: TrendingUp },
        { title: "Performance Reports", url: "/analytics/performance", icon: Activity },
        { title: "Compliance Reports", url: "/analytics/compliance", icon: FileCheck },
        { title: "Custom Dashboards", url: "/analytics/custom", icon: BarChart3 },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Asset Management",
      icon: Database,
      url: "/assets",
      items: [
        { title: "Asset Inventory", url: "/assets/inventory" },
        { title: "Vulnerability Scan", url: "/assets/vulnerabilities" },
        { title: "Asset Groups", url: "/assets/groups" },
      ],
    },
    {
      title: "Playbooks",
      icon: BookOpen,
      url: "/playbooks",
      items: [
        { title: "Response Playbooks", url: "/playbooks/response" },
        { title: "Investigation Guides", url: "/playbooks/investigation" },
        { title: "Automation Rules", url: "/playbooks/automation" },
      ],
    },
    {
      title: "User Management",
      icon: Users,
      url: "/users",
      items: [
        { title: "Team Members", url: "/users/team" },
        { title: "Roles & Permissions", url: "/users/roles" },
        { title: "Activity Logs", url: "/users/activity" },
      ],
    },
  ],
  navAdmin: [
    {
      title: "Alerts & Notifications",
      icon: Bell,
      url: "/alerts",
      badge: "3",
    },
    {
      title: "Audit Logs",
      icon: FileCheck,
      url: "/audit",
    },
    {
      title: "System Settings",
      icon: Settings,
      url: "/settings",
    },
  ],
}

interface SocSidebarProps {
  children: React.ReactNode
}

export function SocSidebar({ children }: SocSidebarProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarContent className="px-2 sm:px-3">
            <div className="flex items-center gap-2 px-2 sm:px-4 py-3 sm:py-4 border-b">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-bold text-foreground truncate">ROC</h1>
                <p className="text-xs text-muted-foreground -mt-0.5 sm:-mt-1 truncate">Security Operations</p>
              </div>
            </div>

            <SidebarGroup className="py-2 sm:py-3">
              <SidebarGroupLabel className="px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Operations
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarData.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.items.length > 0 ? (
                        <Collapsible defaultOpen={pathname.startsWith(item.url)}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={cn(
                                "w-full justify-between h-9 sm:h-10 px-2 sm:px-3 text-sm sm:text-base",
                                "hover:bg-accent transition-colors",
                                pathname.startsWith(item.url) && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="truncate font-medium">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {item.badge && (
                                  <Badge variant="secondary" className="h-4 sm:h-5 px-1 sm:px-1.5 text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-data-[state=open]:rotate-90" />
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-2 sm:ml-4 mt-1 space-y-1">
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(
                                      "h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
                                      "hover:bg-accent transition-colors",
                                      pathname === subItem.url && "bg-accent text-accent-foreground",
                                    )}
                                  >
                                    <Link href={subItem.url}>
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {subItem.icon && (
                                          <subItem.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                        )}
                                        <span className="truncate">{subItem.title}</span>
                                      </div>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "h-9 sm:h-10 px-2 sm:px-3 text-sm sm:text-base",
                            "hover:bg-accent transition-colors",
                            pathname === item.url && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href={item.url}>
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="truncate font-medium">{item.title}</span>
                            </div>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto h-4 sm:h-5 px-1 sm:px-1.5 text-xs flex-shrink-0"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-2 sm:my-3" />

            <SidebarGroup className="py-2 sm:py-3">
              <SidebarGroupLabel className="px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarData.navSecondary.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.items && item.items.length > 0 ? (
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              className={cn(
                                "w-full justify-between h-9 sm:h-10 px-2 sm:px-3 text-sm sm:text-base",
                                "hover:bg-accent transition-colors",
                                pathname.startsWith(item.url) && "bg-accent text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="truncate font-medium">{item.title}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-data-[state=open]:rotate-90 flex-shrink-0" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-2 sm:ml-4 mt-1 space-y-1">
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={cn(
                                      "h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
                                      "hover:bg-accent transition-colors",
                                      pathname === subItem.url && "bg-accent text-accent-foreground",
                                    )}
                                  >
                                    <Link href={subItem.url}>
                                      <span className="truncate">{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "h-9 sm:h-10 px-2 sm:px-3 text-sm sm:text-base",
                            "hover:bg-accent transition-colors",
                            pathname === item.url && "bg-accent text-accent-foreground",
                          )}
                        >
                          <Link href={item.url}>
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="truncate font-medium">{item.title}</span>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-2 sm:my-3" />

            <SidebarGroup className="py-2 sm:py-3">
              <SidebarGroupLabel className="px-2 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Administration
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarData.navAdmin.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "h-9 sm:h-10 px-2 sm:px-3 text-sm sm:text-base",
                          "hover:bg-accent transition-colors",
                          pathname === item.url && "bg-accent text-accent-foreground",
                        )}
                      >
                        <Link href={item.url}>
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="truncate font-medium">{item.title}</span>
                          </div>
                          {item.badge && (
                            <Badge
                              variant="destructive"
                              className="ml-auto h-4 sm:h-5 px-1 sm:px-1.5 text-xs flex-shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 sm:h-16 items-center gap-3 sm:gap-4 px-3 sm:px-4">
              <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
              <div className="flex-1 min-w-0" />
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-9">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9">
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-4 lg:p-6 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
