
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const limit = parseInt(searchParams.get("limit")) || 10;

    console.log("📖 GET comments for postId:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const commentsCollection = db.collection("comments");

    
    const comments = await commentsCollection
      .find({ 
        postId: postId,
        parentCommentId: null  
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    console.log(`✅ Found ${comments.length} top-level comments`);

    const commentsWithStringIds = comments.map(comment => ({
      ...comment,
      _id: comment._id.toString()
    }));

    return NextResponse.json({
      comments: commentsWithStringIds,
      count: comments.length
    });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { postId, userId, userName, content } = await request.json();

    console.log("💬 Creating comment:", { postId, userId, userName });

    if (!postId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const commentsCollection = db.collection("comments");
    const postsCollection = db.collection("posts");

    const comment = {
      postId: postId,
      userId,
      userName,
      content,
      likesCount: 0,
      repliesCount: 0,
      parentCommentId: null,  
      createdAt: new Date(),
    };

    const result = await commentsCollection.insertOne(comment);
    console.log("✅ Comment created:", result.insertedId);

    // Increment post's comment count
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { commentsCount: 1 } }
    );

    return NextResponse.json({
      message: "Comment created successfully",
      comment: { ...comment, _id: result.insertedId.toString() },
    }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment: " + error.message },
      { status: 500 }
    );
  }
}