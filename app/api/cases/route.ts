import { type NextRequest, NextResponse } from "next/server"

// Mock case data store
const cases = [
  {
    id: "ROC-2025-001",
    title: "Phishing Campaign Investigation",
    description: "Comprehensive investigation into coordinated phishing campaign",
    status: "investigating",
    priority: "high",
    type: "Email Security",
    assignedTo: "Alex B.",
    reporter: "Sarah L.",
    createdDate: "2025-08-13",
    dueDate: "2025-08-20",
    progress: 65,
    tags: ["phishing", "finance", "email"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")
  const assignedTo = searchParams.get("assignedTo")

  let filteredCases = cases

  if (status) {
    filteredCases = filteredCases.filter((c) => c.status === status)
  }
  if (priority) {
    filteredCases = filteredCases.filter((c) => c.priority === priority)
  }
  if (assignedTo) {
    filteredCases = filteredCases.filter((c) => c.assignedTo === assignedTo)
  }

  return NextResponse.json({
    success: true,
    data: filteredCases,
    total: filteredCases.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const caseData = await request.json()

    const newCase = {
      id: `ROC-2025-${String(cases.length + 1).padStart(3, "0")}`,
      ...caseData,
      status: "open",
      createdDate: new Date().toISOString().slice(0, 10),
      progress: 0,
    }

    cases.push(newCase)

    return NextResponse.json({
      success: true,
      message: "Case created successfully",
      data: newCase,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create case" }, { status: 500 })
  }
}
