
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { postId, userId, userName, userImage } = await request.json();

    console.log("👍 Like/Unlike request:", { postId, userId });

    if (!postId || !userId) {
      return NextResponse.json(
        { error: "Missing postId or userId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const likesCollection = db.collection("likes");
    const postsCollection = db.collection("posts");

    // Check if already liked
    const existingLike = await likesCollection.findOne({
      postId: postId, 
      userId: userId,
      targetType: "post"
    });

    let liked;
    let likesCount;

    if (existingLike) {
      // UNLIKE
      console.log("💔 Unliking post...");
      await likesCollection.deleteOne({ _id: existingLike._id });
      
      const updateResult = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $inc: { likesCount: -1 } },
        { returnDocument: 'after' }
      );
      
      likesCount = updateResult.likesCount || 0;
      liked = false;
      console.log("✅ Post unliked, new count:", likesCount);
    } else {
      // LIKE
      console.log("❤️ Liking post...");
      await likesCollection.insertOne({
        postId: postId, 
        userId: userId,
        userName: userName || userId,
        userImage: userImage,
        targetType: "post",
        createdAt: new Date(),
      });

      const updateResult = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $inc: { likesCount: 1 } },
        { returnDocument: 'after' }
      );

      likesCount = updateResult.likesCount || 1;
      liked = true;
      console.log("✅ Post liked, new count:", likesCount);
    }

    return NextResponse.json({
      liked,
      likesCount,
      message: liked ? "Post liked" : "Post unliked"
    });
  } catch (error) {
    console.error("❌ Error liking/unliking post:", error);
    return NextResponse.json(
      { error: "Failed to like/unlike post: " + error.message },
      { status: 500 }
    );
  }
}

// Get list of users who liked
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    console.log("👥 Getting likes for postId:", postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const likesCollection = db.collection("likes");

    const likes = await likesCollection
      .find({ postId: postId, targetType: "post" })
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
    console.error("❌ Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes: " + error.message },
      { status: 500 }
    );
  }
}