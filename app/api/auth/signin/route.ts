import { type NextRequest, NextResponse } from "next/server"

interface SigninRequest {
  email: string
  password: string
  rememberMe?: boolean
}

// Mock user database - in a real app, this would be a proper database
const mockUsers = [
  {
    id: "user_1",
    fullName: "Alex Brown",
    email: "user@example.com",
    password: "password", // In real app, this would be hashed
    organization: "ROC Security",
    createdAt: "2025-01-01T00:00:00.000Z",
    verified: true,
  },
  {
    id: "user_2",
    fullName: "Demo User",
    email: "demo@roc.com",
    password: "demo123",
    organization: "Demo Organization",
    createdAt: "2025-01-01T00:00:00.000Z",
    verified: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body: SigninRequest = await request.json()
    const { email, password, rememberMe } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user in mock database
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password (in real app, you'd compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if account is verified
    if (!user.verified) {
      return NextResponse.json({ error: "Please verify your email address before signing in" }, { status: 403 })
    }

    // Create session data (in real app, you'd create JWT token or session)
    const sessionData = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      organization: user.organization,
      rememberMe,
      loginTime: new Date().toISOString(),
    }

    // In a real app, you'd set secure HTTP-only cookies or return JWT token
    const response = NextResponse.json(
      {
        success: true,
        message: "Sign in successful",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          organization: user.organization,
        },
        redirectTo: "/dashboard",
      },
      { status: 200 },
    )

    // Set a simple session cookie (in real app, use secure session management)
    response.cookies.set("roc-session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
    })

    return response
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
