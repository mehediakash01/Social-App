import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // commentId
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const commentsCollection = db.collection("comments");
    const postsCollection = db.collection("posts");
    const usersCollection = db.collection("users");

    // Fetch user to get their role
    const user = await usersCollection.findOne({ userId });
    const role = user?.role || "Regular User";

    if (role === "Guest") {
      return NextResponse.json({ error: "Forbidden: Guests cannot delete comments." }, { status: 403 });
    }

    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    let isAuthorized = false;

    // RBAC Logic
    if (role === "Super Admin" || role === "Moderator") {
      isAuthorized = true;
    } else if (comment.userId === userId) {
      // User B - Comment Author
      isAuthorized = true;
    } else {
      // User A - Post Owner?
      const post = await postsCollection.findOne({ _id: new ObjectId(comment.postId) });
      if (post && post.userId === userId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to delete this comment." }, { status: 403 });
    }

    await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    
    // Decrement post's comment count
    if (comment.postId) {
       await postsCollection.updateOne(
        { _id: new ObjectId(comment.postId) },
        { $inc: { commentsCount: -1 } }
      );
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
