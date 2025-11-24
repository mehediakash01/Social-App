
import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Get replies for a comment
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { searchParams } = new URL(request.url);
    const parentCommentId = searchParams.get("parentCommentId");
    const limit = parseInt(searchParams.get("limit")) || 10;

    console.log("📖 GET replies for parentCommentId:", parentCommentId);

    if (!parentCommentId) {
      return NextResponse.json(
        { error: "Parent Comment ID required" },
        { status: 400 }
      );
    }

    const commentsCollection = db.collection("comments");
    
    const replies = await commentsCollection
      .find({ parentCommentId: parentCommentId })
      .sort({ createdAt: 1 }) 
      .limit(limit)
      .toArray();

    console.log(`✅ Found ${replies.length} replies`);

    // Convert ObjectId to string
    const repliesWithStringIds = replies.map(reply => ({
      ...reply,
      _id: reply._id.toString()
    }));

    return NextResponse.json({ 
      replies: repliesWithStringIds,
      count: replies.length
    });
  } catch (error) {
    console.error("❌ Fetch replies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

// Add a reply to a comment
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { postId, parentCommentId, userId, userName, content, replyingToName } = await request.json();

    console.log("💬 Creating reply:", { postId, parentCommentId, userId, userName });

    if (!postId || !parentCommentId || !userId || !content) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const commentsCollection = db.collection("comments");

    const reply = {
      postId,
      parentCommentId,  
      userId,
      userName: userName || userId,
      content,
      replyingToName: replyingToName || null,  
      likesCount: 0,
      repliesCount: 0,  
      createdAt: new Date()
    };

    const result = await commentsCollection.insertOne(reply);
    reply._id = result.insertedId.toString();

    console.log("✅ Reply created:", reply._id);

    await commentsCollection.updateOne(
      { _id: new ObjectId(parentCommentId) },
      { $inc: { repliesCount: 1 } }
    );

    return NextResponse.json({
      reply,
      message: "Reply added successfully"
    });
  } catch (error) {
    console.error("❌ Add reply error:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}