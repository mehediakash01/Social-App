import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function PATCH(request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }

    const validRoles = ["Super Admin", "Moderator", "Regular User", "Guest"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { userId },
      { $set: { role, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Role updated successfully", role });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
