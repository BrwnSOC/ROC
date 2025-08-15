"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Wifi, Database, Server, Globe, Lock } from "lucide-react"
import { useEffect, useState } from "react"

interface SystemMetric {
  name: string
  value: number
  status: "healthy" | "warning" | "critical"
  icon: React.ReactNode
  unit?: string
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: "Network Traffic", value: 78, status: "healthy", icon: <Wifi className="w-4 h-4" />, unit: "%" },
    { name: "Database Load", value: 45, status: "healthy", icon: <Database className="w-4 h-4" />, unit: "%" },
    { name: "Server CPU", value: 92, status: "warning", icon: <Server className="w-4 h-4" />, unit: "%" },
    { name: "API Endpoints", value: 99.8, status: "healthy", icon: <Globe className="w-4 h-4" />, unit: "%" },
    { name: "Security Events", value: 156, status: "warning", icon: <Lock className="w-4 h-4" />, unit: "/hr" },
    { name: "System Health", value: 94, status: "healthy", icon: <Activity className="w-4 h-4" />, unit: "%" },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            metric.name === "Security Events"
              ? Math.floor(Math.random() * 200) + 100
              : Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
            Critical
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Real-Time System Metrics</CardTitle>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-3 p-3 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={getStatusColor(metric.status)}>{metric.icon}</div>
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                {getStatusBadge(metric.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value.toFixed(metric.unit === "/hr" ? 0 : 1)}
                    <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                  </span>
                </div>

                {metric.unit === "%" && <Progress value={metric.value} className="h-2" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
