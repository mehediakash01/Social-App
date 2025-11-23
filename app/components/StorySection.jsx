"use client";

import { Plus } from "lucide-react";

export default function StorySection() {
  const stories = [
    { name: "Your Story", hasStory: false, isYour: true },
    { name: "Ryan Roslansky", hasStory: true },
    { name: "Dylan Roslansky", hasStory: true },
    { name: "Jenn Roslansky", hasStory: true },
    { name: "Steve Jobs", hasStory: true },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {stories.map((story, i) => (
          <div key={i} className="shrink-0 text-center cursor-pointer group">
            <div className={`relative ${story.hasStory && !story.isYour ? 'p-0.5 bg-linear-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl' : ''}`}>
              <div className={`w-16 h-16 ${story.hasStory && !story.isYour ? 'bg-white p-0.5' : ''} rounded-xl overflow-hidden`}>
                <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {story.isYour && (
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 truncate w-16 font-medium group-hover:text-blue-600">
              {story.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}