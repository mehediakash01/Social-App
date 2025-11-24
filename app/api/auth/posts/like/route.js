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

    if (existingLike) {
      // UNLIKE
      await likes.deleteOne({ _id: existingLike._id });

      await posts.updateOne(
        { _id: postId },
        { $inc: { likeCount: -1 } }
      );

      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    }

    // LIKE
    await likes.insertOne({
      postId,
      userId,
      createdAt: Date.now()
    });

    await posts.updateOne(
      { _id: postId },
      { $inc: { likeCount: 1 } }
    );

    return new Response(JSON.stringify({ liked: true }), { status: 200 });

  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
