"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  trend: string
  icon: React.ReactNode
  description?: string
  status?: "critical" | "success" | "improvement" | "excellent" | "stable" | "warning"
}

export function KpiCard({ title, value, trend, icon, description, status = "stable" }: KpiCardProps) {
  const isPositiveTrend = trend.startsWith("+")
  const isNegativeTrend = trend.startsWith("-")
  const isNeutralTrend = !isPositiveTrend && !isNegativeTrend

  const statusIconColors = {
    critical: "text-destructive",
    success: "text-green-600",
    improvement: "text-primary",
    excellent: "text-green-600",
    stable: "text-muted-foreground",
    warning: "text-yellow-500",
  }

  const trendColor = isNeutralTrend ? "text-muted-foreground" : isPositiveTrend ? "text-green-600" : "text-red-600"

  const TrendIcon = isNeutralTrend ? Minus : isPositiveTrend ? TrendingUp : TrendingDown

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight truncate pr-2">
          {title}
        </CardTitle>
        <div className={cn("flex-shrink-0", statusIconColors[status])}>{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2 sm:line-clamp-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 self-start sm:self-end">
            <TrendIcon className={cn("h-3 w-3 flex-shrink-0", trendColor)} />
            <Badge
              variant="outline"
              className={cn("text-xs font-medium border-0 bg-transparent px-0 whitespace-nowrap", trendColor)}
            >
              {trend}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
