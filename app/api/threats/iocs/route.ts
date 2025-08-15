import { type NextRequest, NextResponse } from "next/server"

// Mock IOC data store
const iocs = [
  {
    id: "IOC-001",
    type: "ip",
    value: "192.168.1.100",
    confidence: 95,
    severity: "critical",
    source: "Internal Analysis",
    firstSeen: "2025-08-14 09:30",
    lastSeen: "2025-08-14 14:15",
    tags: ["c2", "malware", "apt"],
    description: "Command and control server for APT campaign",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const severity = searchParams.get("severity")
  const source = searchParams.get("source")

  let filteredIOCs = iocs

  if (type && type !== "all") {
    filteredIOCs = filteredIOCs.filter((ioc) => ioc.type === type)
  }
  if (severity) {
    filteredIOCs = filteredIOCs.filter((ioc) => ioc.severity === severity)
  }
  if (source) {
    filteredIOCs = filteredIOCs.filter((ioc) => ioc.source.toLowerCase().includes(source.toLowerCase()))
  }

  return NextResponse.json({
    success: true,
    data: filteredIOCs,
    total: filteredIOCs.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const iocData = await request.json()

    const newIOC = {
      id: `IOC-${String(iocs.length + 1).padStart(3, "0")}`,
      ...iocData,
      firstSeen: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastSeen: new Date().toISOString().slice(0, 16).replace("T", " "),
    }

    iocs.push(newIOC)

    return NextResponse.json({
      success: true,
      message: "IOC created successfully",
      data: newIOC,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create IOC" }, { status: 500 })
  }
}
