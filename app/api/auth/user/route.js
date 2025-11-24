import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(request) {
    // POST: Save or update user profile
    try {
        const client = await clientPromise;
        const db = client.db("social-app");
        const usersCollection = db.collection("users");
        
        const { userId, email, firstName, lastName, displayName } = await request.json();

        if (!userId || !email) {
            return NextResponse.json(
                { error: "User ID and email required" },
                { status: 400 }
            );
        }

        const profileData = {
            email,
            firstName: firstName || null,
            lastName: lastName || null,
            displayName: displayName || null, 
        };

        // Use updateOne with upsert: true for efficient 'find or create/update'
        await usersCollection.updateOne(
            { userId }, 
            {
                $set: {
                    ...profileData,
                    updatedAt: new Date()
                },
                $setOnInsert: { 
                    userId: userId,
                    createdAt: new Date(),
                    displayName: displayName || null 
                }
            },
            { upsert: true } 
        );

        // Fetch the saved/updated document to return the key data
        const savedUser = await usersCollection.findOne({ userId }, {
             projection: { _id: 0, userId: 1, email: 1, displayName: 1 }
        });

        return NextResponse.json({
            success: true,
            message: "User profile saved successfully",
            profile: savedUser 
        });

    } catch (error) {
        console.error("Save user error:", error);
        return NextResponse.json(
            { error: "Failed to save user profile" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    // GET: Fetch user profile by userId (Firebase UID)
    try {
        const client = await clientPromise;
        const db = client.db("social-app");
        const usersCollection = db.collection("users");
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 400 }
            );
        }

        const user = await usersCollection.findOne({ userId }, { 
            projection: { _id: 0 } 
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile: user });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Failed to get user profile" },
            { status: 500 }
        );
    }
}