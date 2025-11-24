"use client";

import { useContext, useState, useEffect } from "react";
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  MoreVertical,
  Lock,
  Globe,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);

  // States
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Check if user already liked
  useEffect(() => {
    if (post.likes && user) setLiked(post.likes.includes(user.uid));
  }, [post.likes, user]);

  // Fetch latest comments when opening comment section
  useEffect(() => {
    if (showComments && comments.length === 0) fetchComments();
  }, [showComments]);

  const fetchComments = async () => {
    if (!post._id) return;
    setLoadingComments(true);
    try {
      const res = await fetch(
        `/api/auth/posts/comment?postId=${post._id}&limit=5`
      );
      const data = await res.json();
      if (res.ok) setComments(data.comments || []);
    } catch (err) {
      console.log("Fetch comments error:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, userId: user.uid }),
      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.log("Like Error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return;
    try {
      const res = await fetch("/api/auth/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          userId: user.uid,
          userName: user.displayName || user.email,
          content: commentText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentText("");
        post.commentsCount += 1;
      }
    } catch (err) {
      console.log("Comment Error:", err);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-gray-800">
                {post.userName || "Anonymous"}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{getTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  {post.isPrivate ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        {post.content && (
          <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
            {post.content}
          </p>
        )}
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                <ThumbsUp className="w-3 h-3 text-white" fill="white" />
              </div>
            </div>
            <span className="hover:text-blue-600 cursor-pointer">
              {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-blue-600 cursor-pointer">
              {post.commentsCount || 0} Comments
            </span>
            <span className="hover:text-blue-600 cursor-pointer">
              {post.sharesCount || 0} Shares
            </span>
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center ${
              liked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${liked ? "fill-blue-600" : ""}`} />
            <span className="text-sm font-medium">
              {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors flex-1 justify-center"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors flex-1 justify-center">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 mt-2">
          {/* Add Comment */}
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full shrink-0" />
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
          </div>

          {/* Comments List */}
          {loadingComments && (
            <p className="text-sm text-gray-400 mt-2">Loading comments...</p>
          )}

          {comments.length > 0 && (
            <div className="mt-3 space-y-2">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="flex items-start gap-2"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0" />
                  <div className="bg-gray-100 p-2 rounded-xl flex-1">
                    <p className="font-semibold text-sm">{c.userName}</p>
                    <p className="text-sm text-gray-700">{c.content}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <button className="hover:text-blue-600">Like</button>
                      <button className="hover:text-blue-600">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View previous comments */}
          {post.commentsCount > comments.length && (
            <button
              onClick={fetchComments}
              className="text-sm text-gray-500 mt-2 hover:text-blue-600"
            >
              View all {post.commentsCount} comments
            </button>
          )}
        </div>
      )}
    </div>
  );
}
