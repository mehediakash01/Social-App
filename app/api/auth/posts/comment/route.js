
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { postId, userId, userName, content } = await req.json();

    if (!postId || !userId || !content) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const posts = db.collection("posts");
    const comments = db.collection("comments");

    const newComment = {
      postId: new ObjectId(postId),
      userId,
      userName,
      content,
      createdAt: new Date(),
    };

    const result = await comments.insertOne(newComment);

    // increment commentCount in post
    await posts.updateOne(
      { _id: new ObjectId(postId) },
      { $inc: { commentsCount: 1 } }
    );

    return new Response(
      JSON.stringify({ comment: newComment }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
