"use client";
import { getFeed } from "~/lib/api/getFeed";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import PostCard  from "~/components/PostCard";
import { Photo } from "~/types";
import Details from "~/components/Details";
import groupDetails from "~/types/groupDetails";
export default function FeedPage() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isScrollNearBottom, setIsScrollNearBottom] = useState(false);
  const lastPhoto = useRef<string | null>(null);

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

  const photoCards = photos.map((photo) => (
    photo && <></> // What should go here?  How do we render a post card?
  ))

  // Create sampel groupDetails
  const sampleGroup: groupDetails = {
    groupName: "Concepts Preparation",
    numParticipants: 3,
    totalSeats: 4,
    location: "Giant Eagle",
    time: "Sun, Oct 6: 4:00 - 5:00pm",
    course: "21-127",
    participantDetails: ["Jane", "Doe"],
    details: "This is for Greggo's Class, not Newstead's!"
  }





  return (
    <main className="container relative overflow-scroll h-screen" onScroll={onScroll}>
      <p className="text-4xl text-white font-bold pt-4 text-center">Study Groups</p>
      <Details details={sampleGroup}></Details>
      <div className="container flex flex-col items-center justify-center gap-12 py-[1rem]">
        <div className="grid grid-cols-1">
          {photoCards}
        </div>
      </div>
    </main>
  );
}
