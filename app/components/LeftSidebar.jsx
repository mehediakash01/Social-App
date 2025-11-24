"use client";

import { BookOpen, Lightbulb, UserPlus, Bookmark, Users, Gamepad2, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LeftSidebar() {
  return (
    <aside className="hidden lg:block w-64 fixed left-4 top-20 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="space-y-6 pr-2">
        {/* Explore Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Explore</h3>
          <nav className="space-y-1">
            <Link href="/learning" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <BookOpen className="w-5 h-5 group-hover:text-blue-600" />
              <span className="flex-1">Learning</span>
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-medium">Live</span>
            </Link>
            <Link href="/insights" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Lightbulb className="w-5 h-5 group-hover:text-blue-600" />
              <span>Insights</span>
            </Link>
            <Link href="/find-friends" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <UserPlus className="w-5 h-5 group-hover:text-blue-600" />
              <span>Find Friends</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Bookmark className="w-5 h-5 group-hover:text-blue-600" />
              <span>Bookmarks</span>
            </Link>
            <Link href="/groups" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Users className="w-5 h-5 group-hover:text-blue-600" />
              <span>Group</span>
            </Link>
            <Link href="/gaming" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Gamepad2 className="w-5 h-5 group-hover:text-blue-600" />
              <span className="flex-1">Gaming</span>
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-medium">Live</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Settings className="w-5 h-5 group-hover:text-blue-600" />
              <span>Settings</span>
            </Link>
            <Link href="/saved" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group">
              <Bookmark className="w-5 h-5 group-hover:text-blue-600" />
              <span>Save post</span>
            </Link>
          </nav>
        </div>

        {/* Suggested People */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Suggested People</h3>
            <Link href="/suggestions" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              see all
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Steve Jobs", role: "UI/UX expert",imgUrl:"/assets/images/people1.png" },
              { name: "Ryan Roslansky", role: "Product Designer",imgUrl:"/assets/images/people2.png"  },
              { name: "Dylan Field", role: "Software Engineer",imgUrl:"/assets/images/people3.png"  }
            ].map((person, i) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10  rounded-full shrink-0">
                      <Image width={24} height={24} alt="no more terrorism" src={person.imgUrl}/>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{person.name}</p>
                    <p className="text-xs text-gray-500 truncate">{person.role}</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Events</h3>
            <Link href="/events" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              see all
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { date: "15 Mar", title: "He more bernamn no mela cry", attendees: 23 },
              { date: "20 Mar", title: "Design Conference 2024", attendees: 45 }
            ].map((event, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="w-full  rounded-lg mb-3">
                  <Image width={400} height={300} alt="no more terrorism" src="/assets/images/feed_event1.png"/>
                </div>
                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded inline-block mb-2 font-medium">
                  {event.date}
                </div>
                <p className="font-medium text-sm text-gray-800 mb-1">{event.title}</p>
                <p className="text-xs text-gray-500 mb-3">{event.attendees} People Going</p>
                <button className="w-full text-sm text-blue-500 border border-blue-500 rounded py-1.5 hover:bg-blue-50 transition-colors font-medium">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}