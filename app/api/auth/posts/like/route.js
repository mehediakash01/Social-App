import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");

    const likes = db.collection("likes");
    const posts = db.collection("posts");

    // Check if already liked
    const existingLike = await likes.findOne({ postId, userId });

    let liked;
    if (existingLike) {
      // UNLIKE
      await likes.deleteOne({ _id: existingLike._id });
      await posts.updateOne({ _id: new ObjectId(postId) }, { $inc: { likesCount: -1 } });
      liked = false;
    } else {
      // LIKE
      await likes.insertOne({ postId, userId, createdAt: Date.now() });
      await posts.updateOne({ _id: new ObjectId(postId) }, { $inc: { likesCount: 1 } });
      liked = true;
    }

    // Get updated likesCount
    const post = await posts.findOne({ _id: new ObjectId(postId) });
    const likesCount = post?.likesCount ?? 0;

    return new Response(JSON.stringify({ liked, likesCount }), { status: 200 });

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
