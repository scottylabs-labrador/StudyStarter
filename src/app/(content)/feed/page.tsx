"use client";
import { getFeed } from "~/lib/api/getFeed";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Photo } from "~/types";

function CardGrid({groups} : {groups: String[]}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {groups.map((group) => (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{group}</div>
            <ul>
              <li>course</li>
              <li>time</li>
              <li>location</li>
            </ul>
          </div>
          <div className="px-6 pt-4 pb-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#open</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isScrollNearBottom, setIsScrollNearBottom] = useState(false);
  const lastPhoto = useRef<string | null>(null);
  const groups = ["title1", "title2","title3"];

  // This lazily loads the photos, avoiding lag.
  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop <= 2 * target.clientHeight) {
      setIsScrollNearBottom(true);
    } else {
      setIsScrollNearBottom(false);
    }
  }

  useEffect(() => {
    if (photos.length && !isScrollNearBottom) {
      return;
    }
    const loadPhotos = async () => {
      if (user) {
        // We know this is safe because we check if the user is signed in
        const [paginatedPhotos, lastSnapshot] = await getFeed(user?.emailAddresses[0]?.emailAddress as string, lastPhoto.current, 5);
        lastPhoto.current = lastSnapshot || null;
        setPhotos([...photos, ...paginatedPhotos]);
      }
    };

    loadPhotos();
  }, [user, isScrollNearBottom]);

  

  return (
    <main className="container relative overflow-scroll h-screen" onScroll={onScroll}>                                                                                                                                                                                                                            
      <div className="p-4 font-sans">
        <p className="text-white">Filters</p>
        <div className="flex items-center mb-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#open</span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#regular</span>     
        </div>
        <div className="mt-8">
          <CardGrid groups={groups}/>
        </div>
      </div>
      <p className="text-white text-sm font-bold">Stop scrolling, it's bad for you!!</p>
    </main>
  );
}
