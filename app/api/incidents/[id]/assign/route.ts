import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { assignedTo } = await request.json()
    const incidentId = params.id

    console.log(`Assigning incident ${incidentId} to ${assignedTo}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Incident ${incidentId} assigned to ${assignedTo}`,
      data: {
        incidentId,
        assignedTo,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to assign incident" }, { status: 500 })
  }
}
