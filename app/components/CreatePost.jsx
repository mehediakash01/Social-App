"use client";

import { useState, useContext, useRef } from "react";
import { Image, Video, Calendar, FileText, X, Lock, Globe } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) {
      toast.error("Please add some content or an image");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating post...");

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("isPrivate", isPrivate);
      formData.append("userId", user.uid);
      formData.append("userName", user.displayName || user.email);
      formData.append("userEmail", user.email);
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/auth/posts/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Post created successfully!", { id: loadingToast });
        setContent("");
        removeImage();
        setIsPrivate(false);
        if (onPostCreated) {
          onPostCreated(data.post);
        }
      } else {
        toast.error(data.error || "Failed to create post", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3 mb-4">
        <div className=" rounded-full shrink-0">
           <img
                    src={user?.photoURL || "/assets/images/chat6_img.png"}
                    className="w-9 h-9 rounded-full"
                  />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          className="flex-1 px-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px] max-h-[200px]"
          disabled={loading}
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-96 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-gray-900 bg-opacity-70 text-white rounded-full hover:bg-opacity-90"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Privacy Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setIsPrivate(!isPrivate)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isPrivate
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
          disabled={loading}
        >
          {isPrivate ? (
            <>
              <Lock className="w-4 h-4" />
              <span>Private</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Public</span>
            </>
          )}
        </button>
        <span className="text-xs text-gray-500">
          {isPrivate ? "Only you can see this post" : "Everyone can see this post"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={loading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Image className="w-5 h-5" />
            <span className="text-sm font-medium">Photo</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
            disabled
          >
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Video</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
            disabled
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Event</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors disabled:opacity-50"
            disabled
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Article</span>
          </button>
        </div>
        <button
          onClick={handlePost}
          disabled={loading || (!content.trim() && !selectedImage)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}