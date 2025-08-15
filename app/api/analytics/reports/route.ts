import { type NextRequest, NextResponse } from "next/server"

// Mock reports data store
const reports = [
  {
    id: "RPT-001",
    name: "Daily Security Summary",
    type: "security",
    description: "Daily overview of security incidents, threats, and response metrics",
    schedule: "daily",
    lastGenerated: "2025-08-14 06:00",
    status: "active",
    recipients: ["security-team@company.com", "ciso@company.com"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")

  let filteredReports = reports

  if (type) {
    filteredReports = filteredReports.filter((report) => report.type === type)
  }
  if (status) {
    filteredReports = filteredReports.filter((report) => report.status === status)
  }

  return NextResponse.json({
    success: true,
    data: filteredReports,
    total: filteredReports.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    const newReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
      ...reportData,
      lastGenerated: "Never",
      status: "active",
    }

    reports.push(newReport)

    return NextResponse.json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create report" }, { status: 500 })
  }
}
