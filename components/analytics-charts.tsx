"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, Shield, AlertTriangle, Clock } from "lucide-react"

const incidentTrendData = [
  { time: "00:00", incidents: 12, resolved: 8 },
  { time: "04:00", incidents: 8, resolved: 12 },
  { time: "08:00", incidents: 24, resolved: 18 },
  { time: "12:00", incidents: 32, resolved: 28 },
  { time: "16:00", incidents: 18, resolved: 22 },
  { time: "20:00", incidents: 14, resolved: 16 },
]

const threatTypeData = [
  { name: "Malware", value: 35, color: "#ef4444" },
  { name: "Phishing", value: 28, color: "#f97316" },
  { name: "DDoS", value: 18, color: "#eab308" },
  { name: "Insider", value: 12, color: "#22c55e" },
  { name: "Other", value: 7, color: "#6366f1" },
]

const responseTimeData = [
  { day: "Mon", avgTime: 4.2, target: 5.0 },
  { day: "Tue", avgTime: 3.8, target: 5.0 },
  { day: "Wed", avgTime: 5.1, target: 5.0 },
  { day: "Thu", avgTime: 3.5, target: 5.0 },
  { day: "Fri", avgTime: 4.8, target: 5.0 },
  { day: "Sat", avgTime: 2.9, target: 5.0 },
  { day: "Sun", avgTime: 3.2, target: 5.0 },
]

const securityPostureData = [
  { metric: "Patch Level", score: 94 },
  { metric: "Access Control", score: 87 },
  { metric: "Network Security", score: 91 },
  { metric: "Data Protection", score: 89 },
  { metric: "Incident Response", score: 96 },
]

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Incident Trends */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">24-Hour Incident Trends</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#00E0FF]" />
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              incidents: { label: "New Incidents", color: "#ef4444" },
              resolved: { label: "Resolved", color: "#22c55e" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incidentTrendData}>
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="2"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Threat Distribution */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Threat Types</CardTitle>
          <AlertTriangle className="h-4 w-4 text-[#00FFC6]" />
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              threats: { label: "Threats" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {threatTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Time Analysis */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Response Time Analysis</CardTitle>
          <Clock className="h-4 w-4 text-[#9B6BFF]" />
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              avgTime: { label: "Avg Response Time", color: "#00E0FF" },
              target: { label: "Target", color: "#6b7280" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgTime" fill="#00E0FF" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="#6b7280" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Security Posture */}
      <Card className="roc-border-glow bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Security Posture</CardTitle>
          <Shield className="h-4 w-4 text-[#00FFC6]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityPostureData.map((item) => (
              <div key={item.metric} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.metric}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#00E0FF] to-[#00FFC6]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
