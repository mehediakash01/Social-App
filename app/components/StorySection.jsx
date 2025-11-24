"use client";

import { Plus, ArrowRight } from "lucide-react";

export default function StorySection() {
  const stories = [
    { name: "Your Story", isYour: true, imgUrl: "/assets/images/card_ppl1.png" },
    { name: "Ryan Roslansky", imgUrl: "/assets/images/card_ppl2.png" },
    { name: "Dylan Roslansky", imgUrl: "/assets/images/card_ppl3.png" },
    { name: "More Stories", imgUrl: "/assets/images/card_ppl2.png", isLast: true },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {stories.map((story, i) => (
          <div key={i} className="shrink-0 text-center cursor-pointer group">
            <div className="relative">
              {/* Story Card */}
              <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-200 relative shadow-sm hover:shadow-md transition">
                <img
                  src={story.imgUrl}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />

                {/* Your Story (+ Button) */}
                {story.isYour && (
                  <div className="absolute bottom-2 left-2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow">
                    <Plus className="text-white w-4 h-4" />
                  </div>
                )}

                {/* Other stories avatar */}
                {!story.isYour && !story.isLast && (
                  <img
                    src={story.imgUrl}
                    alt="avatar"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-white shadow"
                  />
                )}

                {/* Last Story → Arrow Button */}
                {story.isLast && (
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow border-2 border-white">
                    <ArrowRight className="text-white w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <p className="text-xs text-gray-600 mt-2 truncate w-24 font-medium group-hover:text-blue-600">
              {story.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
