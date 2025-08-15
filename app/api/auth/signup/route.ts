import { type NextRequest, NextResponse } from "next/server"

interface SignupRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  organization: string
}

const mockUsers: Array<{
  id: string
  fullName: string
  email: string
  password: string
  organization: string
  createdAt: string
  verified: boolean
}> = [
  {
    id: "user_1",
    fullName: "Alex Brown",
    email: "user@example.com",
    password: "password",
    organization: "ROC Security",
    createdAt: "2025-01-01T00:00:00.000Z",
    verified: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()

    // Validate required fields
    const { fullName, email, password, confirmPassword, organization } = body

    if (!fullName || !email || !password || !confirmPassword || !organization) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const newUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password, // In real app, hash this password
      organization,
      createdAt: new Date().toISOString(),
      verified: true, // Auto-verify for demo purposes
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          organization: newUser.organization,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
