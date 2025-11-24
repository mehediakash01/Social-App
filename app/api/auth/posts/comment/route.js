
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const limit = parseInt(searchParams.get("limit")) || 5; // fetch latest 5 by default

    if (!postId) {
      return new Response(JSON.stringify({ message: "Missing postId" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const commentsCollection = db.collection("comments");

    const comments = await commentsCollection
      .find({ postId: new ObjectId(postId) })
      .sort({ createdAt: -1 }) // newest first
      .limit(limit)
      .toArray();

    return new Response(JSON.stringify({ comments }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
