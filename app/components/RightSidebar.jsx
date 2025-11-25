"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RightSidebar() {
  const [friendSearch, setFriendSearch] = useState("");

  const friends = [
    { name: "Steve Jobs", role: "UI/UX expert", lastSeen: "6 minute ago", online: true ,imgUrl:"/assets/images/people1.png" },
    { name: "Ryan Roslansky", role: "Product Designer", lastSeen: "15 minute ago", online: true,imgUrl:"/assets/images/people2.png" },
    { name: "Dylan Field", role: "CEO at Figma", lastSeen: "1 hour ago", online: false,imgUrl:"/assets/images/people3.png"  },
    { name: "Steve Jobs", role: "UI/UX expert", lastSeen: "2 hours ago", online: true,imgUrl:"/assets/images/people2.png" },
    { name: "Dylan Field", role: "Software Engineer", lastSeen: "Yesterday", online: false,imgUrl:"/assets/images/people1.png"  }
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(friendSearch.toLowerCase())
  );

  return (
    <aside className="hidden lg:block w-80 lg:pr-16 fixed right-4 top-20 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="space-y-6 pl-2">
        {/* You Might Like */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">You Might Like</h3>
            <Link href="/suggestions" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              see all
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className=" rounded-full shrink-0">
                <Image width={32} height={32} alt="person" src="/assets/images/Avatar.png"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">Radovan Skidmore</p>
                <p className="text-xs text-gray-500 mt-0.5">Founder, CEO at Invision</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-sm text-gray-600 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors font-medium">
                Ignore
              </button>
              <button className="flex-1 text-sm text-white bg-blue-500 rounded-lg py-2 hover:bg-blue-600 transition-colors font-medium">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Your Friends */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Friends</h3>
            <Link href="/friends" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              see all
            </Link>
          </div>
          
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                placeholder="Input search text"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Friends List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend, i) => (
                <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="  rounded-full">
                         <Image width={32} height={32}alt="person" src={friend.imgUrl}/>
                      </div>
                      {friend.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{friend.name}</p>
                      <p className="text-xs text-gray-500 truncate">{friend.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{friend.lastSeen}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No friends found</p>
            )}
          </div>
        </div>

        {/* Active Birthdays */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Birthdays</h3>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl shrink-0">
              🎂
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Ryan Roslansky</span> and{" "}
                <span className="font-semibold">2 others</span> have birthdays today
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}