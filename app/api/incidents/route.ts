import { type NextRequest, NextResponse } from "next/server"

// Mock incident data store
const incidents = [
  {
    id: "INC-2025-001",
    title: "Phishing Email Detected",
    description: "Suspicious email campaign targeting finance department",
    severity: "critical",
    status: "open",
    type: "Phishing",
    assignedTo: "Alex B.",
    reporter: "System Alert",
    timestamp: "2025-08-14 14:22",
    lastUpdated: "2025-08-14 14:22",
    tags: ["email", "credentials", "finance"],
    priority: 1,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const severity = searchParams.get("severity")
  const assignedTo = searchParams.get("assignedTo")

  let filteredIncidents = incidents

  if (status) {
    filteredIncidents = filteredIncidents.filter((i) => i.status === status)
  }
  if (severity) {
    filteredIncidents = filteredIncidents.filter((i) => i.severity === severity)
  }
  if (assignedTo) {
    filteredIncidents = filteredIncidents.filter((i) => i.assignedTo === assignedTo)
  }

  return NextResponse.json({
    success: true,
    data: filteredIncidents,
    total: filteredIncidents.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const incidentData = await request.json()

    const newIncident = {
      id: `INC-2025-${String(incidents.length + 1).padStart(3, "0")}`,
      ...incidentData,
      status: "open",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      reporter: "API",
    }

    incidents.push(newIncident)

    return NextResponse.json({
      success: true,
      message: "Incident created successfully",
      data: newIncident,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create incident" }, { status: 500 })
  }
}
