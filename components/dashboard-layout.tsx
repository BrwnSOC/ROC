"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Search, Settings, User, LogOut, Activity, Wifi } from "lucide-react"
import { SocSidebar } from "@/components/soc-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SocSidebar>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Security Operations Center</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Monitor and respond to cybersecurity incidents across your organization
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-card/30 px-3 py-2 rounded-md border border-border/40">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span className="whitespace-nowrap">Real-time monitoring active</span>
          </div>
        </div>

        <div className="w-full sm:max-w-md lg:max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search incidents, cases, or commands..."
              className="pl-10 pr-4 bg-input/50 border-border/50 focus:roc-border-glow transition-all h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg bg-card/50 border border-border/40 roc-border-glow">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src="/professional-avatar.png" alt="Alex Brown" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">AB</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium truncate">Alex Brown</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Senior Security Analyst • Acme Security
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-sm">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content */}
        <div className="min-h-0 flex-1">{children}</div>

        <footer className="border-t border-border/40 bg-background/95 backdrop-blur rounded-lg p-3 sm:p-4 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>System Status:</span>
                <Badge variant="default" className="text-xs h-5">
                  <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  Operational
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Last updated:</span>
              <time className="font-mono">
                {new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>
        </footer>
      </div>
    </SocSidebar>
  )
}
