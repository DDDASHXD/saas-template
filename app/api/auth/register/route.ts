import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { getDb } from "@/lib/mongodb"

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: "User created" },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
