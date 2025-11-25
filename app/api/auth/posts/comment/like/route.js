
import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { commentId, userId, userName } = await request.json();

    console.log("👍 Like/Unlike comment:", { commentId, userId });

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: "Missing commentId or userId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const likesCollection = db.collection("likes");
    const commentsCollection = db.collection("comments");

    // Check if already liked
    const existingLike = await likesCollection.findOne({
      postId: commentId, // We reuse postId field for commentId
      userId: userId,
      targetType: "comment" // or "reply" - doesn't matter, same logic
    });

    let liked;
    let likesCount;

    if (existingLike) {
      // UNLIKE
      console.log("💔 Unliking comment...");
      await likesCollection.deleteOne({ _id: existingLike._id });
      
      const updateResult = await commentsCollection.findOneAndUpdate(
        { _id: new ObjectId(commentId) },
        { $inc: { likesCount: -1 } },
        { returnDocument: 'after' }
      );
      
      likesCount = updateResult.likesCount || 0;
      liked = false;
      console.log("✅ Comment unliked, new count:", likesCount);
    } else {
      // LIKE
      console.log("❤️ Liking comment...");
      await likesCollection.insertOne({
        postId: commentId, // Reuse postId field
        userId: userId,
        userName: userName,
        targetType: "comment",
        createdAt: new Date(),
      });

      const updateResult = await commentsCollection.findOneAndUpdate(
        { _id: new ObjectId(commentId) },
        { $inc: { likesCount: 1 } },
        { returnDocument: 'after' }
      );

      likesCount = updateResult.likesCount || 1;
      liked = true;
      console.log("✅ Comment liked, new count:", likesCount);
    }

    return NextResponse.json({
      liked,
      likesCount,
      message: liked ? "Comment liked" : "Comment unliked"
    });
  } catch (error) {
    console.error("❌ Error liking/unliking comment:", error);
    return NextResponse.json(
      { error: "Failed to like/unlike comment: " + error.message },
      { status: 500 }
    );
  }
}

// Get list of users who liked a comment
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    console.log("👥 Getting likes for commentId:", commentId);

    if (!commentId) {
      return NextResponse.json(
        { error: "Missing commentId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const likesCollection = db.collection("likes");

    const likes = await likesCollection
      .find({ postId: commentId, targetType: "comment" })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`✅ Found ${likes.length} likes`);

    const likesWithStringIds = likes.map(like => ({
      ...like,
      _id: like._id.toString()
    }));

    return NextResponse.json({
      likes: likesWithStringIds,
      count: likes.length
    });
  } catch (error) {
    console.error("❌ Error fetching comment likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes: " + error.message },
      { status: 500 }
    );
  }
}