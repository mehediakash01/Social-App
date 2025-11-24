import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { userId, email, firstName, lastName, displayName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email required" },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {
      // Update existing user
      await usersCollection.updateOne(
        { userId },
        {
          $set: {
            firstName,
            lastName,
            displayName,
            email,
            updatedAt: new Date()
          }
        }
      );
    } else {
      // Create new user
      await usersCollection.insertOne({
        userId,
        email,
        firstName,
        lastName,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: "User profile saved successfully"
    });
  } catch (error) {
    console.error("Save user error:", error);
    return NextResponse.json(
      { error: "Failed to save user profile" },
      { status: 500 }
    );
  }
}

// Get user profile
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to get user profile" },
      { status: 500 }
    );
  }
}