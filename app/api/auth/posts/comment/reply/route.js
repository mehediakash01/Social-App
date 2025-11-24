import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Add a reply to a comment
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { postId, parentCommentId, userId, userName, content } = await request.json();

    if (!postId || !parentCommentId || !userId || !content) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const commentsCollection = db.collection("comments");

    // Create reply
    const reply = {
      postId,
      parentCommentId,
      userId,
      userName: userName || userId,
      content,
      likesCount: 0,
      repliesCount: 0,
      createdAt: new Date()
    };

    const result = await commentsCollection.insertOne(reply);
    reply._id = result.insertedId;

    // Increment parent comment's reply count
    await commentsCollection.updateOne(
      { _id: new ObjectId(parentCommentId) },
      { $inc: { repliesCount: 1 } }
    );

    return NextResponse.json({
      reply,
      message: "Reply added successfully"
    });
  } catch (error) {
    console.error("Add reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}

// Get replies for a comment
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const { searchParams } = new URL(request.url);
    const parentCommentId = searchParams.get("parentCommentId");
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!parentCommentId) {
      return NextResponse.json(
        { error: "Parent Comment ID required" },
        { status: 400 }
      );
    }

    const commentsCollection = db.collection("comments");
    const replies = await commentsCollection
      .find({ parentCommentId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Fetch replies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}