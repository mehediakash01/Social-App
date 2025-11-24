
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb"
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const content = formData.get("content");
    const isPrivate = formData.get("isPrivate") === "true";
    const userId = formData.get("userId");
    const userName = formData.get("userName");
    const userEmail = formData.get("userEmail");
    const image = formData.get("image");

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "buddyscript/posts",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("social-app");
    const postsCollection = db.collection("posts");

    // Create post document
    const post = {
      userId,
      userName,
      userEmail,
      content,
      imageUrl,
      isPrivate,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await postsCollection.insertOne(post);

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: { ...post, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}