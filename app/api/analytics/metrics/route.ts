import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "6months"
  const metric = searchParams.get("metric")

  // Mock metrics data
  const metricsData = {
    incidents: {
      total: 294,
      resolved: 283,
      resolutionRate: 96.2,
      avgResponseTime: 3.8,
      trend: "+2.1%",
    },
    performance: {
      mttd: 12, // minutes
      mttr: 3.7, // minutes
      mttr_hours: 2.4, // hours
      falsePositiveRate: 8.2,
      analystUtilization: 87,
      escalationRate: 15,
    },
    compliance: {
      overall: 95,
      frameworks: {
        "SOC 2": 98,
        "ISO 27001": 95,
        "NIST CSF": 92,
        GDPR: 89,
        HIPAA: 96,
      },
    },
    trends: [
      { period: "Jan", incidents: 45, resolved: 42, responseTime: 4.2, threatLevel: 3, complianceScore: 94 },
      { period: "Feb", incidents: 52, resolved: 48, responseTime: 3.8, threatLevel: 4, complianceScore: 96 },
      { period: "Mar", incidents: 38, resolved: 36, responseTime: 4.1, threatLevel: 2, complianceScore: 93 },
      { period: "Apr", incidents: 61, resolved: 58, responseTime: 3.5, threatLevel: 5, complianceScore: 97 },
      { period: "May", incidents: 43, resolved: 41, responseTime: 4.0, threatLevel: 3, complianceScore: 95 },
      { period: "Jun", incidents: 55, resolved: 52, responseTime: 3.7, threatLevel: 4, complianceScore: 98 },
    ],
  }

  if (metric) {
    return NextResponse.json({
      success: true,
      data: metricsData[metric as keyof typeof metricsData] || null,
      timeRange,
    })
  }

  return NextResponse.json({
    success: true,
    data: metricsData,
    timeRange,
  })
}
