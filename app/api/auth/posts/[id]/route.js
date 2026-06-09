import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // postId
    
    // We can expect userId in searchParams or body. For DELETE, searchParams is common.
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const postsCollection = db.collection("posts");
    const usersCollection = db.collection("users");

    // Fetch user to get their role securely
    const user = await usersCollection.findOne({ userId });
    const role = user?.role || "Regular User";

    if (role === "Guest") {
      return NextResponse.json({ error: "Forbidden: Guests cannot perform this action." }, { status: 403 });
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // RBAC Logic
    if (role === "Super Admin" || role === "Moderator") {
      // Allow unconditionally
    } else if (post.userId === userId) {
      // Allow if author
    } else {
      return NextResponse.json({ error: "Forbidden: You don't have permission to delete this post." }, { status: 403 });
    }

    await postsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { userId, content } = await request.json();

    if (!userId || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("social-app");
    const postsCollection = db.collection("posts");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ userId });
    const role = user?.role || "Regular User";

    if (role === "Guest") {
      return NextResponse.json({ error: "Forbidden: Guests cannot perform this action." }, { status: 403 });
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // RBAC Logic — Only Super Admin and the post author can EDIT
    if (role === "Super Admin") {
      // Allow unconditionally
    } else if (post.userId === userId) {
      // Allow if author
    } else {
      return NextResponse.json({ error: "Forbidden: You don't have permission to edit this post." }, { status: 403 });
    }

    await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: content, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
