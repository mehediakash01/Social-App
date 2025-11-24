"use client";

import { useContext, useState, useEffect } from "react";
import { MessageSquare, Share2, ThumbsUp, MoreVertical, Lock, Globe, Send } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);

  // States
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState([]);

  // New states for comment interactions
  const [commentLikes, setCommentLikes] = useState({}); // {commentId: {liked, count}}
  const [showCommentLikes, setShowCommentLikes] = useState(null); // commentId
  const [commentLikesList, setCommentLikesList] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({}); // {commentId: [replies]}
  const [showReplies, setShowReplies] = useState({}); // {commentId: boolean}
  const [loadingReplies, setLoadingReplies] = useState({});

  // Fetch comments when opening comment section
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    if (!post._id) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/auth/posts/comment?postId=${post._id}&limit=10`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments || []);
        
        // Initialize comment likes state
        const likesState = {};
        data.comments.forEach(comment => {
          likesState[comment._id] = {
            liked: false,
            count: comment.likesCount || 0
          };
        });
        setCommentLikes(likesState);
      } else {
        console.error("Failed to fetch comments:", data.error);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

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
      } else {
        setLiked(prevLiked);
        setLikesCount(prevCount);
        toast.error(data.error || "Failed to like post");
      }
    } catch (err) {
      console.error("Like error:", err);
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to like post");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const commentToSend = commentText;
    setCommentText(""); 

    try {
      const res = await fetch("/api/auth/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          userId: user.uid,
          userName: user.displayName || user.email,
          content: commentToSend,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        post.commentsCount = (post.commentsCount || 0) + 1;
        
        // Initialize likes state for new comment
        setCommentLikes(prev => ({
          ...prev,
          [data.comment._id]: { liked: false, count: 0 }
        }));
        
        toast.success("Comment added!");
      } else {
        setCommentText(commentToSend);
        toast.error(data.error || "Failed to add comment");
      }
    } catch (err) {
      console.error("Comment error:", err);
      setCommentText(commentToSend);
      toast.error("Failed to add comment");
    }
  };

  // Like/Unlike Comment
  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Please login to like comments");
      return;
    }

    const prevState = commentLikes[commentId];
    
    // Optimistic update
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: {
        liked: !prevState.liked,
        count: prevState.liked ? prevState.count - 1 : prevState.count + 1
      }
    }));

    try {
      const res = await fetch("/api/auth/posts/comment/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          userId: user.uid,
          userName: user.displayName || user.email
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: {
            liked: data.liked,
            count: data.likesCount
          }
        }));
      } else {
        // Revert on error
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: prevState
        }));
        toast.error(data.error || "Failed to like comment");
      }
    } catch (err) {
      console.error("Like comment error:", err);
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: prevState
      }));
      toast.error("Failed to like comment");
    }
  };

  // Fetch who liked a comment
  const fetchCommentLikes = async (commentId) => {
    try {
      const res = await fetch(`/api/auth/posts/comment/like?commentId=${commentId}`);
      const data = await res.json();
      if (res.ok) {
        setCommentLikesList(data.likes || []);
        setShowCommentLikes(commentId);
      }
    } catch (err) {
      console.error("Fetch comment likes error:", err);
      toast.error("Failed to load likes");
    }
  };

  // Add Reply
  const handleAddReply = async (parentCommentId) => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }

    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    const replyToSend = replyText;
    setReplyText("");

    try {
      const res = await fetch("/api/auth/posts/comment/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post._id,
          parentCommentId,
          userId: user.uid,
          userName: user.displayName || user.email,
          content: replyToSend,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Add reply to state
        setReplies(prev => ({
          ...prev,
          [parentCommentId]: [data.reply, ...(prev[parentCommentId] || [])]
        }));

        // Update comment replies count
        setComments(prev => prev.map(c => 
          c._id === parentCommentId 
            ? { ...c, repliesCount: (c.repliesCount || 0) + 1 }
            : c
        ));

        // Initialize likes state for new reply
        setCommentLikes(prev => ({
          ...prev,
          [data.reply._id]: { liked: false, count: 0 }
        }));

        setReplyingTo(null);
        toast.success("Reply added!");
      } else {
        setReplyText(replyToSend);
        toast.error(data.error || "Failed to add reply");
      }
    } catch (err) {
      console.error("Reply error:", err);
      setReplyText(replyToSend);
      toast.error("Failed to add reply");
    }
  };

  // Fetch Replies
  const fetchReplies = async (parentCommentId) => {
    if (replies[parentCommentId]) {
      // Already loaded, just toggle
      setShowReplies(prev => ({ ...prev, [parentCommentId]: !prev[parentCommentId] }));
      return;
    }

    setLoadingReplies(prev => ({ ...prev, [parentCommentId]: true }));
    
    try {
      const res = await fetch(`/api/auth/posts/comment/reply?parentCommentId=${parentCommentId}&limit=10`);
      const data = await res.json();
      
      if (res.ok) {
        setReplies(prev => ({
          ...prev,
          [parentCommentId]: data.replies || []
        }));

        // Initialize likes state for replies
        const likesState = {};
        data.replies.forEach(reply => {
          likesState[reply._id] = {
            liked: false,
            count: reply.likesCount || 0
          };
        });
        setCommentLikes(prev => ({ ...prev, ...likesState }));

        setShowReplies(prev => ({ ...prev, [parentCommentId]: true }));
      }
    } catch (err) {
      console.error("Fetch replies error:", err);
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies(prev => ({ ...prev, [parentCommentId]: false }));
    }
  };

  const fetchLikesList = async () => {
    if (!post._id) return;
    try {
      const res = await fetch(`/api/auth/posts/like?postId=${post._id}`);
      const data = await res.json();
      if (res.ok) {
        setLikesList(data.likes || []);
        setShowLikes(true);
      }
    } catch (err) {
      console.error("Fetch likes error:", err);
      toast.error("Failed to load likes");
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className=" rounded-full shrink-0" />
            <Image width={32} height={32} alt="user" src="/assets/images/chat6_img.png" />
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
            <button 
              onClick={fetchLikesList}
              className="hover:text-blue-600 cursor-pointer hover:underline"
            >
              {likesCount} {likesCount === 1 ? "Like" : "Likes"}
            </button>
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
            <span className="text-sm font-medium">Like</span>
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

      {/* Show Post Likes Modal */}
      {showLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowLikes(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">People who liked this post</h3>
              <button onClick={() => setShowLikes(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {likesList.length > 0 ? (
                likesList.map((like) => (
                  <div key={like._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">{like.userName || like.userId}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(like.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No likes yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show Comment Likes Modal */}
      {showCommentLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCommentLikes(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">People who liked this comment</h3>
              <button onClick={() => setShowCommentLikes(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commentLikesList.length > 0 ? (
                commentLikesList.map((like) => (
                  <div key={like._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">{like.userName || like.userId}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(like.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No likes yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Add Comment */}
          <div className="flex items-center gap-3 mt-4">
            <div className=" rounded-full shrink-0" >
               <img
                    src={user?.photoURL || "/assets/images/chat6_img.png"}
                    className="w-10 h-10 rounded-full"
                  />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                disabled={!commentText.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="mt-4 space-y-4">
              {comments.map((c) => (
                <div key={c._id}>
                  {/* Comment */}
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full shrink-0" >
                       <img
                    src={user?.photoURL || "/assets/images/chat6_img.png"}
                    className="w-9 h-9 rounded-full"
                  />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 p-3 rounded-xl">
                        <p className="font-semibold text-sm">{c.userName}</p>
                        <p className="text-sm text-gray-700 mt-1">{c.content}</p>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1 ml-3">
                        <span>{getTimeAgo(c.createdAt)}</span>
                        <button 
                          onClick={() => handleLikeComment(c._id)}
                          className={`hover:text-blue-600 font-medium ${
                            commentLikes[c._id]?.liked ? "text-blue-600" : ""
                          }`}
                        >
                          Like {commentLikes[c._id]?.count > 0 && `(${commentLikes[c._id].count})`}
                        </button>
                        {commentLikes[c._id]?.count > 0 && (
                          <button 
                            onClick={() => fetchCommentLikes(c._id)}
                            className="hover:text-blue-600 font-medium"
                          >
                            See likes
                          </button>
                        )}
                        <button 
                          onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                          className="hover:text-blue-600 font-medium"
                        >
                          Reply
                        </button>
                        {c.repliesCount > 0 && (
                          <button 
                            onClick={() => fetchReplies(c._id)}
                            className="hover:text-blue-600 font-medium flex items-center gap-1"
                          >
                            {loadingReplies[c._id] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
                            ) : (
                              <span>
                                {showReplies[c._id] ? "Hide" : "View"} {c.repliesCount} {c.repliesCount === 1 ? "reply" : "replies"}
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Reply Input */}
                      {replyingTo === c._id && (
                        <div className="flex items-center gap-2 mt-2 ml-3">
                          <div className=" rounded-full shrink-0" >
                             <img
                    src={user?.photoURL || "/assets/images/chat6_img.png"}
                    className="w-6 h-6 rounded-full"
                  />
                          </div>
                          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 bg-transparent focus:outline-none text-xs"
                              onKeyDown={(e) => e.key === "Enter" && handleAddReply(c._id)}
                            />
                            <button
                              onClick={() => handleAddReply(c._id)}
                              className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                              disabled={!replyText.trim()}
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {showReplies[c._id] && replies[c._id] && (
                        <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-200 pl-3">
                          {replies[c._id].map((reply) => (
                            <div key={reply._id} className="flex items-start gap-2">
                              <div className="w-7 h-7 bg-linear-to-br from-green-400 to-blue-500 rounded-full shrink-0" />
                              <div className="flex-1">
                                <div className="bg-gray-50 p-2.5 rounded-xl">
                                  <p className="font-semibold text-xs">{reply.userName}</p>
                                  <p className="text-xs text-gray-700 mt-1">{reply.content}</p>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-500 mt-1 ml-2">
                                  <span>{getTimeAgo(reply.createdAt)}</span>
                                  <button 
                                    onClick={() => handleLikeComment(reply._id)}
                                    className={`hover:text-blue-600 font-medium ${
                                      commentLikes[reply._id]?.liked ? "text-blue-600" : ""
                                    }`}
                                  >
                                    Like {commentLikes[reply._id]?.count > 0 && `(${commentLikes[reply._id].count})`}
                                  </button>
                                  {commentLikes[reply._id]?.count > 0 && (
                                    <button 
                                      onClick={() => fetchCommentLikes(reply._id)}
                                      className="hover:text-blue-600 font-medium"
                                    >
                                      See likes
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}