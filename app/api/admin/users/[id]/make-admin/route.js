import { NextResponse } from "next/server"
import { makeUserAdmin } from "../../../../../../lib/admin"

export async function POST(request, { params }) {
  try {
    const success = await makeUserAdmin(params.id)

    if (success) {
      return NextResponse.json({ message: "User successfully made admin" })
    } else {
      return NextResponse.json({ error: "Failed to make user admin" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in make admin API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
