"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StorySection from "../components/StorySection";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access feed");
      router.push("/login");
    }
  }, [user, router]);

  // Fetch posts
  const fetchPosts = async (pageNum = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/auth/posts/get?userId=${user.uid}&page=${pageNum}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchPosts(1);
    }
  }, [user]);

  // Handle new post created
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Load more posts
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  if (!user) {
    return null; // Or loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="pt-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex gap-6">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Feed */}
            <main className="flex-1 lg:ml-72 lg:mr-72 pb-8">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Story Section */}
                <StorySection />

                {/* Create Post */}
                <CreatePost onPostCreated={handlePostCreated} />

                {/* Posts Loading State */}
                {loading && page === 1 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <>
                    {/* Post Cards */}
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="text-center py-4">
                        <button
                          onClick={loadMore}
                          disabled={loading}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-500">
                      Be the first to share something with the community!
                    </p>
                  </div>
                )}
              </div>
            </main>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}