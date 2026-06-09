"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { MessageSquare, Share2, ThumbsUp, MoreVertical, Lock, Globe, Send } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";

export default function PostCard({ post }) {
  const { user } = useContext(AuthContext);

  const isGuest = user?.role === "Guest";
  const canDeletePost = user?.role === "Super Admin" || user?.role === "Moderator" || user?.uid === post.userId;
  const canEditPost = user?.role === "Super Admin" || user?.uid === post.userId;
  const canDeleteComment = (commentUserId) => {
    return user?.role === "Super Admin" || user?.role === "Moderator" || user?.uid === commentUserId || user?.uid === post.userId;
  };
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const commentInputRef = useRef(null);

  // States
  const [currentContent, setCurrentContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState([]);

  // Comment interactions
  const [commentLikes, setCommentLikes] = useState({});
  const [showCommentLikes, setShowCommentLikes] = useState(null);
  const [commentLikesList, setCommentLikesList] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});

  useEffect(() => {
    if (showComments) {
      setComments([]);
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    if (!post._id) return;
    setLoadingComments(true);
    try {
      // Fetch only TOP-LEVEL comments
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
        body: JSON.stringify({ postId: post._id, userId: user.uid, userName: user.displayName || user.email, userImage: user.photoURL || "" }),
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
          userImage: user.photoURL || "",
          content: commentToSend,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        post.commentsCount = (post.commentsCount || 0) + 1;
        
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

  const handlePostDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Are you sure you want to delete this post?</span>
        <div className="flex gap-4 justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="text-gray-500 text-sm font-medium hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executePostDelete();
            }}
            className="text-red-600 text-sm font-medium hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const executePostDelete = async () => {
    const loadingToast = toast.loading("Deleting post...");
    try {
      const res = await fetch(`/api/auth/posts/${post._id}?userId=${user.uid}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post deleted", { id: loadingToast });
        setIsDeleted(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete post", { id: loadingToast });
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete post", { id: loadingToast });
    }
  };

  const handleEditSave = async () => {
    // Hard guard: only Super Admin or the post author can edit
    if (user?.role === "Moderator" && user?.uid !== post.userId) {
      toast.error("Moderators cannot edit other users' posts.");
      setIsEditing(false);
      return;
    }

    if (!editContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    const loadingToast = toast.loading("Updating post...");
    try {
      const res = await fetch(`/api/auth/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, content: editContent }),
      });
      if (res.ok) {
        toast.success("Post updated", { id: loadingToast });
        setCurrentContent(editContent);
        setIsEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update post", { id: loadingToast });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update post", { id: loadingToast });
    }
  };

  const handleCommentDelete = (commentId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Are you sure you want to delete this comment?</span>
        <div className="flex gap-4 justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="text-gray-500 text-sm font-medium hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeCommentDelete(commentId);
            }}
            className="text-red-600 text-sm font-medium hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const executeCommentDelete = async (commentId) => {
    const loadingToast = toast.loading("Deleting comment...");
    try {
      const res = await fetch(`/api/auth/posts/comment/${commentId}?userId=${user.uid}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Comment deleted", { id: loadingToast });
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete comment", { id: loadingToast });
      }
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error("Failed to delete comment", { id: loadingToast });
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error("Please login to like comments");
      return;
    }

    const prevState = commentLikes[commentId];
    
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
          userName: user.displayName || user.email,
          userImage: user.photoURL || "",
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

  const handleAddReply = async (parentComment) => {
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
          parentCommentId: parentComment._id,
          userId: user.uid,
          userName: user.displayName || user.email,
          userImage: user.photoURL || "",
          content: replyToSend,
          replyingToName: parentComment.userName, // Add @mention context
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setReplies(prev => ({
          ...prev,
          [parentComment._id]: [data.reply, ...(prev[parentComment._id] || [])]
        }));

        setComments(prev => prev.map(c => 
          c._id === parentComment._id 
            ? { ...c, repliesCount: (c.repliesCount || 0) + 1 }
            : c
        ));

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

  const fetchReplies = async (parentCommentId) => {
    if (replies[parentCommentId] && showReplies[parentCommentId]) {
      // Already loaded and showing, just hide
      setShowReplies(prev => ({ ...prev, [parentCommentId]: false }));
      return;
    }

    if (replies[parentCommentId]) {
      // Already loaded, just show
      setShowReplies(prev => ({ ...prev, [parentCommentId]: true }));
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

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  if (isDeleted) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image width={40} height={40} alt="user" src={post.userImage || "/assets/images/chat6_img.png"} className="rounded-full" />
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
          <div className="relative">
            {(canEditPost || canDeletePost) && (
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
            {showMenu && (canEditPost || canDeletePost) && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-10">
                {canEditPost && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                )}
                {canDeletePost && (
                  <button
                    onClick={handlePostDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {isEditing ? (
          <div className="mt-3">
            <textarea
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-none min-h-[80px]"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(currentContent);
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          currentContent && (
            <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
              {currentContent}
            </p>
          )
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
            <span onClick={handleCommentClick} className="hover:text-blue-600 cursor-pointer">
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
            onClick={handleCommentClick}
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
                    <img src={like.userImage || "/assets/images/chat6_img.png"} alt="user" className="w-10 h-10 rounded-full object-cover" />
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
                    <img src={like.userImage || "/assets/images/chat6_img.png"} alt="user" className="w-10 h-10 rounded-full object-cover" />
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
            <Image
              width={32}
              height={32}
              src={user?.photoURL || "/assets/images/chat6_img.png"}
              alt="user"
              className="rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <input
                ref={commentInputRef}
                type="text"
                placeholder={isGuest ? "Guests cannot post or comment" : "Write a comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm disabled:opacity-50"
                onKeyDown={(e) => e.key === "Enter" && !isGuest && handleAddComment()}
                disabled={isGuest}
              />
              <button
                onClick={handleAddComment}
                className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                disabled={isGuest || !commentText.trim()}
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
                    <Image
                      width={32}
                      height={32}
                      src={c.userImage || "/assets/images/chat6_img.png"}
                      alt="commenter"
                      className="rounded-full flex-shrink-0"
                    />
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
                          onClick={() => setReplyingTo(replyingTo === c._id ? null : c)}
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
                        {canDeleteComment(c.userId) && (
                          <button
                            onClick={() => handleCommentDelete(c._id)}
                            className="hover:text-red-600 text-gray-500 font-medium ml-auto"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Reply Input */}
                      {replyingTo?._id === c._id && (
                        <div className="flex items-center gap-2 mt-2 ml-3">
                          <Image
                            width={24}
                            height={24}
                            src={user?.photoURL || "/assets/images/chat6_img.png"}
                            alt="user"
                            className="rounded-full flex-shrink-0"
                          />
                          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                            <input
                              type="text"
                              placeholder={isGuest ? "Guests cannot post or comment" : `Reply to @${c.userName}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 bg-transparent focus:outline-none text-xs disabled:opacity-50"
                              onKeyDown={(e) => e.key === "Enter" && !isGuest && handleAddReply(c)}
                              disabled={isGuest}
                            />
                            <button
                              onClick={() => handleAddReply(c)}
                              className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                              disabled={isGuest || !replyText.trim()}
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
                              <Image
                                width={28}
                                height={28}
                                src={reply.userImage || "/assets/images/chat6_img.png"}
                                alt="replier"
                                className="rounded-full flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="bg-gray-50 p-2.5 rounded-xl">
                                  <p className="font-semibold text-xs">
                                    {reply.userName}
                                    {reply.replyingToName && (
                                      <span className="text-blue-600 ml-1">
                                        @{reply.replyingToName}
                                      </span>
                                    )}
                                  </p>
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