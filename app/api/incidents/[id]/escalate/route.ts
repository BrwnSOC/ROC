import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { escalationLevel, reason } = await request.json()
    const incidentId = params.id

    console.log(`Escalating incident ${incidentId} to ${escalationLevel}: ${reason}`)

    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Incident ${incidentId} escalated to ${escalationLevel}`,
      data: {
        incidentId,
        escalationLevel,
        reason,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to escalate incident" }, { status: 500 })
  }
}
