import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Like/Unlike a comment
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { commentId, userId, userName } = await request.json();

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: "Comment ID and User ID required" },
        { status: 400 }
      );
    }

    const likesCollection = db.collection("likes");
    const commentsCollection = db.collection("comments");

    // Check if already liked
    const existingLike = await likesCollection.findOne({
      postId: commentId,
      userId,
      targetType: "comment"
    });

    if (existingLike) {
      // Unlike
      await likesCollection.deleteOne({ _id: existingLike._id });
      await commentsCollection.updateOne(
        { _id: new ObjectId(commentId) },
        { $inc: { likesCount: -1 } }
      );

      const updatedComment = await commentsCollection.findOne({
        _id: new ObjectId(commentId)
      });

      return NextResponse.json({
        liked: false,
        likesCount: updatedComment.likesCount || 0,
        message: "Comment unliked"
      });
    } else {
      // Like
      await likesCollection.insertOne({
        postId: commentId,
        userId,
        userName: userName || userId,
        targetType: "comment",
        createdAt: new Date()
      });

      await commentsCollection.updateOne(
        { _id: new ObjectId(commentId) },
        { $inc: { likesCount: 1 } }
      );

      const updatedComment = await commentsCollection.findOne({
        _id: new ObjectId(commentId)
      });

      return NextResponse.json({
        liked: true,
        likesCount: updatedComment.likesCount || 0,
        message: "Comment liked"
      });
    }
  } catch (error) {
    console.error("Comment like error:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
}

// Get who liked a comment
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("social-app");
    
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID required" },
        { status: 400 }
      );
    }

    const likesCollection = db.collection("likes");
    const likes = await likesCollection
      .find({
        postId: commentId,
        targetType: "comment"
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ likes });
  } catch (error) {
    console.error("Fetch comment likes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}